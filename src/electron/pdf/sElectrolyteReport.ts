import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addSElectrolyteData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
    let config = generateTestPDFConfig("Serum Electrolytes", topMargin);

    const tests: TestEntry[] = [
        { name: "Sodium (Na+)", testFieldId: 35, value: data.sodiumValue, unit: "mEq/L", flag: data.sodiumValueFlag },
        { name: "Potassium (K+)", testFieldId: 36, value: data.potassiumValue, unit: "mEq/L", flag: data.potassiumValueFlag },
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
}