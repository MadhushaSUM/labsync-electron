import { addTextEntries, generateTestPDFConfig, PDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addWBCDCData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
    const config = generateTestPDFConfig("WBCDC", topMargin);

    const tests: TestEntry[] = [
        { name: "Neutrophils", testFieldId: 27, value: data.neutrophilsValue, unit: "%", flag: data.neutrophilsValueFlag },
        { name: "Lymphocytes", testFieldId: 28, value: data.lymphocytesValue, unit: "%", flag: data.lymphocytesValueFlag },
        { name: "Eosinophils", testFieldId: 29, value: data.eosinophilsValue, unit: "%", flag: data.eosinophilsValueFlag },
        { name: "Monocytes", testFieldId: 30, value: data.monocytesValue, unit: "%", flag: data.monocytesValueFlag },
        { name: "Basophils", testFieldId: 31, value: data.basophilsValue, unit: "%", flag: data.basophilsValueFlag },
    ];

    let yPosition = 55 + topMargin;


    config.textEntries.push(
        { label: "DIFFERENTIAL COUNT", x: 40, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );
    yPosition += 20;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender) + 10;

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
};