import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addSCalciumData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
    let config = generateTestPDFConfig("Serum Calcium (Ca++)", topMargin);

    const tests: TestEntry[] = [
        { name: "Total Calcium", testFieldId: 33, value: data.totalCalciumValue, unit: "mmol/L", flag: data.totalCalciumValueFlag },
        { name: "Ionized Calcium", testFieldId: 34, value: data.ionizedCalciumValue, unit: "mmol/L", flag: data.ionizedCalciumValueFlag },
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