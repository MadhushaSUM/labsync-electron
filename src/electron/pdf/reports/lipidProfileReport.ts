import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addLipidProfileData(
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
        { name: "TOTAL CHOLESTEROL", testFieldId: 16, value: data.totalCholesterolValue, unit: "mg/dl", flag: data.totalCholesterolValueFlag },
        { name: "TRIGLYCERIDS", testFieldId: 17, value: data.triglyceridsValue, unit: "mg/dl", flag: data.triglyceridsValueFlag },
        { name: "HDL CHOLESTEROL", testFieldId: 18, value: data.hdlCholesterolValue, unit: "mg/dl", flag: data.hdlCholesterolValueFlag },
        { name: "NON - HDL CHOLESTEROL", testFieldId: 73, value: data.nonHdlCholesterolValue, unit: "mg/dl", flag: data.nonHdlCholesterolValueFlag },
        { name: "LDL CHOLESTEROL", testFieldId: 19, value: data.ldlCholesterolValue, unit: "mg/dl", flag: data.ldlCholesterolValueFlag },
        { name: "VLDL CHOLESTEROL", testFieldId: 20, value: data.vldlCholesterolValue, unit: "mg/dl", flag: data.vldlCholesterolValueFlag },
        { name: "LDL / HDL RATIO", testFieldId: 74, value: data.ldlHdlRValue, unit: "", flag: data.ldlHdlRValueFlag },
        { name: "TOTAL CHOL. / HDL RATIO", testFieldId: 21, value: data.tchoHdlRValue, unit: "", flag: data.tchoHdlRValueFlag },
    ];

    let yPosition = topMargin;

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