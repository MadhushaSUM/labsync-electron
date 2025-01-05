import path from "path";
import { app } from "electron";
import { addTextEntries, PDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addLipidProfileData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
    let config: PDFConfig = {
        fonts: {
            normal: path.join(app.getAppPath(), 'fonts/Aptos.ttf'),
            bold: path.join(app.getAppPath(), 'fonts/Aptos-Bold.ttf')
        },
        linePositions: [
            { x1: 20, y1: 30 + topMargin, x2: 575, y2: 30 + topMargin },
            { x1: 20, y1: 50 + topMargin, x2: 575, y2: 50 + topMargin },
        ],
        textEntries: [
            { label: "Lipid Profile", x: 0, y: topMargin, fontSize: 15, weight: "bold", options: { align: "center", width: 595 } },
            { label: "Test", x: 50, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Result", x: 200, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Unit", x: 270, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Flag", x: 330, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Normal Range", x: 420, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
        ],
    };

    const tests: TestEntry[] = [
        { name: "Total Cholesterol", testFieldId: 16, value: data.totalCholesterolValue, unit: "mg/dl", flag: data.totalCholesterolValueFlag },
        { name: "Triglycerids", testFieldId: 17, value: data.triglyceridsValue, unit: "mg/dl", flag: data.triglyceridsValueFlag },
        { name: "HDL Cholesterol", testFieldId: 18, value: data.hdlCholesterolValue, unit: "mg/dl", flag: data.hdlCholesterolValueFlag },
        { name: "LDL Cholesterol", testFieldId: 19, value: data.ldlCholesterolValue, unit: "mg/dl", flag: data.ldlCholesterolValueFlag },
        { name: "VLDL Cholesterol", testFieldId: 20, value: data.vldlCholesterolValue, unit: "mg/dl", flag: data.vldlCholesterolValueFlag },
        { name: "Total Chol. / HDL", testFieldId: 21, value: data.tchoHdlRValue, unit: "", flag: data.tchoHdlRValueFlag },
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