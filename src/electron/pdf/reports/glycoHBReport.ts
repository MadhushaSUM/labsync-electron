import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addGlycoHBData(
    data: any,
    doc: PDFKit.PDFDocument,
    topMargin: number,
    normalRanges: NormalRange[],
    patientDateOfBirth: Date,
    patientGender: string,
    isMerging: boolean = false,
) {
    let config = generateTestPDFConfig();

    const tests: TestEntry[] = [
        { name: "HbA1c", testFieldId: 71, value: data.glycoHBValue, unit: "%", flag: data.glycoHBValueFlag },
    ];

    let yPosition = topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);

    if (!isMerging) {
        const aditionalNotes = [
            { labelCol1: "REFERENCE VALUES", labelCol2: "COMMENT", x1: 60, x2: 250, weight: "bold" },
            { labelCol1: "< 5.7 %", labelCol2: "Normal (non-diabetic)", x1: 60, x2: 250, weight: "normal" },
            { labelCol1: "5.7 - 6.4 %", labelCol2: "Pre-diabetes", x1: 60, x2: 250, weight: "normal" },
            { labelCol1: "> 6.5 %", labelCol2: "Diabetes", x1: 60, x2: 250, weight: "normal" },
        ];

        yPosition += 20;

        aditionalNotes.forEach(test => {
            config.textEntries.push(
                { label: test.labelCol1, x: test.x1, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
                { label: test.labelCol2, x: test.x2, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
            );
            yPosition += 20;
        });

        config.textEntries.push(
            { label: "NOTE", x: 40, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
        );
        yPosition += 20;
        config.textEntries.push(
            { label: "An HbA1c test shows what the average amount of glucose attached to haemoglobin has been over the past three months", x: 40, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
        );
        yPosition += 30;

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