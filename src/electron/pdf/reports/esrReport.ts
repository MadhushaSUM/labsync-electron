import path from "path";
import { app } from "electron";
import { addTextEntries, generateTestPDFConfig, PDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addESRData(
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
        { name: "ESR 1ST HOUR", testFieldId: 23, value: data.esr1sthrValue, unit: "mm/hr", flag: data.esr1sthrValueFlag },
    ];

    let yPosition = topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);

    if (!isMerging) {
        yPosition += 15;
        
        const aditionalNotes = [
            { labelCol0: "REFERENCE VALUES", labelCol1: "", labelCol2: "", x0: 60, x1: 220, weight: "bold" },
            { labelCol0: "Under 50 years old", labelCol1: "Male: 0 - 15 mm/hr, Female: 0 - 20 mmm/hr", labelCol2: "", x0: 60, x1: 220, weight: "normal" },
            { labelCol0: "Over 50 years old", labelCol1: "Male: 0 - 20 mm/hr, Female: 0 - 30 mmm/hr", labelCol2: "", x0: 60, x1: 220, weight: "normal" },
            { labelCol0: "Newborn", labelCol1: "0 - 02 mm/hr", labelCol2: "", x0: 60, x1: 220, weight: "normal" },
            { labelCol0: "Newborn to puberty", labelCol1: "3 - 13 mm/hr", labelCol2: "", x0: 60, x1: 220, weight: "normal" },
        ];

        yPosition += 20;

        aditionalNotes.forEach(test => {
            config.textEntries.push(
                { label: test.labelCol0, x: test.x0, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
                { label: test.labelCol1, x: test.x1, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
            );
            yPosition += 20;
        });

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