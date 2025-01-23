import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { app, BrowserWindow } from 'electron';
import { calculateAge } from '../../utils.js';
import { formatISO } from 'date-fns';


export async function generateReportBase(
    report: DataEmptyTests,
    testNames: string[],
    hasSecondType = false,
    withHeader = false,
) {

    const config = {
        outputPath: withHeader ? path.join(app.getPath('desktop'), 'pdf-output', 'exports') : path.join(app.getPath('desktop'), 'pdf-output', 'reports'),
        headerPath: path.join('public/report-header.png'),
        footerPath: path.join('public/report-footer.png'),
        fonts: {
            normal: path.join(app.getPath("userData"), 'fonts/Aptos.ttf'),
            bold: path.join(app.getPath("userData"), 'fonts/Aptos-Bold.ttf')
        },
        linePositions: [
            // { x1: 0, y1: 110, x2: 595, y2: 110 },
            // { x1: 0, y1: 205, x2: 595, y2: 205 },
            { x1: 20, y1: 210, x2: 575, y2: 210 },
            { x1: 20, y1: 230, x2: 575, y2: 230 },
        ],
        textEntries: [
            { label: "PT'S NAME", value: report.patientName, x1: 40, x2: 110, x3: 115, y: 115 },
            { label: "SEX", value: report.patientGender, x1: 40, x2: 110, x3: 115, y: 140 },
            { label: "TEST(S)", value: testNames.join(', '), x1: 40, x2: 110, x3: 115, y: 165 },
            { label: "REFERRED BY", value: report.doctorName, x1: 40, x2: 110, x3: 115, y: 190 },
            { label: "REF. NO.", value: report.ref_number, x1: 400, x2: 450, x3: 455, y: 115 },
            { label: "AGE", value: (await calculateAge(report.patientDOB, report.options.preferred_age_format)), x1: 220, x2: 250, x3: 255, y: 140 },
            { label: "DATE", value: formatISO(report.date, { representation: 'date' }), x1: 400, x2: 450, x3: 455, y: 140 },
        ],
        fontSize: 11,
        tableHeader: [
            { label: "TEST", x: 50, y: 214, fontSize: 11, weight: "bold", options: undefined },
            { label: "RESULT", x: 235, y: 214, fontSize: 11, weight: "bold", options: undefined },
        ]
    };

    if (!hasSecondType) {
        config.tableHeader.push(
            { label: "UNIT", x: 305, y: 214, fontSize: 11, weight: "bold", options: undefined },
            { label: "FLAG", x: 365, y: 214, fontSize: 11, weight: "bold", options: undefined },
            { label: "NORMAL RANGE", x: 430, y: 214, fontSize: 11, weight: "bold", options: undefined },
        );
    }
    // TODO: replace toLocalDateString() s

    if (!fs.existsSync(config.outputPath)) {
        fs.mkdirSync(config.outputPath);
    }

    const doc = new PDFDocument({ size: "A4" });
    const fileName = `${report.patientName}-${report.testName.replaceAll('/', '')}-${formatISO(report.date, { representation: 'date' })}`
    const filePath = path.join(config.outputPath, `${fileName}.pdf`);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    if (withHeader) {
        doc.image(config.headerPath, 0, 0, { width: 596 });
        doc.image(config.footerPath, 0, 815, { width: 596 });
    }

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

    return { document: doc, topMargin: 235, filePath: filePath };
}

export function previewPDF(filePath: string) {
    const previewWindow = new BrowserWindow({
        width: 800,
        height: 600,
    });
    previewWindow.loadURL(`file://${filePath}`);
}