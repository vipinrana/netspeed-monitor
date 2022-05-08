const { contextBridge, ipcRenderer } = require('electron');
const systeminformation = require('systeminformation');
contextBridge.exposeInMainWorld('electronAPI', {
    networkStats: systeminformation.networkStats,
    ipcRenderer: { ...ipcRenderer },
    onResponse: (fn) => {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on('context-menu-command', (event, ...args) => fn(...args));
    }
})