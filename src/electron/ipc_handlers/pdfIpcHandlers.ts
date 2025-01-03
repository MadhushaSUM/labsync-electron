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
    
    if (report.data) {                 
        const out2 = testMapper(Number(report.testId), out1.document, out1.topMargin, report.data);
        out2.document.end();
    }
    previewPDF();
});