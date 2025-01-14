import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from './pdfUtils.js';

export function addRBSData(
    data: any,
    doc: PDFKit.PDFDocument,
    topMargin: number,
    normalRanges: NormalRange[],
    patientDateOfBirth: Date,
    patientGender: string,
    isMerging: boolean = false,) {
    let config = generateTestPDFConfig();

    const tests: TestEntry[] = [
        { name: "RANDOM BLOOD SUGAR (RBS)", testFieldId: 64, value: data.rbsValue, unit: "mg/dl", flag: data.rbsValueFlag },
        { name: `TIME: ${data.time}`, testFieldId: -1, value: (Math.round((Number(data.rbsValue) * 0.055) * 100) / 100), unit: "mmol/L" },
    ];

    let yPosition = topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);

    if (!isMerging) {
        const aditionalNotes = [
            { labelCol1: "REFERENCE VALUES", labelCol2: "", x1: 60, x2: 250, weight: "bold" },
            { labelCol1: "80 - 140 mg/dl (4.4 - 7.8 mmol/L)", labelCol2: "Normal (Non-diabetic)", x1: 60, x2: 250, weight: "normal" },
            { labelCol1: "140 - 200 mg/dl (7.8 - 11.1 mmol/L)", labelCol2: "Impaired glucose (Pre-diabetic)", x1: 60, x2: 250, weight: "normal" },
            { labelCol1: "> 200 mg/dl (11.1 mmol/L)", labelCol2: "Diabetic (Type 1 or 2)", x1: 60, x2: 250, weight: "normal" },
        ];

        yPosition += 20;

        aditionalNotes.forEach(test => {
            config.textEntries.push(
                { label: test.labelCol1, x: test.x1, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
                { label: test.labelCol2, x: test.x2, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
            );
            yPosition += 20;
        });

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
    }

    const writtenDoc = writeOnDocument(doc, config);

    return { document: writtenDoc, topMargin: yPosition + (isMerging ? 0 : 40) };
};
