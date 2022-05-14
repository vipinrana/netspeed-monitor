let downloadElement = document.getElementsByClassName('download-content');
let uploadElement = document.getElementsByClassName('upload-content');
const { networkStats, ipcRenderer } = window.electronAPI;

// change the downloading and uploading speed on setInterval
setInterval(function () {
    networkStats().then(data => {
        downloadElement[0].textContent = `${(data[0].rx_sec / 1000).toFixed(2)} kb/s`;
        uploadElement[0].textContent = `${(data[0].tx_sec / 1000).toFixed(2)} kb/s`;
    })
}, 1000);

window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    window.electronAPI.ipcRenderer.send('show-context-menu');

});