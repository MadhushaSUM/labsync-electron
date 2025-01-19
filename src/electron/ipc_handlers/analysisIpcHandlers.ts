import { getPeriodsWithTestRegisterIds, getTestRegistrationById, getTestRegistrationByPatient, getTestRegistrationsForDateRange, getTests } from "../database/db.js";
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
            testRegisterId: number,
            data: {},
        }[]
    }>();

    for (const register of testRegisters.registrations) {
        const { date, ref_number, id: testRegisterId } = register;

        for (const registeredTest of register.registeredTests) {
            totalCount += 1;

            const { id: testId, name: testName } = registeredTest.test;
            const testData = registeredTest.data;
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
            data.tests.push({ date, refNumber: ref_number, testRegisterId, data: testData });
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
            testRegisterId: number,
            data: {},
        }[]
    }>();

    for (const register of testRegisters.registrations) {
        const { date, ref_number, id: testRegisterId } = register;

        for (const registeredTest of register.registeredTests) {
            totalCount += 1;

            const { id: testId, name: testName } = registeredTest.test;
            const testData = registeredTest.data;
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
            data.tests.push({ date, refNumber: ref_number, testRegisterId, data: testData });
        }
    }

    const pieChartData = Array.from(dataMap.values());

    const data: AnalysisData = {
        totalTestNumber: totalCount,
        pieChartData
    };

    return { data };
});

ipcMainHandle('financialAnalysis:get', async (step, startDate, endDate) => {
    const data = await getPeriodsWithTestRegisterIds(step, startDate, endDate);
    const tests = await getTests(0, 100, '');

    const testPriceMap = new Map<number, number>();
    for (const test of tests.tests) {
        testPriceMap.set(test.id, test.price);
    }

    const out: FinancialAnalysisOutput = {
        totalCost: 0,
        totalPaid: 0,
        periods: []
    }

    let totalCost = 0;
    let totalPaid = 0;
    for (const period of data) {
        let periodCost = 0;
        let periodPaid = 0;

        const detailsMap = new Map<number, number>();

        for (const id of period.testRegisterIds) {
            const testRegister = await getTestRegistrationById(id);

            if (testRegister) {
                totalCost += testRegister.total_cost;
                totalPaid += testRegister.paid_price;

                periodCost += testRegister.total_cost;
                periodPaid += testRegister.paid_price;

                for (const test of testRegister.registeredTests) {
                    const cost = detailsMap.get(test.test.id);
                    if (!cost) {
                        detailsMap.set(test.test.id, testPriceMap.get(test.test.id)!);
                    } else {
                        detailsMap.set(test.test.id, cost + testPriceMap.get(test.test.id)!);
                    }
                }
            }
        }

        const periodTestDetails = Array.from(detailsMap, ([key, value]) => ({
            testId: key,
            testName: tests.tests.find(item => item.id == key)!.name,
            testTotalCost: value
        }))

        out.periods.push({
            startDate: period.startDateOfPeriod,
            endDate: period.endDateOfPeriod,
            periodCost: periodCost,
            periodPaid: periodPaid,
            tests: periodTestDetails
        });
    }

    out.totalCost = totalCost;
    out.totalPaid = totalPaid;

    return { data: out }
});
