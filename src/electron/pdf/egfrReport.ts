import path from "path";
import { app } from "electron";
import { PDFConfig, TestEntry, writeOnDocument } from './pdfUtils.js';

export function addEGFRData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {

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
            { label: "Estimation Glomerular Filtration Rate", x: 0, y: topMargin, fontSize: 15, weight: "bold", options: { align: "center", width: 595 } },
            { label: "Test", x: 50, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Result", x: 200, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Unit", x: 270, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Flag", x: 370, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
        ],
    };


    const tests: TestEntry[] = [
        { name: "e - GFR", testFieldId: 65, value: data.egfrValue, unit: "ml/min/1.73m²", flag: data.egfrValueFlag },
    ]

    let yPosition = 55 + topMargin;

    tests.forEach(test => {
        config.textEntries.push(
            { label: test.name, x: 50, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.value != null ? test.value.toString() : "", x: 200, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.unit, x: 270, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.flag || "", x: 370, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
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

    return { document: writtenDoc, topMargin: (topMargin + 100) };
};
