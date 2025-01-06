const electron = require('electron');

electron.contextBridge.exposeInMainWorld("electron", {
    patients: {
        get: (page, pageSize, search) => ipcInvoke('patients:get', page, pageSize, search),
        insert: (patient) => ipcInvoke('patients:insert', patient),
        update: (id, patient) => ipcInvoke('patients:update', id, patient),
        delete: (id) => ipcInvoke('patients:delete', id),
    },
    doctors: {
        get: (page, pageSize, search) => ipcInvoke('doctors:get', page, pageSize, search),
        insert: (doctor) => ipcInvoke('doctors:insert', doctor),
        update: (id, doctor) => ipcInvoke('doctors:update', id, doctor),
        delete: (id) => ipcInvoke('doctors:delete', id),
    },
    tests: {
        get: (page, pageSize, search) => ipcInvoke('tests:get', page, pageSize, search),
        updatePrice: (id, price) => ipcInvoke('tests:updatePrice', id, price),
    },
    testFields: {
        getForTest: (testId) => ipcInvoke('testFields:getForTest', testId),
    },
    normalRanges: {
        getForTestField: (testFieldId) => ipcInvoke('normalRanges:getForTestField', testFieldId),
        getForTest: (testId) => ipcInvoke('normalRanges:getForTest', testId),
        insertOrUpdate: (testId, testFieldId, rules) => ipcInvoke('normalRanges:insertOrUpdate', testId, testFieldId, rules),
    },
    testRegister: {
        insert: (patientId, doctorId, refNumber, date, testIds, totalCost, paidPrice) => ipcInvoke('testRegister:insert', patientId, doctorId, refNumber, date, testIds, totalCost, paidPrice),
        update: (id, patientId, doctorId, refNumber, date, testIds, dataAddedTestIds, previousTestIds, totalCost, paidPrice) => ipcInvoke('testRegister:update', id, patientId, doctorId, refNumber, date, testIds, dataAddedTestIds, previousTestIds, totalCost, paidPrice),
        get: (page, pageSize, fromDate, toDate, patientId, refNumber) => ipcInvoke('testRegister:get', page, pageSize, fromDate, toDate, patientId, refNumber),
        getById: (testRegisterId) => ipcInvoke('testRegister:getById', testRegisterId),
        getDataEmptyTests: () => ipcInvoke('testRegister:getDataEmptyTests'),
        addData: (testRegisterId, testId, data, doctorId) => ipcInvoke('testRegister:addData', testRegisterId, testId, data, doctorId),
        delete: (testRegisterIds) => ipcInvoke('testRegister:delete', testRegisterIds),
    },
    report: {
        test: () => ipcInvoke('report:test'),
        getTests: (page, pageSize, allReports, fromDate, toDate, patientId, refNumber) => ipcInvoke('report:getTests', page, pageSize, allReports, fromDate, toDate, patientId, refNumber),
        printPreview: (report) => ipcSend('report:printPreview', report),
        printReceipt: (registration) => ipcSend('report:printReceipt', registration),
        mergeReports: (reports) => ipcSend('report:mergeReports', reports),
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

function ipcSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    ...args: EventPayloadMapping[Key]['args']
): void {
    electron.ipcRenderer.send(key, ...args);
}