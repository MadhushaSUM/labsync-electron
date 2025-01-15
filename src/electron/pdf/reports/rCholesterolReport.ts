import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addRCholesterolData(
    data: any,
    doc: PDFKit.PDFDocument,
    topMargin: number,
    normalRanges: NormalRange[],
    patientDateOfBirth: Date,
    patientGender: string,
    isMerging: boolean = false,) {
    let config = generateTestPDFConfig();

    const tests: TestEntry[] = [
        { name: "RANDOM CHOLESTEROL", testFieldId: 72, value: data.rCholesterolValue, unit: "mg/dl", flag: data.rCholesterolValueFlag },
        { name: "", testFieldId: -1, value: (Math.round((Number(data.rCholesterolValue) * 0.026041667) * 100) / 100), unit: "mmol/L" },
    ];

    let yPosition = topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);

    if (!isMerging) {
        const aditionalNotes = [
            { labelCol0: "REFERENCES (Adults)", labelCol1: "", labelCol2: "", x0: 60, x1: 250, weight: "bold" },
            { labelCol0: "< 200 mg/dl (5.2 mmol/L)", labelCol1: "Normal", labelCol2: "", x0: 60, x1: 250, weight: "normal" },
            { labelCol0: "200 - 239 mg/dl (5.2 - 6.2 mmol/L)", labelCol1: "Boarderline high", labelCol2: "", x0: 60, x1: 250, weight: "normal" },
            { labelCol0: "> 240 mg/dl (6.2 mmol/L)", labelCol1: "High", labelCol2: "", x0: 60, x1: 250, weight: "normal" },
        ];

        yPosition += 20;

        aditionalNotes.forEach(test => {
            config.textEntries.push(
                { label: test.labelCol0, x: test.x0, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
                { label: test.labelCol1, x: test.x1, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
            );
            yPosition += 20;
        });

        const aditionalNotes2 = [
            { labelCol0: "REFERENCES (Children)", labelCol1: "", labelCol2: "", x0: 60, x1: 250, weight: "bold" },
            { labelCol0: "< 170 mg/dl", labelCol1: "Normal", labelCol2: "", x0: 60, x1: 250, weight: "normal" },
            { labelCol0: "170 - 199 mg/dl", labelCol1: "Boarderline high", labelCol2: "", x0: 60, x1: 250, weight: "normal" },
            { labelCol0: "> 199 mg/dl", labelCol1: "High", labelCol2: "", x0: 60, x1: 250, weight: "normal" },
        ];

        yPosition += 20;

        aditionalNotes2.forEach(test => {
            config.textEntries.push(
                { label: test.labelCol0, x: test.x0, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
                { label: test.labelCol1, x: test.x1, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
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
    }

    const writtenDoc = writeOnDocument(doc, config);

    return { document: writtenDoc, topMargin: yPosition + (isMerging ? 0 : 40) };
};