import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";

export function addPPBSData(
    data: any,
    doc: PDFKit.PDFDocument,
    topMargin: number,
    normalRanges: NormalRange[],
    patientDateOfBirth: Date,
    patientGender: string,
    isMerging: boolean = false,) {
    const config = generateTestPDFConfig();

    const breakfast: TestEntry[] = [
        { name: "PPBS (BREAKFAST)", testFieldId: 40, value: data.ppbsBfValue, unit: "mg/dl", flag: data.ppbsBfValueFlag },
        { name: "", testFieldId: -1, value: (Math.round((Number(data.ppbsBfValue) * 0.055) * 100) / 100), unit: "mmol/L" },
    ];

    const lunch: TestEntry[] = [
        { name: "PPBS (LUNCH)", testFieldId: 41, value: data.ppbsLnValue, unit: "mg/dl", flag: data.ppbsLnValueFlag },
        { name: "", testFieldId: -1, value: (Math.round((Number(data.ppbsLnValue) * 0.055) * 100) / 100), unit: "mmol/L" },
    ];

    const dinner: TestEntry[] = [
        { name: "PPBS (DINNER)", testFieldId: 42, value: data.ppbsDnValue, unit: "mg/dl", flag: data.ppbsDnValueFlag },
        { name: "", testFieldId: -1, value: (Math.round((Number(data.ppbsDnValue) * 0.055) * 100) / 100), unit: "mmol/L" },
    ];

    let yPosition = topMargin;

    if (data.ppbsBfValue && data.ppbsBfValue != "") {
        yPosition = addTextEntries(breakfast, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);
    }

    if (data.ppbsLnValue && data.ppbsLnValue != "") {
        yPosition = addTextEntries(lunch, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);
    }

    if (data.ppbsDnValue && data.ppbsDnValue != "") {
        yPosition = addTextEntries(dinner, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);
    }

    if (!isMerging) {
        const aditionalNotes = [
            { labelCol1: "REFERENCE VALUES", labelCol2: "", x1: 60, x2: 250, weight: "bold" },
            { labelCol1: "< 140 mg/dl (7.7 mmol/L)", labelCol2: "Normal (Non-diabetic)", x1: 60, x2: 250, weight: "normal" },
            { labelCol1: "140 - 180 mg/dl (7.7 - 9.9 mmol/L)", labelCol2: "Impaired glucose (Pre-diabetic)", x1: 60, x2: 250, weight: "normal" },
            { labelCol1: "> 180 mg/dl (9.9 mmol/L)", labelCol2: "Diabetic", x1: 60, x2: 250, weight: "normal" },
        ];

        yPosition += 20;

        aditionalNotes.forEach(test => {
            config.textEntries.push(
                { label: test.labelCol1, x: test.x1, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
                { label: test.labelCol2, x: test.x2, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
            );
            yPosition += 20;
        });

        // Add the comment at the end
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