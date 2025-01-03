import { addFBSData } from "./fbsReport.js";


export function testMapper(testId: number, doc: PDFKit.PDFDocument, topMargin: number, data: object) {
    switch (testId) {
        case 1:
            return addFBSData(data, doc, topMargin);

        

        default:
            return { document: doc, topMargin: topMargin };
    }

}