import { addTestRegisterWithTests, getDataEmptyTestsList, getPrintingTestList, getTestRegistrationById, getTestRegistrations, saveTestData, updateTestRegister } from "../database/db.js";
import { ipcMainHandle } from "../utils.js";

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
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    const { registrations, totalCount } = await getTestRegistrations(offset, limit, fromDate, toDate, patientId, refNumber);
    return { registrations: registrations, total: totalCount };
});

ipcMainHandle('testRegister:getById', async (testRegisterId) => {
    const registration = await getTestRegistrationById(testRegisterId);
    return { registration: registration };
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
        return { success: false, error: error.message };
    }
});

ipcMainHandle('testRegister:getDataEmptyTests', async () => {
    const registrations = await getDataEmptyTestsList();
    return { dataEmptyTests: registrations }
});

ipcMainHandle('testRegister:addData', async (
    testRegisterId,
    testId,
    data,
    doctorId
) => {
    try {
        await saveTestData(testRegisterId, testId, data, doctorId);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
});

ipcMainHandle('report:getTests', async (
    page,
    pageSize,
    allReports,
    fromDate,
    toDate,
    patientId,
    refNumber
) => {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    const { registrations, totalCount } = await getPrintingTestList(offset, limit, allReports, fromDate, toDate, patientId, refNumber);
    return { registrations: registrations, total: totalCount };
});