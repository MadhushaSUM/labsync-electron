import path from "path";
import { app } from "electron";

export function addCRPData(data: any, doc: PDFKit.PDFDocument, topMargin: number) {
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
            { label: "C. Reactive Proteins", x: 0, y: topMargin, fontSize: 15, weight: "bold", options: { align: "center", width: 595 } },
            { label: "Test", x: 75, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Result", x: 225, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Unit", x: 325, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Flag", x: 425, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "CRP", x: 75, y: 55 + topMargin, fontSize: 11, weight: "normal", options: undefined },
            { label: data.crp, x: 225, y: 55 + topMargin, fontSize: 11, weight: "normal", options: undefined },
        ],
    };

    doc.lineWidth(0.5);
    config.linePositions.forEach(line => {
        doc.moveTo(line.x1, line.y1).lineTo(line.x2, line.y2).stroke();
    });

    config.textEntries.forEach(entry => {
        doc
            .font(entry.weight == "bold" ? config.fonts.bold : config.fonts.normal)
            .fontSize(entry.fontSize)
            .text(entry.label, entry.x, entry.y, entry.options as any);
    });

    const optionalEntries = [
        { label: "Titre", x: 75, y: 76 + topMargin, fontSize: 11, weight: "normal", options: undefined },
        { label: data.crpTitreValue, x: 225, y: 76 + topMargin, fontSize: 11, weight: "normal", options: undefined },
        { label: "mg/L", x: 325, y: 76 + topMargin, fontSize: 11, weight: "normal", options: undefined },
        { label: data.crpTitreValueFlag, x: 425, y: 76 + topMargin, fontSize: 11, weight: "bold", options: undefined },
    ];

    if (data.crp == "Positive") {
        optionalEntries.forEach(entry => {
            doc
                .font(entry.weight == "bold" ? config.fonts.bold : config.fonts.normal)
                .fontSize(entry.fontSize)
                .text(entry.label, entry.x, entry.y, entry.options as any);
        });
    }

    return { document: doc, topMargin: (topMargin + 100) };
}