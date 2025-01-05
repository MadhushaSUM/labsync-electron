import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addBloodSugarProfileData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
    let config = generateTestPDFConfig("Blood Sugar Profile", topMargin);

    const tests: TestEntry[] = [
        { name: "FBS", testFieldId: 65, value: data.fbsValue, unit: "mg/dl", flag: data.fbsValueFlag },
        { name: "PPBS (pre breakfast)", testFieldId: 66, value: data.ppbsPreBfValue, unit: "mg/dl", flag: data.ppbsPreBfValueFlag },
        { name: "RBS (after lunch)", testFieldId: 67, value: data.rbsAfterLnValue, unit: "mg/dl", flag: data.rbsAfterLnValueFlag },
        { name: "PPBS (pre lunch)", testFieldId: 68, value: data.ppbsPreLnValue, unit: "mg/dl", flag: data.ppbsPreLnValueFlag },
        { name: "RBS (after dinner)", testFieldId: 69, value: data.rbsAfterDnValue, unit: "mg/dl", flag: data.rbsAfterDnValueFlag },
        { name: "PPBS (pre dinner)", testFieldId: 70, value: data.ppbsPreDnValue, unit: "mg/dl", flag: data.ppbsPreDnValueFlag },
    ];

    let yPosition = 55 + topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender);

    if (data.comment) {
        config.textEntries.push({
            label: `Comment: ${data.comment}`,
            x: 75,
            y: yPosition + 10,
            fontSize: 11,
            weight: "normal",
            options: { align: "left", width: 450 }
        });
    }

    const writtenDoc = writeOnDocument(doc, config);

    return { document: writtenDoc, topMargin: yPosition + 40 };
};