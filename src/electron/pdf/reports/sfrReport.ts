import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";

export function addSFRData(
    data: any,
    doc: PDFKit.PDFDocument,
    topMargin: number,
    normalRanges: NormalRange[],
    patientDateOfBirth: Date,
    patientGender: string,
    isMerging: boolean = false,
) {
    const config = generateTestPDFConfig();

    const tests1: TestEntry[] = [
        { name: "COLOUR", value: data.colour, testFieldId: -1, unit: "" },
        { name: "APPEARANCE", value: data.appearance, testFieldId: -1, unit: "" },
        { name: "REDUCING SUBSTANCES (SUGAR)", value: data.reducingSubs, testFieldId: -1, unit: "" },
        { name: "AOC", value: data.aoc, testFieldId: -1, unit: "" },
    ];

    const tests2: TestEntry[] = [
        { name: "RED CELLS", value: data.redCells, testFieldId: -1, unit: "" },
        { name: "PUS CELLS", value: data.pusCells, testFieldId: -1, unit: "" },
        { name: "EPITHELIAL CELLS", value: data.epithelialCells, testFieldId: -1, unit: "" },
        { name: "FAT GLOBULES", value: data.fatGlobules, testFieldId: -1, unit: "" },
        { name: "MUCUS", value: data.mucus, testFieldId: -1, unit: "" },
        { name: "VEG. FIBROUS", value: data.vegFibrous, testFieldId: -1, unit: "" },
        { name: "YEAST", value: data.yeast, testFieldId: -1, unit: "" },
    ];

    let yPosition = topMargin;

    yPosition = addTextEntries(tests1, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc) + 10;

    config.textEntries.push(
        { label: "DEPOSITS (PER H.P.F.)", x: 60, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    yPosition = addTextEntries(tests2, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);

    if (!isMerging) {
        yPosition += 15;
        
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