import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from './pdfUtils.js';

export function addSCreatinineData(
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
        { name: "SERUM CREATININE", testFieldId: 53, value: data.sCreatinineValue, unit: "mg/dl", flag: data.sCreatinineValueFlag },
    ]

    let yPosition = topMargin;

    yPosition = addTextEntries(tests, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc);

    if (!isMerging) {

        const aditionalNotes = [
            { labelCol0: "REFERENCE VALUES", labelCol1: "", labelCol2: "", x0: 60, x1: 250, weight: "bold" },
            { labelCol0: "Newborn aged 1 - 4 days", labelCol1: "0.3 - 1.0 mg/dl", labelCol2: "", x0: 60, x1: 250, weight: "normal" },
            { labelCol0: "Infants < 2 years", labelCol1: "0.1 - 0.4 mg/dl", labelCol2: "", x0: 60, x1: 250, weight: "normal" },
            { labelCol0: "Children 2 - 6 years", labelCol1: "0.2 - 0.5 mg/dl", labelCol2: "", x0: 60, x1: 250, weight: "normal" },
            { labelCol0: "Children 6 - 10 years", labelCol1: "0.3 - 0.6 mg/dl", labelCol2: "", x0: 60, x1: 250, weight: "normal" },
            { labelCol0: "Adults (Male)", labelCol1: "0.4 - 1.3 mg/dl", labelCol2: "", x0: 60, x1: 250, weight: "normal" },
            { labelCol0: "Adults (Female)", labelCol1: "0.3 - 1.1 mg/dl", labelCol2: "", x0: 60, x1: 250, weight: "normal" },
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
