import { addTestRegisterWithTests, deleteTestRegistersByIds, getDataEmptyTestsList, getPrintingTestList, getTestRegistrationById, getTestRegistrations, markTestAsDataAdded, saveTestData, updateTestRegister } from "../database/db.js";
import { ipcMainHandle, writeErrorLog } from "../utils.js";

ipcMainHandle('testRegister:insert', async (
    patientId,
    doctorId,
    refNumber,
    date,
    testIds,
    totalCost,
    paidPrice
) => {
    try {
        const { success, testRegisterId } = await addTestRegisterWithTests({ patientId, doctorId, refNumber, date, testIds, totalCost, paidPrice });
        return { success: success, testRegisterId: testRegisterId };
    } catch (error: any) {
        writeErrorLog(error);
        return { success: false, error: error.message };
    }
});

ipcMainHandle('testRegister:get', async (
    page,
    pageSize,
    fromDate,
    toDate,
    patientId,
    refNumber
) => {
    try {
        const limit = pageSize;
        const offset = (page - 1) * pageSize;
        const { registrations, totalCount } = await getTestRegistrations(offset, limit, fromDate, toDate, patientId, refNumber);
        return { registrations: registrations, total: totalCount };
    } catch (error) {
        writeErrorLog(error);
        return { registrations: [], total: 0 }
    }
});

ipcMainHandle('testRegister:getById', async (testRegisterId) => {
    try {
        const registration = await getTestRegistrationById(testRegisterId);
        return { registration: registration };
    } catch (error) {
        writeErrorLog(error);
        return { registration: null }
    }
});

ipcMainHandle('testRegister:update', async (
    id,
    patientId,
    doctorId,
    refNumber,
    date,
    testIds,
    dataAddedTestIds,
    previousTestIds,
    totalCost,
    paidPrice
) => {
    try {
        const { success } = await updateTestRegister({ id, patientId, doctorId, refNumber, date, testIds, dataAddedTestIds, previousTestIds, totalCost, paidPrice });
        return { success: success };
    } catch (error: any) {
        writeErrorLog(error);
        return { success: false, error: error.message };
    }
});

ipcMainHandle('testRegister:getDataEmptyTests', async () => {
    try {
        const registrations = await getDataEmptyTestsList();
        return { dataEmptyTests: registrations }
    } catch (error) {
        writeErrorLog(error);
        return { dataEmptyTests: [] }
    }
});

ipcMainHandle('testRegister:addData', async (
    testRegisterId,
    testId,
    data,
    options,
    doctorId
) => {
    try {
        await saveTestData(testRegisterId, testId, data, options, doctorId);
        return { success: true };
    } catch (error: any) {
        writeErrorLog(error);
        return { success: false, error: error.message };
    }
});

ipcMainHandle('testRegister:delete', async (testRegisterIds) => {
    try {
        const rowCount = await deleteTestRegistersByIds(testRegisterIds);
        return { success: true, rowCount: rowCount }
    } catch (error: any) {
        writeErrorLog(error);
        return { success: false, error: error.message };
    }
})

ipcMainHandle('report:getTests', async (
    page,
    pageSize,
    allReports,
    fromDate,
    toDate,
    patientId,
    refNumber
) => {
    try {
        const limit = pageSize;
        const offset = (page - 1) * pageSize;
        const { registrations, totalCount } = await getPrintingTestList(offset, limit, allReports, fromDate, toDate, patientId, refNumber);
        return { registrations: registrations, total: totalCount };
    } catch (error) {
        writeErrorLog(error);
        return {
            registrations: [], total: 0
        }
    }
});

ipcMainHandle('testRegister:editDataOfATest', async (testRegisterId, testId) => {
    try {
        await markTestAsDataAdded(testRegisterId, testId, false);
        return { success: true };
    } catch (error: any) {
        writeErrorLog(error);
        return { success: false, error: error.message };
    }
})