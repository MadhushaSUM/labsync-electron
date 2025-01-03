import path from "path";
import { app } from "electron";


export function addLipidProfileData(data: any, doc: PDFKit.PDFDocument, topMargin: number) {
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
            { label: "Lipid Profile", x: 0, y: topMargin, fontSize: 15, weight: "bold", options: { align: "center", width: 595 } },
            { label: "Test", x: 75, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Result", x: 225, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Unit", x: 325, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Flag", x: 425, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
        ],
    };

    const tests = [
        { name: "Total Cholesterol", value: data.totalCholesterolValue, unit: "mg/dl", flag: data.totalCholesterolValueFlag },
        { name: "Triglycerids", value: data.triglyceridsValue, unit: "mg/dl", flag: data.triglyceridsValueFlag },
        { name: "HDL Cholesterol", value: data.hdlCholesterolValue, unit: "mg/dl", flag: data.hdlCholesterolValueFlag },
        { name: "LDL Cholesterol", value: data.ldlCholesterolValue, unit: "mg/dl", flag: data.ldlCholesterolValueFlag },
        { name: "VLDL Cholesterol", value: data.vldlCholesterolValue, unit: "mg/dl", flag: data.vldlCholesterolValueFlag },
        { name: "Total Chol. / HDL", value: data.tchoHdlRValue, unit: "", flag: data.tchoHdlRValueFlag },
    ];

    let yPosition = 55 + topMargin;

    tests.forEach(test => {
        config.textEntries.push(
            { label: test.name, x: 75, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.value != null ? test.value.toString() : "-", x: 225, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.unit, x: 325, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.flag || "-", x: 425, y: yPosition, fontSize: 11, weight: "bold", options: undefined }
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