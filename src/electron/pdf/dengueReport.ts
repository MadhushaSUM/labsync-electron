import path from "path";
import { app } from "electron";
import { addTextEntries, PDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addDengueTestData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
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
            { label: "Dengue NS1 Rapid Test", x: 0, y: topMargin, fontSize: 15, weight: "bold", options: { align: "center", width: 595 } },
            { label: "Test", x: 50, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Result", x: 200, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
        ],
    };

    const tests: TestEntry[] = [
        { name: "Test for dengue antigen", testFieldId: -1, value: data.dengue, unit: "" },
    ];

    let yPosition = 55 + topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender) + 10;

    config.textEntries.push(
        { label: "Assay Method - Chromatographic immunoassay.", x: 60, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );
    yPosition += 20;
    config.textEntries.push(
        { label: "NS 1 Antigen is found in infected patients up to 09 days from onset of fever. A negetive result does not exclude the infection.", x: 60, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
    );
    yPosition += 40;
    config.textEntries.push(
        { label: "Sensitivity - 96.0 %", x: 60, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
    );
    yPosition += 20;
    config.textEntries.push(
        { label: "Specificity - 98.5 %", x: 60, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
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

    const writtenDoc = writeOnDocument(doc, config);

    return { document: writtenDoc, topMargin: yPosition + 40 };
};