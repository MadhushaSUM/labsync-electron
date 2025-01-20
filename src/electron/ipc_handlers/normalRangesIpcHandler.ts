import { getNormalRangesForTest, getNormalRangesForTestField, insertOrUpdateNormalRange } from "../database/db.js";
import { ipcMainHandle, writeErrorLog } from "../utils.js";

ipcMainHandle('normalRanges:getForTestField', async (testFieldId) => {
    try {
        const { normalRanges } = await getNormalRangesForTestField(testFieldId);
        return { normalRanges };
    } catch (error) {
        writeErrorLog(error);
        return { normalRanges: [] }
    }
});

ipcMainHandle('normalRanges:getForTest', async (testId) => {
    try {
        const { normalRanges } = await getNormalRangesForTest(testId);
        return { normalRanges };
    } catch (error) {
        writeErrorLog(error);
        return { normalRanges: [] }
    }
});

ipcMainHandle('normalRanges:insertOrUpdate', async (testId, testFieldId, rules) => {
    try {
        await insertOrUpdateNormalRange(testId, testFieldId, rules);
        return { success: true };
    } catch (error: any) {
        writeErrorLog(error);
        return { success: false, error: error.message };
    }
});