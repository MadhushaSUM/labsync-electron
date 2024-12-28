import { getTests, updateTestPrice } from "../database/db.js";
import { ipcMainHandle } from "../utils.js";

ipcMainHandle('tests:get', async (page, pageSize, search) => {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    const { tests, total } = await getTests(offset, limit, search);
    return { tests, total };
});

ipcMainHandle('tests:updatePrice', async (id, price) => {
    try {
        await updateTestPrice(id, price);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
});