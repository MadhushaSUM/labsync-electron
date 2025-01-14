import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addBloodSugarProfileData(
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
        { name: "FBS", testFieldId: 65, value: data.fbsValue, unit: "mg/dl", flag: data.fbsValueFlag },
        { name: "PPBS (POST BREAKFAST)", testFieldId: 66, value: data.ppbsPreBfValue, unit: "mg/dl", flag: data.ppbsPreBfValueFlag },
        { name: "RBS (PRE LUNCH)", testFieldId: 67, value: data.rbsAfterLnValue, unit: "mg/dl", flag: data.rbsAfterLnValueFlag },
        { name: "PPBS (POST LUNCH)", testFieldId: 68, value: data.ppbsPreLnValue, unit: "mg/dl", flag: data.ppbsPreLnValueFlag },
        { name: "RBS (PRE DINNER)", testFieldId: 69, value: data.rbsAfterDnValue, unit: "mg/dl", flag: data.rbsAfterDnValueFlag },
        { name: "PPBS (POST DINNER)", testFieldId: 70, value: data.ppbsPreDnValue, unit: "mg/dl", flag: data.ppbsPreDnValueFlag },
    ];

    let yPosition = topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);

    if (!isMerging) {
        if (data.comment) {
            yPosition += 15;

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