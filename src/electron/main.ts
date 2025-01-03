import { app, BrowserWindow } from 'electron';
import { isDev } from './utils.js';
import { getPreloadPath, getUIPath } from './pathResolver.js';

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