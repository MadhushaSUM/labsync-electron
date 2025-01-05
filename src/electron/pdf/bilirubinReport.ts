import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addBilirubinData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
    let config = generateTestPDFConfig("Bilirubin", topMargin);

    const tests: TestEntry[] = [
        { name: "Total Bilirubin", testFieldId: 58, value: data.totalBilirubinValue, unit: "mg/dl", flag: data.totalBilirubinValueFlag },
        { name: "Direct Bilirubin", testFieldId: 59, value: data.directBilirubinValue, unit: "mg/dl", flag: data.directBilirubinValueFlag },
        { name: "Indirect Bilirubin", testFieldId: 60, value: data.indirectBilirubinValue, unit: "mg/dl", flag: data.indirectBilirubinValueFlag },
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