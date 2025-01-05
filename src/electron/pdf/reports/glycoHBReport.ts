import path from "path";
import { app } from "electron";
import { PDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addGlycoHBData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
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
            { label: "Glycosilated Heamoglobin A1c", x: 0, y: topMargin, fontSize: 15, weight: "bold", options: { align: "center", width: 595 } },
            { label: "Test", x: 50, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Result", x: 220, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Unit", x: 290, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Flag", x: 390, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
        ],
    };

    const tests: TestEntry[] = [
        { name: "Glycosilated Heamoglobin A1c", testFieldId: -1, value: data.glycoHBValue, unit: "%", flag: data.glycoHBValueFlag },
        { name: "Mean blood glucose", testFieldId: -1, value: data.meanBloodGlucoseValue, unit: "mg/dl", flag: data.meanBloodGlucoseValueFlag },
    ];

    let yPosition = 55 + topMargin;

    tests.forEach(test => {
        config.textEntries.push(
            { label: test.name, x: 50, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.value != null ? test.value.toString() : "", x: 220, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.unit, x: 290, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.flag || "", x: 390, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
        );
        yPosition += 20;
    });

    const aditionalNotes = [
        { labelCol1: "Expected values", labelCol2: "Glycosilated Heamoglobin A1c", x1: 60, x2: 350, weight: "bold" },
        { labelCol1: "Normal non-diabetic or diabetic with excellent control", labelCol2: "4.2 - 6.2 %", x1: 60, x2: 350, weight: "normal" },
        { labelCol1: "Good control", labelCol2: "5.5 - 6.8 %", x1: 60, x2: 350, weight: "normal" },
        { labelCol1: "Fair control", labelCol2: "6.8 - 7.6 %", x1: 60, x2: 350, weight: "normal" },
        { labelCol1: "Poor control", labelCol2: "above 7.6 %", x1: 60, x2: 350, weight: "normal" },
    ];

    yPosition += 20;

    aditionalNotes.forEach(test => {
        config.textEntries.push(
            { label: test.labelCol1, x: test.x1, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
            { label: test.labelCol2, x: test.x2, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
        );
        yPosition += 20;
    });

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