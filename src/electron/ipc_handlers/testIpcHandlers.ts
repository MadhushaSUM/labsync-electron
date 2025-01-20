import { getTests, updateTestPrice } from "../database/db.js";
import { ipcMainHandle, writeErrorLog } from "../utils.js";

ipcMainHandle('tests:get', async (page, pageSize, search) => {
    try {
        const limit = pageSize;
        const offset = (page - 1) * pageSize;
        const { tests, total } = await getTests(offset, limit, search);
        return { tests, total };
    } catch (error) {
        writeErrorLog(error);
        return { tests: [], total: 0 }
    }
});

ipcMainHandle('tests:updatePrice', async (id, price) => {
    try {
        await updateTestPrice(id, price);
        return { success: true };
    } catch (error: any) {
        writeErrorLog(error);
        return { success: false, error: error.message };
    }
});