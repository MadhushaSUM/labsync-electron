import { addFBSData } from "./fbsReport.js";
import { addFBCData } from "./fbcReport.js";
import { addLipidProfileData } from "./lipidProfileReport.js";
import { addUFRData } from "./ufrReport.js";
import { addCRPData } from "./crpReport.js";
import { addESRData } from "./esrReport.js";
import { addOTPTData } from "./otptReport.js";
import { addHCGData } from "./hcgReport.js";
import { addDengueTestData } from "./dengueReport.js";
import { addHBData } from "./hbReport.js";
import { addWBCDCData } from "./wbcdcReport.js";
import { addRHFactorData } from "./rhFactorReport.js";
import { addSCalciumData } from "./sCalciumReport.js";
import { addSElectrolyteData } from "./sElectrolyteReport.js";
import { addOralGlucoseData } from "./oralGlucoseReport.js";
import { addPPBSData } from "./ppbsReport.js";
import { addSFRData } from "./sfrReport.js";
import { addLFTData } from "./lftReport.js";
import { addSCreatinineData } from "./sCreatinineReport.js";
import { addBloodUreaData } from "./bloodUreaReport.js";
import { addSProteinsData } from "./sProteinsReport.js";
import { addBilirubinData } from "./bilirubinReport.js";
import { addSAlkPhosphataseData } from "./sAlkPhosphataseReport.js";
import { addSCholesterolData } from "./sCholesterolReport.js";


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
        case 8:
            return addHCGData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 9:
            return addDengueTestData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 10:
            return addHBData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 11:
            return addWBCDCData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 12:
            return addRHFactorData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 13:
            return addSCalciumData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 14:
            return addSElectrolyteData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 15:
            return addOralGlucoseData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 16:
            return addPPBSData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 17:
            return addSFRData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 18:
            return addLFTData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 19:
            return addSCreatinineData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 20:
            return addBloodUreaData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 21:
            return addSProteinsData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 22:
            return addBilirubinData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 23:
            return addSAlkPhosphataseData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 24:
            return addSCholesterolData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);

        default:
            return { document: doc, topMargin: topMargin };
    }
}