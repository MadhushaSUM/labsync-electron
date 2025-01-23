import { generateTestPDFConfig, TestEntry, writeOnDocument } from './pdfUtils.js';

export function addEGFRData(
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
        { name: "SERUM CREATININE", testFieldId: -1, value: data.sCreatinineValue, unit: "mg/dl" },
        { name: "e - GFR", testFieldId: -1, value: data.egfrValue, unit: "ml/min/1.73m²", flag: data.egfrValueFlag },
    ]

    let yPosition = topMargin;

    tests.forEach(test => {
        config.textEntries.push(
            { label: test.name, x: 50, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.value != null ? test.value.toString() : "", x: 235, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.unit, x: 305, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
            { label: test.flag || "", x: 370, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
        );
        yPosition += 20;
    });

    yPosition += 20;

    config.textEntries.push(
        { label: "According to MDRD formular", x: 50, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );
    yPosition += 25;
    config.textEntries.push(
        { label: "05 Stages of CKD", x: 60, y: yPosition, fontSize: 12, weight: "bold", options: undefined },
    );
    yPosition += 25;

    const aditionalNotes = [
        { labelCol1: "Stage 01: > 90 ml/min/1.73m²", labelCol2: "Healthy kidneys or kidney damage with normal or high GFR", x1: 60, x2: 270, weight: "normal" },
        { labelCol1: "Stage 02: 60 - 89 ml/min/1.73m²", labelCol2: "Kidney damage with mid decrease in GFR", x1: 60, x2: 270, weight: "normal" },
        { labelCol1: "Stage 03: 30 - 59 ml/min/1.73m²", labelCol2: "Moderate decrease in GFR", x1: 60, x2: 270, weight: "normal" },
        { labelCol1: "Stage 04: 15 - 29 ml/min/1.73m²", labelCol2: "Severe decrease in GFR", x1: 60, x2: 270, weight: "normal" },
        { labelCol1: "Stage 04: < 15 ml/min/1.73m²", labelCol2: "Kidney failure or dialysis", x1: 60, x2: 270, weight: "normal" },
    ];

    let isFirst = true;
    aditionalNotes.forEach(test => {
        config.textEntries.push(
            { label: test.labelCol1, x: test.x1, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
            { label: test.labelCol2, x: test.x2, y: yPosition, fontSize: 11, weight: test.weight as any, options: undefined },
        );
        yPosition += isFirst ? 30 : 20;
        isFirst = false;
    });

    yPosition += 20;
    config.textEntries.push(
        { label: "eGFR estimated at the rate of 60 - 89 ml/min/1.73m² does not indicate CKD unless other existing clinical/laboratory evidences of CKD are establized.", x: 60, y: yPosition, fontSize: 11, weight: "normal", options: undefined },
    );
    yPosition += 40;

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
};
