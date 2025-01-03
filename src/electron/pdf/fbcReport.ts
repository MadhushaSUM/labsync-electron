import path from "path";
import { app } from "electron";


export function addFBCData(data: any, doc: PDFKit.PDFDocument, topMargin: number) {
    const config = {
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
            { label: "Test", x: 75, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Result", x: 225, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Unit", x: 325, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Flag", x: 425, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
        ],
    };

    const tests1 = [
        { name: "WBC", value: data.wbcValue, unit: "x10⁹/L", flag: data.wbcValueFlag },
    ];

    const tests2 = [
        { name: "Neutrophils", value: data.neutrophilsValue, unit: "%", flag: data.neutrophilsValueFlag },
        { name: "Lymphocytes", value: data.lymphocytesValue, unit: "%", flag: data.lymphocytesValueFlag },
        { name: "Eosinophils", value: data.eosinophilsValue, unit: "%", flag: data.eosinophilsValueFlag },
        { name: "Monocytes", value: data.monocytesValue, unit: "%", flag: data.monocytesValueFlag },
        { name: "Basophils", value: data.basophilsValue, unit: "%", flag: data.basophilsValueFlag },
    ];

    const tests3 = [
        { name: "Hemoglobin", value: data.heamoglobinValue, unit: "g/dL", flag: data.heamoglobinValueFlag },
        { name: "RBC", value: data.rbcValue, unit: "x10¹²/L", flag: data.rbcValueFlag },
        { name: "Hct/PVC", value: data.htcpvcValue, unit: "%", flag: data.htcpvcValueFlag },
        { name: "MCV", value: data.mcvValue, unit: "fL", flag: data.mcvValueFlag },
        { name: "MCH", value: data.mchValue, unit: "pg", flag: data.mchValueFlag },
        { name: "MCHC", value: data.mchcValue, unit: "g/dL", flag: data.mchcValueFlag },
    ];

    const tests4 = [
        { name: "Platelets", value: data.plateletValue, unit: "x10⁹/L", flag: data.plateletValueFlag },
    ];

    let yPosition = 55 + topMargin;

    tests1.forEach(test => {
        config.textEntries.push(
            { label: test.name, x: 75, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.value != null ? test.value.toString() : "", x: 225, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.unit, x: 325, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.flag || "", x: 425, y: yPosition, fontSize: 11, weight: "bold", options: undefined }
        );
        yPosition += 20;
    });

    yPosition += 10;

    config.textEntries.push(
        { label: "DIFFERENTIAL COUNT", x: 60, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    tests2.forEach(test => {
        config.textEntries.push(
            { label: test.name, x: 75, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.value != null ? test.value.toString() : "", x: 225, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.unit, x: 325, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.flag || "", x: 425, y: yPosition, fontSize: 11, weight: "bold", options: undefined }
        );
        yPosition += 20;
    });

    yPosition += 10;

    config.textEntries.push(
        { label: "HAEMOGLOBIN AND RBC INDICES", x: 60, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    tests3.forEach(test => {
        config.textEntries.push(
            { label: test.name, x: 75, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.value != null ? test.value.toString() : "", x: 225, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.unit, x: 325, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.flag || "", x: 425, y: yPosition, fontSize: 11, weight: "bold", options: undefined }
        );
        yPosition += 20;
    });

    yPosition += 10;

    config.textEntries.push(
        { label: "DIFFERENTIAL COUNT", x: 60, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    tests4.forEach(test => {
        config.textEntries.push(
            { label: test.name, x: 75, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.value != null ? test.value.toString() : "", x: 225, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.unit, x: 325, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.flag || "", x: 425, y: yPosition, fontSize: 11, weight: "bold", options: undefined }
        );
        yPosition += 20;
    });

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

    doc.lineWidth(0.5);
    config.linePositions.forEach(line => {
        doc.moveTo(line.x1, line.y1).lineTo(line.x2, line.y2).stroke();
    });

    config.textEntries.forEach(entry => {
        doc
            .font(entry.weight === "bold" ? config.fonts.bold : config.fonts.normal)
            .fontSize(entry.fontSize)
            .text(entry.label, entry.x, entry.y, entry.options as any);
    });

    return { document: doc, topMargin: yPosition + 40 };
};