import { getNormalRangesForTest, getNormalRangesForTestField, insertOrUpdateNormalRange } from "../database/db.js";
import { ipcMainHandle } from "../utils.js";

ipcMainHandle('normalRanges:getForTestField', async (testFieldId) => {    
    const { normalRanges } = await getNormalRangesForTestField(testFieldId);
    return { normalRanges };
});

ipcMainHandle('normalRanges:getForTest', async (testId) => {
    const { normalRanges } = await getNormalRangesForTest(testId);
    return { normalRanges };
});

ipcMainHandle('normalRanges:insertOrUpdate', async (testId, testFieldId, rules) => {
    try {
        await insertOrUpdateNormalRange(testId, testFieldId, rules);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
});