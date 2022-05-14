const { app, BrowserWindow, Menu, ipcMain, Tray, nativeImage } = require('electron');
const path = require('path');
const Positioner = require('electron-positioner');
const { imagePath, preloadFile } = require('./src/js/util');

let trayIcon;

class NetworkSpeedMonitor {
    mainWindow;
    #menuItem = null;
    #modifiedMenuItem = null;
    #positioner;
    Menu = null;
    constructor(Menu, BrowserWindow) {
        this.Menu = Menu;
        this.BrowserWindow = BrowserWindow;
    }

    /**
     * @description this method is used to create the application window
     * @returns void
     */
    createWindow() {

        // call the BrowserWindow constructor to set the window
        this.mainWindow = new this.BrowserWindow({
            width: 210,
            height: 70,
            backgroundColor: '#2E3436',
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: true,
                preload: preloadFile
            },
            icon: imagePath,
            frame: true,
            alwaysOnTop: true,
            maximizable: false,
            minimizable: false,
            resizable: false,
            closable: false,
            movable: true,
            opacity: 0.8,
            titleBarOverlay: false,
            titleBarStyle: 'hidden',
            skipTaskbar: true
        });

        //load the BrowserWindow html
        this.mainWindow.loadFile('./src/index.html');

        // set the default position of window
        this.#positioner = new Positioner(this.mainWindow);
        this.#positioner.move('bottomRight');

        // call the method to set the context menu
        this.#ipcConnection();
        // call the method to create the tray
        this.#creatingTray();
    }

    /**
     * @description this method is used to call the context menu on right click of application window
     * @returns void
     */
    #ipcConnection() {
        let menuTemplate = [
            {
                label: 'Position',
                submenu: [
                    {
                        label: 'Bottom Right',
                        type: 'checkbox',
                        role: 'bottomRight',
                        checked: true,
                        click: () => {
                            this.#modifiedMenuItem = this.#changePosition('bottomRight', this.#menuItem);
                        }
                    },
                    {
                        label: 'Bottom Left',
                        type: 'checkbox',
                        role: 'bottomLeft',
                        click: () => {
                            this.#modifiedMenuItem = this.#changePosition('bottomLeft', this.#menuItem);
                        }
                    },
                    {
                        label: 'Top Right',
                        type: 'checkbox',
                        role: 'topRight',
                        click: () => {
                            this.#modifiedMenuItem = this.#changePosition('topRight', this.#menuItem);
                        }
                    },
                    {
                        label: 'Top Left',
                        type: 'checkbox',
                        role: 'topLeft',
                        click: () => {
                            this.#modifiedMenuItem = this.#changePosition('topLeft', this.#menuItem);
                        }
                    }
                ]
            }
        ];

        ipcMain.on('show-context-menu', (event) => {
            let menu = this.Menu.buildFromTemplate(this.#modifiedMenuItem ? this.#modifiedMenuItem : menuTemplate);
            this.Menu.setApplicationMenu(menu);
            this.#menuItem = this.Menu.getApplicationMenu();
            menu.popup(this.BrowserWindow.fromWebContents(event.sender));
        });
    }

    /**
     * @description this method is used to set the tray icon and context menu for tray icon
     * @returns void
     */
    #creatingTray() {
        //call the constructor to set the app tray image
        trayIcon = new Tray(imagePath);
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Quit',
                type: 'checkbox',
                click: () => {
                    app.exit();
                }
            }
        ])

        // call it to set context menu for tray icon
        trayIcon.setContextMenu(contextMenu);
    }

    /**
     * @description this method is used to change position of application window
     * @param {string} position
     * @param {object} menuItem
     * @returns {object} menuTemplate
     */
    #changePosition(position, menuItem) {
        let menuTemplate = [{
            label: 'Position',
            submenu: []
        }];
        menuItem?.items[0]?.submenu?.items.forEach(m => {
            let checked = m.role === position.toLowerCase() && m.checked === true ? true : false;
            menuTemplate[0].submenu.push({
                label: m.label, type: m.type, role: m.role, click: m.click, checked: checked
            });
        });
        this.#positioner.move(position);
        return menuTemplate;
    }
}

let networkMonitorObj = new NetworkSpeedMonitor(Menu, BrowserWindow);

// add the on listener to create the application window on app ready
app.on('ready', networkMonitorObj.createWindow.bind(networkMonitorObj));