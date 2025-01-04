import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addLFTData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
    let config = generateTestPDFConfig("Liver profile / Liver function tests", topMargin);

    const tests: TestEntry[] = [
        { name: "AST / SGOT", testFieldId: 43, value: data.sgotValue, unit: "U/L", flag: data.sgotValueFlag },
        { name: "ALT / SGPT", testFieldId: 44, value: data.sgptValue, unit: "U/L", flag: data.sgptValueFlag },
        { name: "Serum Alkaline Phosphatase", testFieldId: 45, value: data.sAlkalinePhosValue, unit: "U/L", flag: data.sAlkalinePhosValueFlag },
        { name: "Total Bilirubin", testFieldId: 46, value: data.totalBilirubinValue, unit: "mg/dl", flag: data.totalBilirubinValueFlag },
        { name: "Direct Bilirubin", testFieldId: 47, value: data.directBilirubinValue, unit: "mg/dl", flag: data.directBilirubinValueFlag },
        { name: "Indirect Bilirubin", testFieldId: 48, value: data.indirectBilirubinValue, unit: "mg/dl", flag: data.indirectBilirubinValueFlag },
        { name: "Total Proteins", testFieldId: 49, value: data.totalProteinsValue, unit: "g/dl", flag: data.totalProteinsValueFlag },
        { name: "Albumin", testFieldId: 50, value: data.albuminValue, unit: "g/dl", flag: data.albuminValueFlag },
        { name: "Globulin", testFieldId: 51, value: data.globulinValue, unit: "g/dl", flag: data.globulinValueFlag },
        { name: "Albumin/Globulin ratio", testFieldId: -1, value: data.agRatioValue, unit: "" },
        { name: "GAMMA GT", testFieldId: 52, value: data.gammaGtValue, unit: "U/L", flag: data.gammaGtValueFlag },
    ];

    let yPosition = 55 + topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender);

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

    const writtenDoc = writeOnDocument(doc, config);

    return { document: writtenDoc, topMargin: yPosition + 40 };
};