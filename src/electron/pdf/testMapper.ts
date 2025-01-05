import { addFBSData } from "./reports/fbsReport.js";
import { addFBCData } from "./reports/fbcReport.js";
import { addLipidProfileData } from "./reports/lipidProfileReport.js";
import { addUFRData } from "./reports/ufrReport.js";
import { addCRPData } from "./reports/crpReport.js";
import { addESRData } from "./reports/esrReport.js";
import { addOTPTData } from "./reports/otptReport.js";
import { addHCGData } from "./reports/hcgReport.js";
import { addDengueTestData } from "./reports/dengueReport.js";
import { addHBData } from "./reports/hbReport.js";
import { addWBCDCData } from "./reports/wbcdcReport.js";
import { addRHFactorData } from "./reports/rhFactorReport.js";
import { addSCalciumData } from "./reports/sCalciumReport.js";
import { addSElectrolyteData } from "./reports/sElectrolyteReport.js";
import { addOralGlucoseData } from "./reports/oralGlucoseReport.js";
import { addPPBSData } from "./reports/ppbsReport.js";
import { addSFRData } from "./reports/sfrReport.js";
import { addLFTData } from "./reports/lftReport.js";
import { addSCreatinineData } from "./reports/sCreatinineReport.js";
import { addBloodUreaData } from "./reports/bloodUreaReport.js";
import { addSProteinsData } from "./reports/sProteinsReport.js";
import { addBilirubinData } from "./reports/bilirubinReport.js";
import { addSAlkPhosphataseData } from "./reports/sAlkPhosphataseReport.js";
import { addSCholesterolData } from "./reports/sCholesterolReport.js";
import { addGammaGTData } from "./reports/gammaGTReport.js";
import { addRBSData } from "./reports/rbsReport.js";
import { addEGFRData } from "./reports/egfrReport.js";
import { addGlycoHBData } from "./reports/glycoHBReport.js";
import { addHIVData } from "./reports/hivReport.js";
import { addBloodGroupData } from "./reports/bloodGroupReport.js";
import { addBloodSugarProfileData } from "./reports/bloodSugarProfileReport.js";
import { addUrineSugarData } from "./reports/urineSugarReport.js";


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
        case 25:
            return addGammaGTData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 26:
            return addRBSData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 27:
            return addEGFRData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 28:
            return addGlycoHBData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 29:
            return addHIVData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 30:
            return addBloodGroupData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 31:
            return addBloodSugarProfileData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);
        case 32:
            return addUrineSugarData(data, doc, topMargin, normalRanges, patientDateOfBirth, patientGender);

        default:
            return { document: doc, topMargin: topMargin };
    }
}