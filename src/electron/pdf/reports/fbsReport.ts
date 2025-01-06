import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from './pdfUtils.js';

export function addFBSData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
    let config = generateTestPDFConfig("Fasting Blood Sugar", topMargin);

    const tests: TestEntry[] = [
        { name: "FBS", testFieldId: 1, value: data.fbsValue, unit: "mg/dl", flag: data.fbsValueFlag },
        { name: "", testFieldId: -1, value: (Math.round((Number(data.fbsValue) * 0.055) * 100) / 100), unit: "mmol/L" },
    ]

    let yPosition = 55 + topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender) + 20;

    const aditionalNotes = [
        { labelCol1: "REFERENCE VALUES", labelCol2: "", x1: 60, x2: 250, weight: "bold" },
        { labelCol1: "< 70 mg/dl (3.9 mmol/L)", labelCol2: "Hypoglycemia", x1: 60, x2: 250, weight: "normal" },
        { labelCol1: "70 - 100 mg/dl (3.9 - 5.6 mmol/L)", labelCol2: "Normal (Non-diabetic)", x1: 60, x2: 250, weight: "normal" },
        { labelCol1: "100 - 125 mg/dl (5.6 - 6.9 mmol/L)", labelCol2: "Impaired glucose (Pre-diabetic)", x1: 60, x2: 250, weight: "normal" },
        { labelCol1: "> 125 mg/dl (6.9 mmol/L)", labelCol2: "Diabetic (type 1 or 2)", x1: 60, x2: 250, weight: "normal" },
    ];

    yPosition += 20;

    aditionalNotes.forEach(test => {
        config.textEntries.push(
            { label: test.labelCol1, x: test.x1, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
            { label: test.labelCol2, x: test.x2, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
        );
        yPosition += 20;
    });

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
