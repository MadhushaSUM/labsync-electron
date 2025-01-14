import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addBloodGroupData(
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
        { name: "BLOOD GROUP", value: data.bloodGroup, testFieldId: -1, unit: "" },
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