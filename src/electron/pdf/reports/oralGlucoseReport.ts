import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";

export function addOralGlucoseData(
    data: any,
    doc: PDFKit.PDFDocument,
    topMargin: number,
    normalRanges: NormalRange[],
    patientDateOfBirth: Date,
    patientGender: string,
    isMerging: boolean = false,
) {
    const config = generateTestPDFConfig();

    const fbs: TestEntry[] = [
        { name: "FBS", testFieldId: 37, value: data.fbsValue, unit: "mg/dl", flag: data.fbsValueFlag },
        { name: "", testFieldId: -1, value: (Math.round((Number(data.fbsValue) * 0.055) * 100) / 100), unit: "mmol/L" },
    ];

    const firstHour: TestEntry[] = [
        { name: "1ST HOUR", testFieldId: 38, value: data.firstHourValue, unit: "mg/dl", flag: data.firstHourValueFlag },
        { name: "", testFieldId: -1, value: (Math.round((Number(data.firstHourValue) * 0.055) * 100) / 100), unit: "mmol/L" },
    ];

    const secondHour: TestEntry[] = [
        { name: "2ND HOUR", testFieldId: 39, value: data.secondHourValue, unit: "mg/dl", flag: data.secondHourValueFlag },
        { name: "", testFieldId: -1, value: (Math.round((Number(data.secondHourValue) * 0.055) * 100) / 100), unit: "mmol/L" },
    ];

    let yPosition = topMargin;

    if (data.fbsValue && data.fbsValue != "") {
        yPosition = addTextEntries(fbs, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);
    }

    if (data.firstHourValue && data.firstHourValue != "") {
        yPosition = addTextEntries(firstHour, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);
    }

    if (data.secondHourValue && data.secondHourValue != "") {
        yPosition = addTextEntries(secondHour, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);
    }

    if (!isMerging) {

        const aditionalNotes = [
            { labelCol0: "", labelCol1: "REFERENCE VALUES", labelCol2: "", x0: 60, x1: 120, x2: 250, weight: "bold" },
            { labelCol0: "FBS", labelCol1: "70 - 100 mg/dl", labelCol2: "Normal", x0: 60, x1: 120, x2: 280, weight: "normal" },
            { labelCol0: "1 HOUR", labelCol1: "< 180 mg/dl", labelCol2: "Normal", x0: 60, x1: 120, x2: 280, weight: "normal" },
            { labelCol0: "2 HOURS", labelCol1: "< 140 mg/dl (7.7 mmol/L)", labelCol2: "Normal", x0: 60, x1: 120, x2: 280, weight: "normal" },
            { labelCol0: "", labelCol1: "140 - 200 mg/dl (7.8 - 11 mmol/L)", labelCol2: "Impaired glucose (Pre-diabetic)", x0: 60, x1: 120, x2: 280, weight: "normal" },
            { labelCol0: "", labelCol1: "> 200 mg/dl (11 mmol/L)", labelCol2: "Diabetic", x0: 60, x1: 120, x2: 280, weight: "normal" },
        ];

        yPosition += 20;

        aditionalNotes.forEach(test => {
            config.textEntries.push(
                { label: test.labelCol0, x: test.x0, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
                { label: test.labelCol1, x: test.x1, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
                { label: test.labelCol2, x: test.x2, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
            );
            yPosition += 20;
        });

        config.textEntries.push(
            {
                label: "If Renal glycosuria is suspected urine samples may also be collected for testing along with the fasting and 2 hour blood tests.",
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
    }

    const writtenDoc = writeOnDocument(doc, config);

    return { document: writtenDoc, topMargin: yPosition + (isMerging ? 0 : 40) };
}