import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { app, BrowserWindow } from 'electron';

const config = {
    outputPath: path.join(app.getPath('desktop'), 'pdf-output'),
    fonts: {
        normal: path.join(app.getAppPath(), 'fonts/Aptos.ttf'),
        bold: path.join(app.getAppPath(), 'fonts/Aptos-Bold.ttf')
    },
    linePositions: [
        { x1: 0, y1: 150, x2: 595, y2: 150 },
        { x1: 0, y1: 240, x2: 595, y2: 240 }
    ],
    textEntries: [
        { label: "Name", value: "Mr. Chamara Disanayake", x: 40, y: 160, valueX: 145 },
        { label: "Gender", value: "Male", x: 40, y: 190, valueX: 145 },
        { label: "Requested doctor", value: "Mr. Chandana Disanayake (MBBS)", x: 40, y: 220, valueX: 145 },
        { label: "Age", value: "37 years", x: 330, y: 160, valueX: 435 },
        { label: "Date", value: "2025-01-03", x: 330, y: 190, valueX: 435 },
        { label: "Reference number", value: "15462", x: 330, y: 220, valueX: 435 }
    ],
    fontSize: 11
};

export function generateReportBase() {
    if (!fs.existsSync(config.outputPath)) {
        fs.mkdirSync(config.outputPath);
    }

    const doc = new PDFDocument({ size: "A4" });
    const filePath = path.join(config.outputPath, 'report.pdf');
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Draw lines
    config.linePositions.forEach(line => {
        doc.moveTo(line.x1, line.y1).lineTo(line.x2, line.y2).stroke();
    });

    // Add text entries
    config.textEntries.forEach(entry => {
        doc.font(config.fonts.normal).fontSize(config.fontSize).text(entry.label, entry.x, entry.y);
        doc.font(config.fonts.normal).fontSize(config.fontSize).text(":", entry.x + 100, entry.y);
        doc.font(config.fonts.bold).fontSize(config.fontSize).text(entry.value, entry.valueX, entry.y);
    });

    doc.end();
}


export function previewPDF() {
    const previewWindow = new BrowserWindow({
        width: 800,
        height: 600,
    });
    const filePath = path.join(app.getPath('desktop'), 'pdf-output/report.pdf');
    previewWindow.loadURL(`file://${filePath}`);
}