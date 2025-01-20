import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import pkg from 'pdf-to-printer';
import { getConfigs } from '../../database/db.js';
import { formatISO } from 'date-fns';
import { writeErrorLog } from '../../utils.js';

const { print } = pkg;

interface ReceiptPDFConfig {
    outputPath: string,
    headerPath: string,
    fonts: {
        normal: string;
        bold: string;
    };
    linePositions: { x1: number; y1: number; x2: number; y2: number }[];
    textEntries: {
        label: string;
        x: number;
        y: number;
        fontSize: number;
        weight: "normal" | "bold";
        align: "right" | "center" | undefined;
        width: number | undefined
    }[];
}

export async function printReceipt(registration: Registration) {
    const printer = await getConfigs(1);
    const RECEIPT_PRINTING_PRINTER = printer.configuration.receipt_printer;

    const topMargin = 10;

    const config: ReceiptPDFConfig = {
        outputPath: path.join(app.getPath('desktop'), 'pdf-output', 'receipts'),
        headerPath: path.join(app.getPath("userData"), 'receipt/header.png'),
        fonts: {
            normal: path.join(app.getPath("userData"), 'fonts/receipt.ttf'),
            bold: path.join(app.getPath("userData"), 'fonts/receipt-Bold.ttf')
        },
        linePositions: [
            { x1: 5, y1: 136 + topMargin, x2: 221, y2: 136 + topMargin },
            { x1: 5, y1: 156 + topMargin, x2: 221, y2: 156 + topMargin },
        ],
        textEntries: [
            // { label: "<Laboratory Name>", x: 10, y: topMargin, fontSize: 15, weight: "bold", align: "center", width: undefined },
            // { label: "<address line>", x: 10, y: 40 + topMargin, fontSize: 8, weight: "normal", align: "center", width: undefined },
            // { label: "<tele line>", x: 10, y: 50 + topMargin, fontSize: 8, weight: "normal", align: "center", width: undefined },
            { label: "Patient name  :", x: 10, y: 80 + topMargin, fontSize: 11, weight: "normal", align: undefined, width: undefined },
            { label: "Date                    :", x: 10, y: 100 + topMargin, fontSize: 11, weight: "normal", align: undefined, width: undefined },
            { label: "Reference no. :", x: 10, y: 120 + topMargin, fontSize: 11, weight: "normal", align: undefined, width: undefined },
            { label: "Test", x: 10, y: 140 + topMargin, fontSize: 11, weight: "bold", align: undefined, width: undefined },
            { label: "Price (Rs.)", x: 140, y: 140 + topMargin, fontSize: 11, weight: "bold", align: undefined, width: undefined },

            { label: registration.patient.name, x: 80, y: 80 + topMargin, fontSize: 11, weight: "bold", align: undefined, width: undefined },
            { label: formatISO(registration.date, { representation: 'date' }), x: 80, y: 100 + topMargin, fontSize: 11, weight: "bold", align: undefined, width: undefined },
            { label: registration.ref_number ? registration.ref_number.toString() : "", x: 80, y: 120 + topMargin, fontSize: 11, weight: "bold", align: undefined, width: undefined },
        ],
    };

    let yPostition = 135;

    const tests: { name: string, price: string, weight: "normal" | "bold", x: number }[] = [];
    for (const test of registration.registeredTests) {
        tests.push({
            name: test.test.name,
            price: test.test.price.toString(),
            weight: "normal",
            x: 15
        });
    }
    tests.push({
        name: "TOTAL", price: registration.total_cost.toString(), weight: "bold", x: 10
    });
    tests.push({
        name: "PAID", price: registration.paid_price.toString(), weight: "bold", x: 10
    });
    tests.push({
        name: "BALANCE", price: (registration.total_cost - registration.paid_price).toString(), weight: "bold", x: 10
    });

    yPostition += 35;
    tests.forEach((test, index) => {
        if (index == tests.length - 3) {
            config.linePositions.push({
                x1: 5, y1: yPostition, x2: 221, y2: yPostition
            });
        }

        config.textEntries.push(
            { label: test.name, x: test.x, y: yPostition, fontSize: 11, weight: test.weight, align: undefined, width: undefined },
            { label: test.price.toString(), x: 130, y: yPostition, fontSize: 11, weight: test.weight, align: "right", width: 60 },
        );
        yPostition += 20;

        if (index == tests.length - 1) {
            config.linePositions.push({
                x1: 5, y1: yPostition - 5, x2: 221, y2: yPostition - 5
            });
        }
    });

    const PAGE_WIDTH = 226.8; // 80mm
    const MARGIN = 10;
    const FOOTER_HEIGHT = 20; // Space for footer

    const calculatedHeight = yPostition + FOOTER_HEIGHT;

    const doc = new PDFDocument({
        size: [PAGE_WIDTH, calculatedHeight],
        margin: MARGIN,
    });

    if (!fs.existsSync(config.outputPath)) {
        fs.mkdirSync(config.outputPath);
    }

    const filePath = path.join(config.outputPath, 'receipt.pdf');
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.image(config.headerPath, 0, 10, { width: 226 });

    doc.lineWidth(0.5);
    config.linePositions.forEach(line => {
        doc.moveTo(line.x1, line.y1).lineTo(line.x2, line.y2).stroke();
    });


    config.textEntries.forEach(entry => {
        doc
            .font(entry.weight == "bold" ? config.fonts.bold : config.fonts.normal)
            .fontSize(entry.fontSize)
            .text(entry.label, entry.x, entry.y, { align: entry.align as any, width: entry.width });
    });

    doc.font(config.fonts.normal).fontSize(8).text("Generated on " + new Date().toLocaleString(), 0, yPostition, { align: "center" });

    doc.end();

    try {
        print(filePath, { printer: RECEIPT_PRINTING_PRINTER });
    } catch (error) {
        writeErrorLog(error);
        console.error(error);
    }
}
