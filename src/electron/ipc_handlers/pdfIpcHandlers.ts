import { getConfigs, getNormalRangesForTest, updateConfigs } from "../database/db.js";
import { printReceipt } from "../pdf/receipts/receipt.js";
import { generateReportBase, previewPDF } from "../pdf/reports/reportbase.js";
import { testMapper } from "../pdf/testMapper.js";
import { delay, ipcMainHandle, ipcMainOn, writeErrorLog } from "../utils.js";
import pkg from 'pdf-to-printer';


const { print, getPrinters } = pkg;

const secondTypeTestIds = new Set([4, 8, 9, 17, 27, 29, 30, 32, 33, 34]);

ipcMainOn('report:printPreview', async (
    event,
    report
) => {
    try {
        let testNames = [];
        if (report.testId == 15) {
            testNames.push(`${report.testName.toUpperCase()} (${report.data && report.data.glucoseWeight})`);
        } else if (report.testId == 6) {
            testNames.push(`${report.testName} (westergren method)`.toUpperCase());
        }
        else {
            testNames.push(report.testName.toUpperCase());
        }
        const hasSecondType = secondTypeTestIds.has(Number(report.testId));

        const out1 = await generateReportBase(report, testNames, hasSecondType);
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
    } catch (error) {
        console.error(error);
        writeErrorLog(error);
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
            let testNames = [];
            if (report.testId == 15) {
                testNames.push(`${report.testName.toUpperCase()} (${report.data && report.data.glucoseWeight})`);
            } else if (report.testId == 6) {
                testNames.push(`${report.testName} (westergren method)`.toUpperCase());
            }
            else {
                testNames.push(report.testName.toUpperCase());
            }
            const hasSecondType = secondTypeTestIds.has(Number(report.testId));
            const out1 = await generateReportBase(report, testNames, hasSecondType);
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
        writeErrorLog(error);
    }
});

ipcMainOn('report:export', async (
    event,
    reports
) => {
    try {
        for (const report of reports) {
            let testNames = [];
            if (report.testId == 15) {
                testNames.push(`${report.testName.toUpperCase()} (${report.data && report.data.glucoseWeight})`);
            } else if (report.testId == 6) {
                testNames.push(`${report.testName} (westergren method)`.toUpperCase());
            }
            else {
                testNames.push(report.testName.toUpperCase());
            }
            const hasSecondType = secondTypeTestIds.has(Number(report.testId));
            const out1 = await generateReportBase(report, testNames, hasSecondType, true);
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
        }
    } catch (error) {
        console.error(error);
        writeErrorLog(error);
    }
});

ipcMainOn('report:mergeReports', async (
    event,
    reports
) => {
    try {
        let testNames = [];
        for (const report of reports) {
            if (report.testId == 15) {
                testNames.push(`${report.testName.toUpperCase()} (${report.data && report.data.glucoseWeight})`);
            } else if (report.testId == 6) {
                testNames.push(`${report.testName} (westergren method)`.toUpperCase());
            }
            else {
                testNames.push(report.testName.toUpperCase());
            }
        }
        const hasSecondType = secondTypeTestIds.intersection(new Set(reports.map(item => Number(item.testId)))).size > 0;
        const base = await generateReportBase(reports[0], testNames, hasSecondType);
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
                    report.patientGender,
                    true
                );

                currentTopMargin = temp.topMargin;
            }

        }
        base.document.end();
        previewPDF(base.filePath);
    } catch (error) {
        console.error(error);
        writeErrorLog(error);
    }
});

ipcMainOn('report:printReceipt', async (
    event,
    registration
) => {
    try {
        printReceipt(registration);
    } catch (error) {
        writeErrorLog(error);
    }
});

ipcMainHandle('printers:get', async () => {
    try {
        const printers = await getPrinters();
        return { printers }
    } catch (error) {
        console.error(error);
        writeErrorLog(error);
        return { printers: [] };
    }
});

ipcMainHandle('printers:save', async (data) => {
    try {
        await updateConfigs(1, data);
        return { success: true };
    } catch (error: any) {
        console.error(error);
        writeErrorLog(error);
        return { success: false, error: error.message };
    }
});

ipcMainHandle('config:saveAgePreference', async (data) => {
    try {
        await updateConfigs(2, data);
        return { success: true };
    } catch (error: any) {
        console.error(error);
        writeErrorLog(error);
        return { success: false, error: error.message };
    }
});
ipcMainHandle('config:getAgePreference', async () => {
    try {
        const res = await getConfigs(2);
        return { age_format: res.configuration.age_format };
    } catch (error: any) {
        console.error(error);
        writeErrorLog(error);
        return { age_format: ["years"] };
    }
});