import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addSCalciumData(
    data: any,
    doc: PDFKit.PDFDocument,
    topMargin: number,
    normalRanges: NormalRange[],
    patientDateOfBirth: Date,
    patientGender: string,
    isMerging: boolean = false,) {
    let config = generateTestPDFConfig();

    const tests: TestEntry[] = [
        { name: "TOTAL CALCIUM", testFieldId: 33, value: data.totalCalciumValue, unit: "mmol/L", flag: data.totalCalciumValueFlag },
        { name: "IONIZED CALCIUM", testFieldId: 34, value: data.ionizedCalciumValue, unit: "mmol/L", flag: data.ionizedCalciumValueFlag },
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
};