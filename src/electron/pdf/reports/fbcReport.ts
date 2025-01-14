import { addTextEntries, generateTestPDFConfig, TestEntry, writeOnDocument } from "./pdfUtils.js";


export function addFBCData(
    data: any,
    doc: PDFKit.PDFDocument,
    topMargin: number,
    normalRanges: NormalRange[],
    patientDateOfBirth: Date,
    patientGender: string,
    isMerging: boolean = false,
) {
    const config = generateTestPDFConfig();

    const tests1: TestEntry[] = [
        { name: "TOTAL WBC COUNT", testFieldId: 3, value: data.wbcValue, unit: "x10⁹/L", flag: data.wbcValueFlag },
    ];

    const tests2: TestEntry[] = [
        { name: "NEUTROPHILS", testFieldId: 4, value: data.neutrophilsValue, unit: "%", flag: data.neutrophilsValueFlag },
        { name: "LYMPHOCYTES", testFieldId: 5, value: data.lymphocytesValue, unit: "%", flag: data.lymphocytesValueFlag },
        { name: "EOSINOPHILS", testFieldId: 6, value: data.eosinophilsValue, unit: "%", flag: data.eosinophilsValueFlag },
        { name: "MONOCYTES", testFieldId: 7, value: data.monocytesValue, unit: "%", flag: data.monocytesValueFlag },
        { name: "BASOPHILS", testFieldId: 8, value: data.basophilsValue, unit: "%", flag: data.basophilsValueFlag },
    ];

    const tests3: TestEntry[] = [
        { name: "HAEMOGLOBIN", testFieldId: 9, value: data.heamoglobinValue, unit: "g/dL", flag: data.heamoglobinValueFlag },
        { name: "RBC", testFieldId: 10, value: data.rbcValue, unit: "x10¹²/L", flag: data.rbcValueFlag },
        { name: "HCT/PVC", testFieldId: 11, value: data.htcpvcValue, unit: "%", flag: data.htcpvcValueFlag },
        { name: "MCV", testFieldId: 12, value: data.mcvValue, unit: "fL", flag: data.mcvValueFlag },
        { name: "MCH", testFieldId: 13, value: data.mchValue, unit: "pg", flag: data.mchValueFlag },
        { name: "MCHC", testFieldId: 14, value: data.mchcValue, unit: "g/dL", flag: data.mchcValueFlag },
    ];

    const tests4: TestEntry[] = [
        { name: "PLATELET COUNT", testFieldId: 15, value: data.plateletValue, unit: "x10⁹/L", flag: data.plateletValueFlag },
    ];

    let yPosition = topMargin;

    yPosition = addTextEntries(tests1, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc) + 10;

    config.textEntries.push(
        { label: "DIFFERENTIAL COUNT", x: 40, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    yPosition = addTextEntries(tests2, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc) + 10;

    config.textEntries.push(
        { label: "HAEMOGLOBIN AND RBC INDICES", x: 40, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    yPosition = addTextEntries(tests3, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc) + 10;

    config.textEntries.push(
        { label: "DIFFERENTIAL COUNT", x: 40, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
    );

    yPosition += 20;

    yPosition = addTextEntries(tests4, config, yPosition, normalRanges, patientDateOfBirth, patientGender, doc) + 10;

    if (!isMerging) {

        config.textEntries.push(
            { label: "Test done by fully automated haematology analyzer and manually confirmed.", x: 40, y: yPosition, fontSize: 11, weight: "bold", options: undefined },
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