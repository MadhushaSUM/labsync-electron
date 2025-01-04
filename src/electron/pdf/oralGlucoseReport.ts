import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";

export function addOralGlucoseData(data: any, doc: PDFKit.PDFDocument, topMargin: number, normalRanges: NormalRange[], patientDateOfBirth: Date, patientGender: string) {
    const config = generateTestPDFConfig(`Oral Glucose Tolerance (${data.glucoseWeight})`, topMargin);

    const fbs: TestEntry[] = [
        { name: "FBS", testFieldId: 37, value: data.fbsValue, unit: "mg/dl", flag: data.fbsValueFlag },
        { name: "", testFieldId: -1, value: (Math.round((Number(data.fbsValue) * 0.055) * 100) / 100), unit: "mmol/L" },
    ];

    const firstHour: TestEntry[] = [
        { name: "1st hour", testFieldId: 38, value: data.firstHourValue, unit: "mg/dl", flag: data.firstHourValueFlag },
        { name: "", testFieldId: -1, value: (Math.round((Number(data.firstHourValue) * 0.055) * 100) / 100), unit: "mmol/L" },
    ];

    const secondHour: TestEntry[] = [
        { name: "2nd hour", testFieldId: 39, value: data.secondHourValue, unit: "mg/dl", flag: data.secondHourValueFlag },
        { name: "", testFieldId: -1, value: (Math.round((Number(data.secondHourValue) * 0.055) * 100) / 100), unit: "mmol/L" },
    ];

    let yPosition = 55 + topMargin;

    if (data.fbsValue && data.fbsValue != "") {
        yPosition = addTextEntries(fbs, config, yPosition, normalRanges, patientDateOfBirth, patientGender);
    }

    if (data.firstHourValue && data.firstHourValue != "") {
        yPosition = addTextEntries(firstHour, config, yPosition, normalRanges, patientDateOfBirth, patientGender);
    }

    if (data.secondHourValue && data.secondHourValue != "") {
        yPosition = addTextEntries(secondHour, config, yPosition, normalRanges, patientDateOfBirth, patientGender);
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