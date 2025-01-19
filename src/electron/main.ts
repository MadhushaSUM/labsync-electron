import { app, BrowserWindow, Menu } from 'electron';
import { isDev } from './utils.js';
import { getContactUsUIPath, getPreloadPath, getUIPath } from './pathResolver.js';
import path from 'path';

// Importing patient ipc handlers
import './ipc_handlers/patientIpcHandlers.js';
// Importing test ipc handlers
import './ipc_handlers/testIpcHandlers.js';
// Importing test ipc handlers
import './ipc_handlers/doctorIpcHandlers.js';
// Importing test fields ipc handlers
import './ipc_handlers/testFieldsIpcHandlers.js';
// Importing normal ranges ipc handlers
import './ipc_handlers/normalRangesIpcHandler.js';
// Importing test register ipc handlers
import './ipc_handlers/testRegisterIpcHandlers.js';

// Importing pdf ipc handlers
import './ipc_handlers/pdfIpcHandlers.js';

// Importing analysis ipc handlers
import './ipc_handlers/analysisIpcHandlers.js';

// Importing authenticate ipc handlers
import './ipc_handlers/authenticateIpcHandlers.js';

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
        },
        icon: path.join(app.getPath("userData"), 'microscope.png')
    });

    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123');
    } else {
        mainWindow.loadFile(getUIPath());
    }

    const menuTemplate = [
        {
            label: 'Support',
            click: () => {
                const previewWindow = new BrowserWindow({
                    width: 600,
                    height: 400,
                });
                previewWindow.loadFile(getContactUsUIPath());
                previewWindow.setMenu(null);
                previewWindow.setResizable(false);
            },
        },
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
});