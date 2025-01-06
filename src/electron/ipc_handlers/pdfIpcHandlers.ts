import { getNormalRangesForTest } from "../database/db.js";
import { printReceipt } from "../pdf/receipts/receipt.js";
import { generateReportBase, previewPDF } from "../pdf/reports/reportbase.js";
import { testMapper } from "../pdf/testMapper.js";
import { ipcMainOn } from "../utils.js";

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
        previewPDF(out1.filePath);
    }
});

ipcMainOn('report:mergeReports', async (
    event,
    reports
) => {
    const base = generateReportBase(reports[0]);
    let currentTopMargin = base.topMargin;
    for (const report of reports) {
        if (report.data) {
            const { normalRanges } = await getNormalRangesForTest(report.testId);
            const temp = testMapper(
                Number(report.testId),
                base.document,
                currentTopMargin,
                report.data,
                normalRanges,
                report.patientDOB,
                report.patientGender
            );

            currentTopMargin = temp.topMargin;
        }

    }
    base.document.end();
    previewPDF(base.filePath);
});

ipcMainOn('report:printReceipt', async (
    event,
    registration
) => {
    printReceipt(registration);
});