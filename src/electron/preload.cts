const electron = require('electron');

electron.contextBridge.exposeInMainWorld("electron", {
    patients: {
        get: () => ipcInvoke('patients:get'),
        insert: (patient: Omit<Patient, 'id'>) => ipcInvoke('patients:insert', patient),
        update: (patient: Patient) => ipcInvoke('patients:update', patient),
        delete: (id: number) => ipcInvoke('patients:delete', id),
    },
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