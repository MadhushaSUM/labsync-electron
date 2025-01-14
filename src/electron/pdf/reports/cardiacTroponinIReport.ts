import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";

export function addCardiacTroponinIData(
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
        { name: "cTnI", testFieldId: -1, value: data.ctni, unit: "" },
    ];

    let yPosition = topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);

    if (!isMerging) {
        const aditionalNotes = [
            { labelCol1: "REFERENCE VALUE", labelCol2: "", x1: 60, x2: 250, weight: "bold" },
            { labelCol1: "  ≤ 0.04 ng/ml", labelCol2: "", x1: 60, x2: 250, weight: "normal" },
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
            { label: "Troponin I is part of a protein complex which regulates the contraction of striated muscle. In acute coronary syndromes(ACS), it can be detected in blood at 4 - 8 hours following the onset of chest pain, reaches a peak concentration at 12 - 16 hours, and remains elevated for 5 - 9 days.", x: 40, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
        );

        yPosition += 50;

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