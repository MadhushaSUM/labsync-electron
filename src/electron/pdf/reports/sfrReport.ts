import path from "path";
import { app } from "electron";
import { addTextEntries, PDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";

export function addSFRData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
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
            { label: "Stool Full Report", x: 0, y: topMargin, fontSize: 15, weight: "bold", options: { align: "center", width: 595 } },
            { label: "Test", x: 75, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Result", x: 200, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
        ],
    };

    const tests1: TestEntry[] = [
        { name: "Colour", value: data.colour, testFieldId: -1, unit: "" },
        { name: "Appearance", value: data.appearance, testFieldId: -1, unit: "" },
        { name: "Reducing substances (Sugar)", value: data.reducingSubs, testFieldId: -1, unit: "" },
        { name: "AOC", value: data.aoc, testFieldId: -1, unit: "" },
    ];

    const tests2: TestEntry[] = [
        { name: "Red Cells", value: data.redCells, testFieldId: -1, unit: "" },
        { name: "Pus Cells", value: data.pusCells, testFieldId: -1, unit: "" },
        { name: "Epithelial Cells", value: data.epithelialCells, testFieldId: -1, unit: "" },
        { name: "Fat globules", value: data.fatGlobules, testFieldId: -1, unit: "" },
        { name: "Mucus", value: data.mucus, testFieldId: -1, unit: "" },
        { name: "Veg. Fibrous", value: data.vegFibrous, testFieldId: -1, unit: "" },
        { name: "Yeast", value: data.yeast, testFieldId: -1, unit: "" },
    ];

    let yPosition = 55 + topMargin;

    yPosition = addTextEntries(tests1, config, yPosition, normalRanges, patientDateOfBirth, patientGender) + 10;

    config.textEntries.push(
        { label: "Deposits (per H.P.F.)", x: 60, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    yPosition = addTextEntries(tests2, config, yPosition, normalRanges, patientDateOfBirth, patientGender) + 10;

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