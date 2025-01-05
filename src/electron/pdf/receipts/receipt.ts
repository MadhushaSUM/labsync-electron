import PDFDocument from 'pdfkit';
import fs from 'fs';

// Content array for demonstration purposes
const content = [
    "Store Name",
    "Address Line 1",
    "Address Line 2",
    "Phone: 123-456-7890",
    "----------------------------------",
    "Item         Qty     Price    Total",
    "----------------------------------",
    "Apple        2       1.00     2.00",
    "Banana       3       0.50     1.50",
    "Orange       1       1.50     1.50",
    "----------------------------------",
    "Total:                          5.00",
    "----------------------------------",
    "Thank you for your purchase!",
];

// Constants
const PAGE_WIDTH = 226.8; // 80mm = 3.15 inches * 72 points
const LINE_HEIGHT = 14;  // Line height in points
const MARGIN = 10;       // Margin on each side
const FOOTER_HEIGHT = 30; // Space for footer
const MAX_HEIGHT = 14400; // A reasonable upper limit for receipts

// Calculate document height based on content
const calculatedHeight = MARGIN * 2 + content.length * LINE_HEIGHT + FOOTER_HEIGHT;
const docHeight = Math.min(calculatedHeight, MAX_HEIGHT); // Clamp to prevent overly large sizes

// Create a PDF document with the calculated height
const doc = new PDFDocument({
    size: [PAGE_WIDTH, docHeight],
    margin: MARGIN,
});

// Pipe to a file (or to a printer)
doc.pipe(fs.createWriteStream('receipt_dynamic.pdf'));

// Write content to the PDF
doc.fontSize(10).text("Receipt", { align: "center" }).moveDown(0.5);

// Add each line of content
content.forEach((line) => {
    doc.text(line, { align: "left" });
});

// Optionally add a footer
doc.moveDown().fontSize(8).text("Generated on " + new Date().toLocaleString(), { align: "center" });

// Finalize the document
doc.end();

console.log('Receipt PDF generated: receipt_dynamic.pdf');
