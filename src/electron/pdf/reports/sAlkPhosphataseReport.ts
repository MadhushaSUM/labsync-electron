import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addSAlkPhosphataseData(
    data: any,
    doc: PDFKit.PDFDocument,
    topMargin: number,
    normalRanges: NormalRange[],
    patientDateOfBirth: Date,
    patientGender: string,
    isMerging: boolean = false,) {
    let config = generateTestPDFConfig();

    const tests: TestEntry[] = [
        { name: "SERUM ALKALINE PHOSPHATASE", testFieldId: 61, value: data.sAlkalinePhosValue, unit: "U/L", flag: data.sAlkalinePhosValueFlag },
    ];

    let yPosition = topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);

    if (!isMerging) {
        yPosition += 15;

        const aditionalNotes = [
            { labelCol0: "REFERENCE VALUES", labelCol1: "MALE", labelCol2: "FEMALE", x0: 60, x1: 200, x2: 300, weight: "bold" },
            { labelCol0: "Adults", labelCol1: "44 - 147 U/L", labelCol2: "44 - 147 U/L", x0: 60, x1: 200, x2: 300, weight: "normal" },
            { labelCol0: "0 - 14 days", labelCol1: "83 - 248 U/L", labelCol2: "83 - 248 U/L", x0: 60, x1: 200, x2: 300, weight: "normal" },
            { labelCol0: "15 day - 1 year", labelCol1: "122 - 469 U/L", labelCol2: "122 - 464 U/L", x0: 60, x1: 200, x2: 300, weight: "normal" },
            { labelCol0: "1 - 10 years", labelCol1: "142 - 335 U/L", labelCol2: "142 - 335 U/L", x0: 60, x1: 200, x2: 300, weight: "normal" },
            { labelCol0: "10 - 13 years", labelCol1: "129 - 417 U/L", labelCol2: "129 - 417 U/L", x0: 60, x1: 200, x2: 300, weight: "normal" },
            { labelCol0: "13 - 15 years", labelCol1: "116 - 468 U/L", labelCol2: "57 - 254 U/L", x0: 60, x1: 200, x2: 300, weight: "normal" },
            { labelCol0: "15 - 17 years", labelCol1: "82 - 331 U/L", labelCol2: "50 - 117 U/L", x0: 60, x1: 200, x2: 300, weight: "normal" },
            { labelCol0: "> 17 years", labelCol1: "55 - 149 U/L", labelCol2: "35 - 104 U/L", x0: 60, x1: 200, x2: 300, weight: "normal" },
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
            { label: "Serum alkaline phosphatase was the first enzyme utilized in the investigation of hepatic diseases. In response to biliary tree obstruction, the liver induces alkaline phosphatase synthesis in hepatocytes.", x: 40, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
        );

        yPosition += 45;

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