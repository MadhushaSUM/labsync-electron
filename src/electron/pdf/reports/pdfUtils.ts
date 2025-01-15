import path from "path";
import { findTheCorrectNormalRangeRule } from "../../utils.js";
import { app } from "electron";


export function addTextEntries(
    tests: TestEntry[],
    config: PDFConfig,
    yPosition: number,
    normalRanges: NormalRange[],
    patientDateOfBirth: Date,
    patientGender: string,
    doc: PDFKit.PDFDocument,
) {
    const decimalAlignmentX = 235;

    tests.forEach(test => {
        let value = test.value != null ? test.value.toString() : "";
        let xPosition = decimalAlignmentX;

        // if (textValue) {
        //     xPosition = decimalAlignmentX;
        // } else {
        //     if (value) {
        //         const [integerPart, fractionalPart] = value.split('.');
        //         const intWidth = doc.widthOfString(integerPart || "");
        //         const fracWidth = doc.widthOfString(fractionalPart || "");

        //         xPosition = decimalAlignmentX - intWidth;
        //     }
        // }

        config.textEntries.push(
            { label: test.name, x: 50, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: value, x: xPosition, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.unit, x: 305, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.flag || "", x: 365, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
            { label: findTheCorrectNormalRangeRule(normalRanges, test.testFieldId, patientDateOfBirth, patientGender, test.unit), x: 430, y: yPosition, fontSize: 11, weight: "normal", options: undefined }
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

export function generateTestPDFConfig() {
    const config: PDFConfig = {
        fonts: {
            normal: path.join(app.getPath("userData"), 'fonts/Aptos.ttf'),
            bold: path.join(app.getPath("userData"), 'fonts/Aptos-Bold.ttf')
        },
        linePositions: [],
        textEntries: [],
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