import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addLFTData(
    data: any,
    doc: PDFKit.PDFDocument,
    topMargin: number,
    normalRanges: NormalRange[],
    patientDateOfBirth: Date,
    patientGender: string,
    isMerging: boolean = false,
) {
    let config = generateTestPDFConfig();

    const tests: TestEntry[] = [
        { name: "S.G.O.T. (AST)", testFieldId: 43, value: data.sgotValue, unit: "U/L", flag: data.sgotValueFlag },
        { name: "S.G.P.T. (ALT)", testFieldId: 44, value: data.sgptValue, unit: "U/L", flag: data.sgptValueFlag },
        { name: "GAMMA GT", testFieldId: 52, value: data.gammaGtValue, unit: "U/L", flag: data.gammaGtValueFlag },
        { name: "SERUM ALKALINE PHOSPHATASE", testFieldId: 45, value: data.sAlkalinePhosValue, unit: "U/L", flag: data.sAlkalinePhosValueFlag },
        { name: "TOTAL PROTEIN", testFieldId: 49, value: data.totalProteinsValue, unit: "g/dl", flag: data.totalProteinsValueFlag },
        { name: "TOTAL BILIRUBIN", testFieldId: 46, value: data.totalBilirubinValue, unit: "mg/dl", flag: data.totalBilirubinValueFlag },
        // { name: "Direct Bilirubin", testFieldId: 47, value: data.directBilirubinValue, unit: "mg/dl", flag: data.directBilirubinValueFlag },
        // { name: "Indirect Bilirubin", testFieldId: 48, value: data.indirectBilirubinValue, unit: "mg/dl", flag: data.indirectBilirubinValueFlag },
        // { name: "Albumin", testFieldId: 50, value: data.albuminValue, unit: "g/dl", flag: data.albuminValueFlag },
        // { name: "Globulin", testFieldId: 51, value: data.globulinValue, unit: "g/dl", flag: data.globulinValueFlag },
        // { name: "Albumin/Globulin ratio", testFieldId: -1, value: data.agRatioValue, unit: "" },
    ];

    let yPosition =  topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);

    if (!isMerging) {
        if (data.comment) {
            config.textEntries.push({
                label: `Comment: ${data.comment}`,
                x: 75,
                y: yPosition + 10,
                fontSize: 11,
                weight: "normal",
                options: { align: "left", width: 450 }
            });
        }
    }

    const writtenDoc = writeOnDocument(doc, config);

    return { document: writtenDoc, topMargin: yPosition + (isMerging ? 0 : 40) };
};