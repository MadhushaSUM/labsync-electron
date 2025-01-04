import path from "path";
import { app } from "electron";
import { addTextEntries, PDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addESRData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
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
            { label: "ESR", x: 0, y: topMargin, fontSize: 15, weight: "bold", options: { align: "center", width: 595 } },
            { label: "Test", x: 50, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Result", x: 200, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Unit", x: 270, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Flag", x: 330, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Normal Range", x: 420, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
        ],
    };

    const tests: TestEntry[] = [
        { name: "ESR 1sr hour", testFieldId: 23, value: data.esr1sthrValue, unit: "mm", flag: data.esr1sthrValueFlag },
    ];

    let yPosition = 55 + topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender);

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