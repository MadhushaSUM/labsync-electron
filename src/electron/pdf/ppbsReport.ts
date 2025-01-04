import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";

export function addPPBSData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
    const config = generateTestPDFConfig("Post Prandial Blood Sugar", topMargin);

    const breakfast: TestEntry[] = [
        { name: "PPBS (Breakfast)", testFieldId: 40, value: data.ppbsBfValue, unit: "mg/dl", flag: data.ppbsBfValueFlag },
        { name: "", testFieldId: -1, value: (Math.round((Number(data.ppbsBfValue) * 0.055) * 100) / 100), unit: "mmol/L" },
    ];

    const lunch: TestEntry[] = [
        { name: "PPBS (Lunch)", testFieldId: 41, value: data.ppbsLnValue, unit: "mg/dl", flag: data.ppbsLnValueFlag },
        { name: "", testFieldId: -1, value: (Math.round((Number(data.ppbsLnValue) * 0.055) * 100) / 100), unit: "mmol/L" },
    ];

    const dinner: TestEntry[] = [
        { name: "PPBS (Dinner)", testFieldId: 42, value: data.ppbsDnValue, unit: "mg/dl", flag: data.ppbsDnValueFlag },
        { name: "", testFieldId: -1, value: (Math.round((Number(data.ppbsDnValue) * 0.055) * 100) / 100), unit: "mmol/L" },
    ];

    let yPosition = 55 + topMargin;

    if (data.ppbsBfValue && data.ppbsBfValue != "") {
        yPosition = addTextEntries(breakfast, config, yPosition, normalRanges, patientDateOfBirth, patientGender);
    }

    if (data.ppbsLnValue && data.ppbsLnValue != "") {
        yPosition = addTextEntries(lunch, config, yPosition, normalRanges, patientDateOfBirth, patientGender);
    }

    if (data.ppbsDnValue && data.ppbsDnValue != "") {
        yPosition = addTextEntries(dinner, config, yPosition, normalRanges, patientDateOfBirth, patientGender);
    }

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

    const writtenDoc = writeOnDocument(doc, config);

    return { document: writtenDoc, topMargin: yPosition + 40 };
}