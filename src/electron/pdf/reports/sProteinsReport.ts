import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addSProteinsData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
    let config = generateTestPDFConfig("Serum Proteins", topMargin);

    const tests: TestEntry[] = [
        { name: "Total Proteins", testFieldId: 55, value: data.totalProteinsValue, unit: "g/dl", flag: data.totalProteinsValueFlag },
        { name: "Albumin", testFieldId: 56, value: data.albuminValue, unit: "g/dl", flag: data.albuminValueFlag },
        { name: "Globulin", testFieldId: 57, value: data.globulinValue, unit: "g/dl", flag: data.globulinValueFlag },
        { name: "Albumin/Globulin ratio", testFieldId: -1, value: data.agRatioValue, unit: "" },
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