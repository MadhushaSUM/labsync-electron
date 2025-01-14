import path from "path";
import { app } from "electron";
import { addTextEntries, generateTestPDFConfig, PDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";

export function addCRPData(
    data: any,
    doc: PDFKit.PDFDocument,
    topMargin: number,
    normalRanges: NormalRange[],
    patientDateOfBirth: Date,
    patientGender: string,
    isMerging: boolean = false,) {
    const config = generateTestPDFConfig();

    const tests: TestEntry[] = [
        { name: "CRP", testFieldId: -1, value: data.crp, unit: "" },
    ];

    const optionalEntries: TestEntry[] = [
        { name: "TITRE", testFieldId: 22, value: data.crpTitreValue, unit: "mg/L", flag: data.crpTitreValueFlag },
    ];

    let yPosition = topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);

    if (data.crp == "Positive") {
        yPosition = addTextEntries(optionalEntries, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);
    }

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
}