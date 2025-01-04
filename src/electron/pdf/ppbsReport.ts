import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";

export function addPPBSData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
    const config = generateTestPDFConfig("Post Prandial Blood Sugar", topMargin);

    const tests: TestEntry[] = [
        { name: `PPBS (${data.time})`, testFieldId: 40, value: data.ppbsValue, unit: "mg/dl", flag: data.ppbsValueFlag },
        { name: "", testFieldId: -1, value: (Math.round((Number(data.ppbsValue) * 0.055) * 100) / 100), unit: "mmol/L" },
    ];

    let yPosition = 55 + topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender);

    // Add the comment at the end
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