import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from './pdfUtils.js';

export function addFBSData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
    let config = generateTestPDFConfig("Fasting Blood Sugar", topMargin);

    const tests: TestEntry[] = [
        { name: "FBS", testFieldId: 1, value: data.fbsValue, unit: "mg/dl", flag: data.fbsValueFlag },
        { name: "", testFieldId: -1, value: (Math.round((Number(data.fbsValue) * 0.055) * 100) / 100), unit: "mmol/L" },
    ]

    let yPosition = 55 + topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender) + 10;

    config.textEntries.push(
        {
            label:
                `REFERENCE VALUES \n
            < 70 mg/dl (3.9 mmol/L)                           Hypoglycemia \n
             70 - 100 mg/dl (3.9 - 5.6 mmol/L)        Normal (Non-diabetic) \n
             100 - 125 mg/dl (5.6 - 6.9 mmol/L)      Impaired glucose (Pre-diabetic) \n
             > 125 mg/dl (6.9 mmol/L)                        Diabetic (type 1 or 2)
            `, 
            x: 40, 
            y: yPosition, 
            fontSize: 11, 
            weight: "normal", 
            options: undefined
        },
    );

    yPosition += 120;

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
