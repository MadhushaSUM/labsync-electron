import path from "path";
import { app } from "electron";


export function addUFRData(data: any, doc: PDFKit.PDFDocument, topMargin: number) {
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
            { label: "Urine Full Report", x: 0, y: topMargin, fontSize: 15, weight: "bold", options: { align: "center", width: 595 } },
            { label: "Test", x: 75, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
            { label: "Result", x: 225, y: 34 + topMargin, fontSize: 11, weight: "bold", options: undefined },
        ],
    };

    const tests1 = [
        { name: "Colour", value: data.colour },
        { name: "Appearance", value: data.appearance },
    ];

    const tests2 = [
        { name: "Reaction (pH)", value: data.reaction },
        { name: "Albumin (Protein)", value: data.albumin },
        { name: "Reducing substances (Sugar)", value: data.reducingSubs },
        { name: "Bile (Bilirubin)", value: data.bile },
        { name: "Urobilinogen", value: data.urobilinogen },
    ];

    const tests3 = [
        { name: "Pus Cells", value: data.pusCells },
        { name: "Red Cells", value: data.redCells },
        { name: "Epithelial Cells", value: data.epithelialCells },
        { name: "Casts", value: data.casts },
        { name: "Crystals", value: data.crystals },
        { name: "Organisms", value: data.organisms },
    ];

    let yPosition = 55 + topMargin;

    config.textEntries.push(
        { label: "01) Macroscopy", x: 60, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    tests1.forEach(test => {
        config.textEntries.push(
            { label: test.name, x: 75, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.value != null ? test.value.toString() : "", x: 225, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
        );
        yPosition += 20;
    });

    yPosition += 10;

    config.textEntries.push(
        { label: "02) Clinical chemistry", x: 60, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    tests2.forEach(test => {
        config.textEntries.push(
            { label: test.name, x: 75, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.value != null ? test.value.toString() : "", x: 225, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
        );
        yPosition += 20;
    });

    yPosition += 10;

    config.textEntries.push(
        { label: "03) Centrifuged deposits", x: 60, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    tests3.forEach(test => {
        config.textEntries.push(
            { label: test.name, x: 75, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.value != null ? test.value.toString() : "", x: 225, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
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