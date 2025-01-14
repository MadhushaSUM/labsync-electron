import path from "path";
import { app } from "electron";
import { addTextEntries, generateTestPDFConfig, PDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addDengueTestData(
    data: any,
    doc: PDFKit.PDFDocument,
    topMargin: number,
    normalRanges: NormalRange[],
    patientDateOfBirth: Date,
    patientGender: string,
    isMerging: boolean = false,
) {
    const config = generateTestPDFConfig();

    const tests: TestEntry[] = [
        { name: "TEST FOR DENGUE ANTIGEN", testFieldId: -1, value: data.dengue, unit: "" },
    ];

    let yPosition = topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc) + 10;

    config.textEntries.push(
        { label: "Assay Method - Chromatographic immunoassay.", x: 60, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );
    yPosition += 20;

    if (!isMerging) {
        config.textEntries.push(
            { label: "NS 1 Antigen is found in infected patients up to 09 days from onset of fever. A negetive result does not exclude the infection.", x: 60, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
        );
        yPosition += 40;
        config.textEntries.push(
            { label: "Sensitivity - 96.0 %", x: 60, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
        );
        yPosition += 20;
        config.textEntries.push(
            { label: "Specificity - 98.5 %", x: 60, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
        );
        yPosition += 20;

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