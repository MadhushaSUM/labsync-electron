import { addTestRegisterWithTests, getTestRegistrationById, getTestRegistrations, updateTestRegister } from "../database/db.js";
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
        const { success } = await addTestRegisterWithTests({ patientId, doctorId, refNumber, date, testIds, totalCost, paidPrice });
        return { success: success };
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