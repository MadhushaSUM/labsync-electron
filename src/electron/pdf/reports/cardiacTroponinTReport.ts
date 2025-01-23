import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addCardiacTroponinTData(
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
        { name: "cTnT", testFieldId: -1, value: data.ctnt, unit: "" },
    ];

    let yPosition = topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);

    if (!isMerging) {
        const aditionalNotes = [
            { labelCol1: "REFERENCE VALUE", labelCol2: "", x1: 60, x2: 250, weight: "bold" },
            { labelCol1: "  < 0.01 ng/ml", labelCol2: "", x1: 60, x2: 250, weight: "normal" },
        ];
        yPosition += 20;
        aditionalNotes.forEach(test => {
            config.textEntries.push(
                { label: test.labelCol1, x: test.x1, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
                { label: test.labelCol2, x: test.x2, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
            );
            yPosition += 20;
        });

        yPosition += 15;

        config.textEntries.push(
            { label: "The cardiac subtype of troponin T is especially useful in the laboratory diagnosis of heart attack because it is released into the blood stream when damage to heart muscle occurs. The elevation is detectable from 3 - 4 hours after a heart attack, and the levels remain elevated for up to two weeks.", x: 40, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
        );

        yPosition += 60;

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