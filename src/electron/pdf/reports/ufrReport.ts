import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addUFRData(
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
    ];

    const tests2: TestEntry[] = [
        { name: "REACTION (PH)", value: data.reaction, testFieldId: -1, unit: "" },
        { name: "ALBUMIN (PROTEIN)", value: data.albumin, testFieldId: -1, unit: "" },
        { name: "REDUCING SUBSTANCES (SUGAR)", value: data.reducingSubs, testFieldId: -1, unit: "" },
        { name: "BILE (BILIRUBIN)", value: data.bile, testFieldId: -1, unit: "" },
        { name: "UROBILINOGEN", value: data.urobilinogen, testFieldId: -1, unit: "" },
    ];

    const tests3: TestEntry[] = [
        { name: "PUS CELLS", value: data.pusCells, testFieldId: -1, unit: "" },
        { name: "RED CELLS", value: data.redCells, testFieldId: -1, unit: "" },
        { name: "EPITHELIAL CELLS", value: data.epithelialCells, testFieldId: -1, unit: "" },
        { name: "CASTS", value: data.casts, testFieldId: -1, unit: "" },
        { name: "CRYSTALS", value: data.crystals, testFieldId: -1, unit: "" },
        { name: "ORGANISMS", value: data.organisms, testFieldId: -1, unit: "" },
    ];

    let yPosition = topMargin;

    config.textEntries.push(
        { label: "01) MACROSCOPY", x: 60, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    yPosition = addTextEntries(tests1, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc) + 10;

    config.textEntries.push(
        { label: "02) CLINICAL CHEMISTRY", x: 60, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    yPosition = addTextEntries(tests2, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc) + 10;

    config.textEntries.push(
        { label: "03) CENTRIFUGED DEPOSITS", x: 60, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    yPosition = addTextEntries(tests3, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);

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