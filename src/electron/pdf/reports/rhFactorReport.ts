import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";

export function addRHFactorData(
    data: any,
    doc: PDFKit.PDFDocument,
    topMargin: number,
    normalRanges: NormalRange[],
    patientDateOfBirth: Date,
    patientGender: string,
    isMerging: boolean = false,) {
    const config = generateTestPDFConfig();

    const tests: TestEntry[] = [
        { name: "RF", testFieldId: -1, value: data.rhFactor, unit: "" },
    ];

    const optionalEntries: TestEntry[] = [
        { name: "TITRE", testFieldId: 32, value: data.rhFactorTitreValue, unit: "Iu/ml", flag: data.rhFactorTitreValueFlag },
    ];

    let yPosition = topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);

    if (data.rhFactor == "Positive") {
        yPosition = addTextEntries(optionalEntries, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);
    }

    if (!isMerging) {
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
}