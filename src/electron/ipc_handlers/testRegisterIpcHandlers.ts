import { addTestRegisterWithTests } from "../database/db.js";
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