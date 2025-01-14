import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addBilirubinData(
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
        { name: "TOTAL BILIRUBIN", testFieldId: 58, value: data.totalBilirubinValue, unit: "mg/dl", flag: data.totalBilirubinValueFlag },
        { name: "DIRECT BILIRUBIN (Conjugated)", testFieldId: 59, value: data.directBilirubinValue, unit: "mg/dl", flag: data.directBilirubinValueFlag },
        { name: "INDIRECT BILIRUBIN (Unconjugated)", testFieldId: 60, value: data.indirectBilirubinValue, unit: "mg/dl", flag: data.indirectBilirubinValueFlag },
    ];

    let yPosition =  topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);

    if (!isMerging) {
        yPosition += 15;

        config.textEntries.push(
            { label: "Bilirubin is an orange-yellow pigment that occurs normally when part of your red blood cells break down. Your liver takes the bilirubin from your blood and changes its chemical make-up so that most of it is passed through your poop as bile.", x: 40, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
        );

        yPosition += 50;

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