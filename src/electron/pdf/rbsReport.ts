import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from './pdfUtils.js';

export function addRBSData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
    let config = generateTestPDFConfig("Random Blood Sugar", topMargin);

    const tests: TestEntry[] = [
        { name: "RBS", testFieldId: 64, value: data.rbsValue, unit: "mg/dl", flag: data.rbsValueFlag },
    ]


    let yPosition = 55 + topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender);

    config.textEntries.push(
        { label: `Time: ${data.time}`, x: 50, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
    );

    yPosition += 20;

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

    return { document: writtenDoc, topMargin: (topMargin + 100) };
};
