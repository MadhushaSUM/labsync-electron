import { addFBSData } from "./fbsReport.js";
import { addFBCData } from "./fbcReport.js";
import { addLipidProfileData } from "./lipidProfileReport.js";


export function testMapper(testId: number, doc: PDFKit.PDFDocument, topMargin: number, data: object) {
    switch (testId) {
        case 1:
            return addFBSData(data, doc, topMargin);
        case 2:
            return addFBCData(data, doc, topMargin);
        case 3:
            return addLipidProfileData(data, doc, topMargin);

        default:
            return { document: doc, topMargin: topMargin };
    }
}