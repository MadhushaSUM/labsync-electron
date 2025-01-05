import path from "path";
import { findTheCorrectNormalRangeRule } from "../../utils.js";
import { app } from "electron";


export function addTextEntries(
    tests: TestEntry[],
    config: PDFConfig,
    yPosition: number,
    normalRanges: NormalRange[],
    patientDateOfBirth: Date,
    patientGender: string
) {
    tests.forEach(test => {
        config.textEntries.push(
            { label: test.name, x: 50, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.value != null ? test.value.toString() : "", x: 200, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.unit, x: 270, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.flag || "", x: 330, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
            { label: findTheCorrectNormalRangeRule(normalRanges, test.testFieldId, patientDateOfBirth, patientGender, test.unit), x: 420, y: yPosition, fontSize: 11, weight: "normal", options: undefined }
        );
        yPosition += 20;
    });

    return yPosition;
}

export function writeOnDocument(doc: PDFKit.PDFDocument, config: PDFConfig) {
    doc.lineWidth(0.5);
    config.linePositions.forEach(line => {
        doc.moveTo(line.x1, line.y1).lineTo(line.x2, line.y2).stroke();
    });

    config.textEntries.forEach(entry => {
        doc
            .font(entry.weight == "bold" ? config.fonts.bold : config.fonts.normal)
            .fontSize(entry.fontSize)
            .text(entry.label, entry.x, entry.y, entry.options);
    });

    return doc;
}

export function generateTestPDFConfig(testName: string, topMargin: number) {
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
            { label: testName, x: 0, y: topMargin, fontSize: 15, weight: "bold", options: { align: "center", width: 595 } },
            { label: "Test", x: 50, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Result", x: 200, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Unit", x: 270, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Flag", x: 330, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Normal Range", x: 420, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
        ],
    };

    return config;
}

export interface TestEntry {
    name: string;
    testFieldId: number;
    value: number | null;
    unit: string;
    flag?: string;
}

export interface PDFConfig {
    fonts: {
        normal: string;
        bold: string;
    };
    linePositions: { x1: number; y1: number; x2: number; y2: number }[];
    textEntries: {
        label: string;
        x: number;
        y: number;
        fontSize: number;
        weight: "normal" | "bold";
        options?: object;
    }[];
}