import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addOTPTData(
    data: any,
    doc: PDFKit.PDFDocument,
    topMargin: number,
    normalRanges: NormalRange[],
    patientDateOfBirth: Date,
    patientGender: string,
    isMerging: boolean = false,
) {
    const config = generateTestPDFConfig();

    const tests: TestEntry[] = [
        { name: "SGOT (AST)", testFieldId: 24, value: data.sgotValue, unit: "u/L", flag: data.sgotValueFlag },
        { name: "SGPT (ALT)", testFieldId: 25, value: data.sgptValue, unit: "u/L", flag: data.sgptValueFlag },
    ];

    let yPosition = topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);

    if (!isMerging) {
        yPosition += 10;

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