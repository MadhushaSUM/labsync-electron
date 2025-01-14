import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { app, BrowserWindow } from 'electron';
import { calculateAge } from '../../utils.js';


export async function generateReportBase(
    report: DataEmptyTests,
    testNames: string[],
    hasSecondType = false,
) {
    const config = {
        outputPath: path.join(app.getPath('desktop'), 'pdf-output', 'reports'),
        fonts: {
            normal: path.join(app.getAppPath(), 'fonts/Aptos.ttf'),
            bold: path.join(app.getAppPath(), 'fonts/Aptos-Bold.ttf')
        },
        linePositions: [
            { x1: 0, y1: 150, x2: 595, y2: 150 },
            { x1: 0, y1: 245, x2: 595, y2: 245 },
            { x1: 20, y1: 280, x2: 575, y2: 280 },
            { x1: 20, y1: 300, x2: 575, y2: 300 },
        ],
        textEntries: [
            { label: "PT'S NAME", value: report.patientName, x1: 40, x2: 110, x3: 115, y: 155 },
            { label: "GENDER", value: report.patientGender, x1: 40, x2: 110, x3: 115, y: 180 },
            { label: "TEST(S)", value: testNames.join(', '), x1: 40, x2: 110, x3: 115, y: 205 },
            { label: "REFERRED BY", value: report.doctorName, x1: 40, x2: 110, x3: 115, y: 230 },
            { label: "REF. NO.", value: report.ref_number, x1: 400, x2: 450, x3: 455, y: 155 },
            { label: "AGE", value: (await calculateAge(report.patientDOB, report.options.preferred_age_format)), x1: 220, x2: 250, x3: 255, y: 180 },
            { label: "DATE", value: report.date.toLocaleDateString(), x1: 400, x2: 450, x3: 455, y: 180 },
        ],
        fontSize: 11,
        tableHeader: [
            { label: "TEST", x: 50, y: 284, fontSize: 11, weight: "bold", options: undefined },
            { label: "RESULT", x: 235, y: 284, fontSize: 11, weight: "bold", options: undefined },
        ]
    };
    
    if (!hasSecondType) {
        config.tableHeader.push(
            { label: "UNIT", x: 305, y: 284, fontSize: 11, weight: "bold", options: undefined },
            { label: "FLAG", x: 365, y: 284, fontSize: 11, weight: "bold", options: undefined },
            { label: "NORMAL RANGE", x: 430, y: 284, fontSize: 11, weight: "bold", options: undefined },
        );
    }
    // TODO: replace toLocalDateString() s

    if (!fs.existsSync(config.outputPath)) {
        fs.mkdirSync(config.outputPath);
    }

    const doc = new PDFDocument({ size: "A4" });
    const filePath = path.join(config.outputPath, `${report.patientName}_${report.testName.split('/').join('_')}_${report.date.toLocaleDateString().split('/').join('-')}_${(new Date()).toLocaleTimeString().split('/').join('-')}.pdf`);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    config.linePositions.forEach(line => {
        doc.moveTo(line.x1, line.y1).lineTo(line.x2, line.y2).stroke();
    });

    config.textEntries.forEach(entry => {
        doc.font(config.fonts.normal).fontSize(config.fontSize).text(entry.label, entry.x1, entry.y);
        doc.font(config.fonts.normal).fontSize(config.fontSize).text(":", entry.x2, entry.y);
        doc.font(config.fonts.bold).fontSize(config.fontSize).text(entry.value ? entry.value.toString() : "", entry.x3, entry.y);
    });

    config.tableHeader.forEach(entry => {
        doc
            .font(entry.weight == "bold" ? config.fonts.bold : config.fonts.normal)
            .fontSize(entry.fontSize)
            .text(entry.label, entry.x, entry.y, entry.options);
    });

    return { document: doc, topMargin: 305, filePath: filePath };
}

export function previewPDF(filePath: string) {
    const previewWindow = new BrowserWindow({
        width: 800,
        height: 600,
    });
    previewWindow.loadURL(`file://${filePath}`);
}