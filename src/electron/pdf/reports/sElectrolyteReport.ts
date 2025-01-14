import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addSElectrolyteData(
    data: any,
    doc: PDFKit.PDFDocument,
    topMargin: number,
    normalRanges: NormalRange[],
    patientDateOfBirth: Date,
    patientGender: string,
    isMerging: boolean = false,) {
    let config = generateTestPDFConfig();

    const tests: TestEntry[] = [
        { name: "SODIUM (Na+)", testFieldId: 35, value: data.sodiumValue, unit: "mEq/L", flag: data.sodiumValueFlag },
        { name: "POTASSIUM (K+)", testFieldId: 36, value: data.potassiumValue, unit: "mEq/L", flag: data.potassiumValueFlag },
    ];

    let yPosition = topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);

    if (!isMerging) {
        yPosition += 10;

        config.textEntries.push(
            { label: "Test done by fully automated electrolyte machine (ISE method)", x: 40, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
        );
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
}