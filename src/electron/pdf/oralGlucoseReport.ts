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

    config.textEntries.push(
        {
            label:
                `REFERENCE VALUES\n
            FBS          70 - 100 mg/dl                                        Normal\n
            1 hour            < 180 mg/dl                                      Normal\n
            2 hour           < 140 mg/dl (7.7 mmol/L)           Normal\n
                            140 - 200 mg/dl (7.8 - 11 mmol/L)  Impaired glucose (Pre-diabetic)\n
                                     > 200 mg/dl (11 mmol/L)            Diabetic
            `,
            x: 40,
            y: yPosition,
            fontSize: 11,
            weight: "normal",
            options: undefined
        },
    );

    yPosition += 160;

    config.textEntries.push(
        {
            label:"If Renal glycosuria is suspected urine samples may also be collected for testing along with the fasting and 2 hour blood tests.",
            x: 40,
            y: yPosition,
            fontSize: 11,
            weight: "normal",
            options: undefined
        },
    );

    yPosition += 30;

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