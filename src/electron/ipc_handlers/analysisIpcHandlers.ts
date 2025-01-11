import { getTestRegistrationByPatient, getTestRegistrations, getTestRegistrationsForDateRange, getTests } from "../database/db.js";
import { ipcMainHandle } from "../utils.js";

ipcMainHandle('patientAnalysis:get', async (patientId, startDate, endDate) => {
    const testRegisters = await getTestRegistrationByPatient(patientId, startDate, endDate);

    let totalCount = 0;
    const dataMap = new Map<number, {
        testId: number,
        testName: string,
        count: number,
        tests: {
            date: Date,
            refNumber?: number,
            testRegisterId: number
        }[]
    }>();

    for (const register of testRegisters.registrations) {
        const { date, ref_number, id: testRegisterId } = register;

        for (const registeredTest of register.registeredTests) {
            totalCount += 1;

            const { id: testId, name: testName } = registeredTest.test;
            let data = dataMap.get(testId);

            if (!data) {
                data = {
                    testId,
                    testName,
                    count: 0,
                    tests: []
                };
                dataMap.set(testId, data);
            }

            data.count += 1;
            data.tests.push({ date, refNumber: ref_number, testRegisterId });
        }
    }

    const pieChartData = Array.from(dataMap.values());

    const data: AnalysisData = {
        totalTestNumber: totalCount,
        pieChartData
    };    

    return { data };
});

ipcMainHandle('testAnalysis:get', async (startDate, endDate) => {
    const testRegisters = await getTestRegistrationsForDateRange(startDate, endDate);

    let totalCount = 0;
    const dataMap = new Map<number, {
        testId: number,
        testName: string,
        count: number,
        tests: {
            date: Date,
            refNumber?: number,
            testRegisterId: number
        }[]
    }>();

    for (const register of testRegisters.registrations) {
        const { date, ref_number, id: testRegisterId } = register;

        for (const registeredTest of register.registeredTests) {
            totalCount += 1;

            const { id: testId, name: testName } = registeredTest.test;
            let data = dataMap.get(testId);

            if (!data) {
                data = {
                    testId,
                    testName,
                    count: 0,
                    tests: []
                };
                dataMap.set(testId, data);
            }

            data.count += 1;
            data.tests.push({ date, refNumber: ref_number, testRegisterId });
        }
    }

    const pieChartData = Array.from(dataMap.values());

    const data: AnalysisData = {
        totalTestNumber: totalCount,
        pieChartData
    };    

    return { data };
});
