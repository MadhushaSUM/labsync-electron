import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addSCholesterolData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
    let config = generateTestPDFConfig("Serum Cholesterol", topMargin);

    const tests: TestEntry[] = [
        { name: "Serum Cholesterol", testFieldId: 62, value: data.sCholesterolValue, unit: "mg/dl", flag: data.sCholesterolValueFlag },
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