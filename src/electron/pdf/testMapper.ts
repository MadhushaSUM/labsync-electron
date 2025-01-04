import { addFBSData } from "./fbsReport.js";
import { addFBCData } from "./fbcReport.js";
import { addLipidProfileData } from "./lipidProfileReport.js";
import { addUFRData } from "./ufrReport.js";
import { addCRPData } from "./crpReport.js";
import { addESRData } from "./esrReport.js";
import { addOTPTData } from "./otptReport.js";


export function testMapper(
    testId: number,
    doc: PDFKit.PDFDocument,
    topMargin: number,
    data: object,
    normalRanges: NormalRange[],
    patientDateOfBirth: Date,
    patientGender: string
) {
    switch (testId) {
        case 1:
            return addFBSData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 2:
            return addFBCData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 3:
            return addLipidProfileData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 4:
            return addUFRData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 5:
            return addCRPData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 6:
            return addESRData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 7:
            return addOTPTData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);

        default:
            return { document: doc, topMargin: topMargin };
    }
}