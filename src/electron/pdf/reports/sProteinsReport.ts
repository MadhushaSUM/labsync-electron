import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addSProteinsData(
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
        { name: "TOTAL PROTEIN", testFieldId: 55, value: data.totalProteinsValue, unit: "g/dl", flag: data.totalProteinsValueFlag },
        { name: "ALBUMIN", testFieldId: 56, value: data.albuminValue, unit: "g/dl", flag: data.albuminValueFlag },
        { name: "GLOBULIN", testFieldId: 57, value: data.globulinValue, unit: "g/dl", flag: data.globulinValueFlag },
        { name: "ALBUMIN/GLOBULIN RATIO", testFieldId: -1, value: data.agRatioValue, unit: "" },
    ];

    let yPosition =  topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);

    if (!isMerging) {
        yPosition += 15;
        
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