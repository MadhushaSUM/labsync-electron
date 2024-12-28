const electron = require('electron');

electron.contextBridge.exposeInMainWorld("electron", {
    patients: {
        get: (page, pageSize, search) => ipcInvoke('patients:get', page, pageSize, search),
        insert: (patient) => ipcInvoke('patients:insert', patient),
        update: (id, patient) => ipcInvoke('patients:update', id, patient),
        delete: (id) => ipcInvoke('patients:delete', id),
    },
    tests: {
        get: (page, pageSize, search) => ipcInvoke('tests:get', page, pageSize, search),
        updatePrice: (id, price) => ipcInvoke('tests:updatePrice', id, price),
    }
} satisfies Window['electron']);

// Wrappers to ensure type safety
function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key,
    ...args: EventPayloadMapping[Key]['args']
): Promise<EventPayloadMapping[Key]['return']> {
    return electron.ipcRenderer.invoke(key, ...args);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    callback: (payload: EventPayloadMapping[Key]) => void
) {
    const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
    electron.ipcRenderer.on(key, cb);

    return () => electron.ipcRenderer.off(key, cb);
}