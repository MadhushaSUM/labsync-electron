import path from "path";
import { app } from "electron";
import { addTextEntries, PDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addFBCData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
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
            { label: "Full Blood Count", x: 0, y: topMargin, fontSize: 15, weight: "bold", options: { align: "center", width: 595 } },
            { label: "Test", x: 50, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Result", x: 200, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Unit", x: 270, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Flag", x: 330, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Normal Range", x: 420, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
        ],
    };

    const tests1: TestEntry[] = [
        { name: "WBC", testFieldId: 3, value: data.wbcValue, unit: "x10⁹/L", flag: data.wbcValueFlag },
    ];

    const tests2: TestEntry[] = [
        { name: "Neutrophils", testFieldId: 4, value: data.neutrophilsValue, unit: "%", flag: data.neutrophilsValueFlag },
        { name: "Lymphocytes", testFieldId: 5, value: data.lymphocytesValue, unit: "%", flag: data.lymphocytesValueFlag },
        { name: "Eosinophils", testFieldId: 6, value: data.eosinophilsValue, unit: "%", flag: data.eosinophilsValueFlag },
        { name: "Monocytes", testFieldId: 7, value: data.monocytesValue, unit: "%", flag: data.monocytesValueFlag },
        { name: "Basophils", testFieldId: 8, value: data.basophilsValue, unit: "%", flag: data.basophilsValueFlag },
    ];

    const tests3: TestEntry[] = [
        { name: "Hemoglobin", testFieldId: 9, value: data.heamoglobinValue, unit: "g/dL", flag: data.heamoglobinValueFlag },
        { name: "RBC", testFieldId: 10, value: data.rbcValue, unit: "x10¹²/L", flag: data.rbcValueFlag },
        { name: "HCT/PVC", testFieldId: 11, value: data.htcpvcValue, unit: "%", flag: data.htcpvcValueFlag },
        { name: "MCV", testFieldId: 12, value: data.mcvValue, unit: "fL", flag: data.mcvValueFlag },
        { name: "MCH", testFieldId: 13, value: data.mchValue, unit: "pg", flag: data.mchValueFlag },
        { name: "MCHC", testFieldId: 14, value: data.mchcValue, unit: "g/dL", flag: data.mchcValueFlag },
    ];

    const tests4: TestEntry[] = [
        { name: "Platelet count", testFieldId: 15, value: data.plateletValue, unit: "x10⁹/L", flag: data.plateletValueFlag },
    ];

    let yPosition = 55 + topMargin;

    yPosition = addTextEntries(tests1, config, yPosition, normalRanges, patientDateOfBirth, patientGender) + 10;

    config.textEntries.push(
        { label: "DIFFERENTIAL COUNT", x: 40, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    yPosition = addTextEntries(tests2, config, yPosition, normalRanges, patientDateOfBirth, patientGender) + 10;

    config.textEntries.push(
        { label: "HAEMOGLOBIN AND RBC INDICES", x: 40, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    yPosition = addTextEntries(tests3, config, yPosition, normalRanges, patientDateOfBirth, patientGender) + 10;

    config.textEntries.push(
        { label: "DIFFERENTIAL COUNT", x: 40, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    yPosition = addTextEntries(tests4, config, yPosition, normalRanges, patientDateOfBirth, patientGender) + 10;

    config.textEntries.push(
        { label: "Test done by fully automated haematology analyzer and manually confirmed.", x: 40, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

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