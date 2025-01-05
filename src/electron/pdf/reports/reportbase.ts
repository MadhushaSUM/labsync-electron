import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { app, BrowserWindow } from 'electron';
import { calculateAge } from '../../utils.js';


export function generateReportBase(report: DataEmptyTests) {
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
            { label: "Name", value: report.patientName, x: 40, y: 160 },
            { label: "Gender", value: report.patientGender, x: 40, y: 190 },
            { label: "Requested doctor", value: report.doctorName, x: 40, y: 220 },
            { label: "Age", value: calculateAge(report.patientDOB), x: 330, y: 160 },
            { label: "Date", value: report.date.toLocaleDateString(), x: 330, y: 190 },
            { label: "Reference number", value: report.ref_number, x: 330, y: 220 }
        ],
        fontSize: 11
    };

    if (!fs.existsSync(config.outputPath)) {
        fs.mkdirSync(config.outputPath);
    }

    const doc = new PDFDocument({ size: "A4" });
    const filePath = path.join(config.outputPath, 'report.pdf');
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    config.linePositions.forEach(line => {
        doc.moveTo(line.x1, line.y1).lineTo(line.x2, line.y2).stroke();
    });

    config.textEntries.forEach(entry => {
        doc.font(config.fonts.normal).fontSize(config.fontSize).text(entry.label, entry.x, entry.y);
        doc.font(config.fonts.normal).fontSize(config.fontSize).text(":", entry.x + 100, entry.y);
        doc.font(config.fonts.bold).fontSize(config.fontSize).text(entry.value ? entry.value.toString() : "", entry.x + 105, entry.y);
    });

    return { document: doc, topMargin: 250 };
}

export function previewPDF() {
    const previewWindow = new BrowserWindow({
        width: 800,
        height: 600,
    });
    const filePath = path.join(app.getPath('desktop'), 'pdf-output/report.pdf');
    previewWindow.loadURL(`file://${filePath}`);
}