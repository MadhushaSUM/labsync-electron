const electron = require('electron');

electron.contextBridge.exposeInMainWorld("electron", {

} satisfies Window['electron']);

// Wrappers to ensure type safety
function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key
): Promise<EventPayloadMapping[Key]> {
    return electron.ipcRenderer.invoke(key);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    callback: (payload: EventPayloadMapping[Key]) => void
) {
    const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
    electron.ipcRenderer.on(key, cb);

    return () => electron.ipcRenderer.off(key, cb);
}