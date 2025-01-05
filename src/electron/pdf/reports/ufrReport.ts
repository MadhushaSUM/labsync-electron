import path from "path";
import { app } from "electron";
import { addTextEntries, PDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addUFRData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
    const config: PDFConfig = {
        fonts: {
            normal: path.join(app.getAppPath(), 'fonts/Aptos.ttf'),
            bold: path.join(app.getAppPath(), 'fonts/Aptos-Bold.ttf')
        },
        linePositions: [
            { x1: 20, y1: 30 + topMargin, x2: 575, y2: 30 + topMargin },
            { x1: 20, y1: 50 + topMargin, x2: 575, y2: 50 + topMargin },
        ],
        textEntries: [
            { label: "Urine Full Report", x: 0, y: topMargin, fontSize: 15, weight: "bold", options: { align: "center", width: 595 } },
            { label: "Test", x: 75, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Result", x: 200, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
        ],
    };

    const tests1: TestEntry[] = [
        { name: "Colour", value: data.colour, testFieldId: -1, unit: "" },
        { name: "Appearance", value: data.appearance, testFieldId: -1, unit: "" },
    ];

    const tests2: TestEntry[] = [
        { name: "Reaction (pH)", value: data.reaction, testFieldId: -1, unit: "" },
        { name: "Albumin (Protein)", value: data.albumin, testFieldId: -1, unit: "" },
        { name: "Reducing substances (Sugar)", value: data.reducingSubs, testFieldId: -1, unit: "" },
        { name: "Bile (Bilirubin)", value: data.bile, testFieldId: -1, unit: "" },
        { name: "Urobilinogen", value: data.urobilinogen, testFieldId: -1, unit: "" },
    ];

    const tests3: TestEntry[] = [
        { name: "Pus Cells", value: data.pusCells, testFieldId: -1, unit: "" },
        { name: "Red Cells", value: data.redCells, testFieldId: -1, unit: "" },
        { name: "Epithelial Cells", value: data.epithelialCells, testFieldId: -1, unit: "" },
        { name: "Casts", value: data.casts, testFieldId: -1, unit: "" },
        { name: "Crystals", value: data.crystals, testFieldId: -1, unit: "" },
        { name: "Organisms", value: data.organisms, testFieldId: -1, unit: "" },
    ];

    let yPosition = 55 + topMargin;

    config.textEntries.push(
        { label: "01) Macroscopy", x: 60, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    yPosition = addTextEntries(tests1, config, yPosition, normalRanges, patientDateOfBirth, patientGender) + 10;

    config.textEntries.push(
        { label: "02) Clinical chemistry", x: 60, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    yPosition = addTextEntries(tests2, config, yPosition, normalRanges, patientDateOfBirth, patientGender) + 10;

    config.textEntries.push(
        { label: "03) Centrifuged deposits", x: 60, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    yPosition = addTextEntries(tests3, config, yPosition, normalRanges, patientDateOfBirth, patientGender) + 10;

    // Add the comment at the end
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

    const writtenDoc = writeOnDocument(doc, config);

    return { document: writtenDoc, topMargin: yPosition + 40 };
};