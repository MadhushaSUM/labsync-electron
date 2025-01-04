import { addFBSData } from "./fbsReport.js";
import { addFBCData } from "./fbcReport.js";
import { addLipidProfileData } from "./lipidProfileReport.js";
import { addUFRData } from "./ufrReport.js";
import { addCRPData } from "./crpReport.js";
import { addESRData } from "./esrReport.js";
import { addOTPTData } from "./otptReport.js";


export function testMapper(testId: number, doc: PDFKit.PDFDocument, topMargin: number, data: object) {
    switch (testId) {
        case 1:
            return addFBSData(data, doc, topMargin);
        case 2:
            return addFBCData(data, doc, topMargin);
        case 3:
            return addLipidProfileData(data, doc, topMargin);
        case 4:
            return addUFRData(data, doc, topMargin);
        case 5:
            return addCRPData(data, doc, topMargin);
        case 6:
            return addESRData(data, doc, topMargin);
        case 7:
            return addOTPTData(data, doc, topMargin);

        default:
            return { document: doc, topMargin: topMargin };
    }
}