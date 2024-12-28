import { app, BrowserWindow } from 'electron';
import { isDev } from './utils.js';
import { getPreloadPath, getUIPath } from './pathResolver.js';

// Importing patient ipc handlers
import './ipc_handlers/patientIpcHandlers.js';
// Importing test ipc handlers
import './ipc_handlers/testIpcHandlers.js';
// Importing test ipc handlers
import './ipc_handlers/doctorIpcHandlers.js';

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
        },
    });

    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123');
    } else {
        mainWindow.loadFile(getUIPath());
    }
});