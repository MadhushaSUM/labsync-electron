import { getFieldsOfTheTest } from "../database/db.js";
import { ipcMainHandle } from "../utils.js";

ipcMainHandle('testFields:getForTest', async (testId) => {
    const { test_fields } = await getFieldsOfTheTest(testId);
    return { test_fields };
});