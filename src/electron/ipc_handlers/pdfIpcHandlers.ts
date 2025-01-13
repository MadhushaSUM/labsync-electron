import { getConfigs, getNormalRangesForTest, updateConfigs } from "../database/db.js";
import { printReceipt } from "../pdf/receipts/receipt.js";
import { generateReportBase, previewPDF } from "../pdf/reports/reportbase.js";
import { testMapper } from "../pdf/testMapper.js";
import { ipcMainHandle, ipcMainOn } from "../utils.js";
import pkg from 'pdf-to-printer';


const { print, getPrinters } = pkg;

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

ipcMainOn('report:print', async (
    event,
    reports
) => {
    try {
        const printer = await getConfigs(1);
        const REPORT_PRINTING_PRINTER = printer.configuration.report_printer;

        for (const report of reports) {
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

                print(out1.filePath, { printer: REPORT_PRINTING_PRINTER });
            }
        }
    } catch (error) {
        console.error(error);
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

ipcMainHandle('printers:get', async () => {
    try {
        const printers = await getPrinters();
        return { printers }
    } catch (error) {
        console.error(error);
        return { printers: [] };
    }
});

ipcMainHandle('printers:save', async (data) => {
    try {
        await updateConfigs(1, data);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
});