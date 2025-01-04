import { getNormalRangesForTest } from "../database/db.js";
import { generateReportBase, previewPDF } from "../pdf/reportbase.js";
import { testMapper } from "../pdf/testMapper.js";
import { ipcMainHandle, ipcMainOn } from "../utils.js";

ipcMainHandle('report:test', async () => {
    previewPDF();
    return { success: true };
});

ipcMainOn('report:printPreview', async (
    event,
    report
) => {
    const out1 = generateReportBase(report);
    const { normalRanges } = await getNormalRangesForTest(report.testId);

    if (report.data) {
        const out2 = testMapper(
            Number(report.testId),
            out1.document,
            out1.topMargin,
            report.data,
            normalRanges,
            report.patientDOB,
            report.patientGender
        );
        out2.document.end();
    }
    previewPDF();
});