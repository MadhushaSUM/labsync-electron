import { app, BrowserWindow } from 'electron';
import path from 'path';
import { isDev } from './utils.js';
import { getPreloadPath, getUIPath } from './pathResolver.js';

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