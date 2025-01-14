
interface Window {
    electron: {
        patients: {
            get: (page: number, pageSize: number, search: string) => Promise<{ total: number; patients: Patient[] }>;
            insert: (patient: Omit<Patient, 'id'>) => Promise<{ success: boolean; error?: string }>;
            update: (id: number, patient: Patient) => Promise<{ success: boolean; error?: string }>;
            delete: (id: number) => Promise<{ success: boolean; error?: string }>;
        },
        doctors: {
            get: (page: number, pageSize: number, search: string) => Promise<{ total: number; doctors: Doctor[] }>;
            insert: (doctor: Omit<Doctor, 'id'>) => Promise<{ success: boolean; error?: string }>;
            update: (id: number, doctor: Doctor) => Promise<{ success: boolean; error?: string }>;
            delete: (id: number) => Promise<{ success: boolean; error?: string }>;
        },
        tests: {
            get: (page: number, pageSize: number, search: string) => Promise<{ total: number; tests: Test[] }>;
            updatePrice: (id: number, price: number) => Promise<{ success: boolean; error?: string }>;
        },
        testFields: {
            getForTest: (testId: number) => Promise<{ test_fields: TestField[] }>
        },
        normalRanges: {
            getForTestField: (testFieldId: number) => Promise<{ normalRanges: NormalRange[] }>;
            getForTest: (testId: number) => Promise<{ normalRanges: NormalRange[] }>;
            insertOrUpdate: (testId: number, testFieldId: number, rules: object) => Promise<{ success: boolean; error?: string }>;
        },
        testRegister: {
            insert: (patientId: number, doctorId: number | null, refNumber: number | null, date: Date, testIds: number[], totalCost: number, paidPrice: number) => Promise<{ success: boolean; testRegisterId?: number, error?: string }>;
            get: (page: number, pageSize: number, fromDate?: Date, toDate?: Date, patientId?: number, refNumber?: number) => Promise<{ registrations: Registration[], total: number }>;
            getById: (testRegisterId: number) => Promise<{ registration: Registration | null }>;
            update: (id: number, patientId: number, doctorId: number | null, refNumber: number | null, date: Date, testIds: number[], dataAddedTestIds: number[], previousTestIds: number[], totalCost: number, paidPrice: number) => Promise<{ success: boolean; error?: string }>;
            getDataEmptyTests: () => Promise<{ dataEmptyTests: DataEmptyTests[] }>;
            addData: (testRegisterId: number, testId: number, data: object, options: object, doctorId?: number) => Promise<{ success: boolean; error?: string }>;
            delete: (testRegisterIds: number[]) => Promise<{ success: boolean; rowCount?: number | null; error?: string }>;
            editDataOfATest: (testRegisterId: number, testId: number) => Promise<{ success: boolean; error?: string }>;
        },
        report: {
            test: () => Promise<{ success: boolean }>;
            getTests: (page: number, pageSize: number, allReports: boolean, fromDate?: Date, toDate?: Date, patientId?: number, refNumber?: number) => Promise<{ registrations: DataEmptyTests[], total: number }>;
            printPreview: (report: DataEmptyTests) => void;
            print: (reports: DataEmptyTests[]) => void;
            printReceipt: (registration: Registration) => void;
            mergeReports: (reports: DataEmptyTests[]) => void;
        },
        printers: {
            get: () => Promise<{ printers: Printer[] }>;
            save: (data: { report_printer: string, receipt_printer: string }) => Promise<{ success: boolean; error?: string }>;
        },
        patientAnalysis: {
            get: (patientId: number, startDate?: Date, endDate?: Date) => Promise<{ data: AnalysisData }>;
        },
        testAnalysis: {
            get: (startDate?: Date, endDate?: Date) => Promise<{ data: AnalysisData }>;
        },
        financialAnalysis: {
            get: (step: string, startDate?: Date, endDate?: Date) => Promise<{ data: any }>;
        },
        agePreference: {
            save: (data: { age_format: string[] }) => Promise<{ success: boolean; error?: string }>;
            get: () => Promise<{ age_format: string[] }>;
        },
        authenticate: {
            login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
            isAdmin: () => Promise<boolean>;
            getUsers: () => Promise<{ users: User[] }>;
            updateUser: (id: number, username: string, role: string) => Promise<{ success: boolean; error?: string }>;
            updatePassword: (id: number, currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
        }
    };
}


type EventPayloadMapping = {
    'patients:get': { args: [number, number, string]; return: { patients: Patient[], total: number } };
    'patients:insert': { args: [Omit<Patient, 'id'>]; return: { success: boolean; error?: string } };
    'patients:update': { args: [number, Patient]; return: { success: boolean; error?: string } };
    'patients:delete': { args: [number]; return: { success: boolean; error?: string } };

    'doctors:get': { args: [number, number, string]; return: { doctors: Doctor[], total: number } };
    'doctors:insert': { args: [Omit<Doctor, 'id'>]; return: { success: boolean; error?: string } };
    'doctors:update': { args: [number, Doctor]; return: { success: boolean; error?: string } };
    'doctors:delete': { args: [number]; return: { success: boolean; error?: string } };

    'tests:get': { args: [number, number, string]; return: { tests: Test[]; total: number } };
    'tests:updatePrice': { args: [number, number]; return: { success: boolean; error?: string } };

    'testFields:getForTest': { args: [number]; return: { test_fields: TestField[] } };

    'normalRanges:getForTestField': { args: [number], return: { normalRanges: NormalRange[] } };
    'normalRanges:getForTest': { args: [number], return: { normalRanges: NormalRange[] } };
    'normalRanges:insertOrUpdate': { args: [number, number, object]; return: { success: boolean; error?: string } };

    'testRegister:insert': {
        args: [number, number | null, number | null, Date, number[], number, number], return: { success: boolean; error?: string }
    };
    'testRegister:get': { args: [number, number, Date?, Date?, number?, number?], return: { registrations: Registration[], total: number } };
    'testRegister:getById': { args: [number], return: { registration: Registration | null } };
    'testRegister:update': {
        args: [number, number, number | null, number | null, Date, number[], number[], number[], number, number], return: { success: boolean; error?: string }
    };
    'testRegister:getDataEmptyTests': { args: [], return: { dataEmptyTests: DataEmptyTests[] } };
    'testRegister:addData': { args: [number, number, object, object, number?], return: { success: boolean; testRegisterId?: number, error?: string } };
    'testRegister:delete': { args: [number[]], return: { success: boolean; rowCount?: number | null; error?: string } };
    'testRegister:editDataOfATest': { args: [number, number], return: { success: boolean; error?: string } };

    'report:test': { args: [], return: { success: boolean } };
    'report:getTests': { args: [number, number, boolean, Date?, Date?, number?, number?], return: { registrations: DataEmptyTests[], total: number } };
    'report:printPreview': { args: [report: DataEmptyTests], return: {} };
    'report:print': { args: [reports: DataEmptyTests[]], return: {} };
    'report:printReceipt': { args: [registration: Registration], return: {} };
    'report:mergeReports': { args: [reports: DataEmptyTests[]], return: {} };

    'printers:get': { args: [], return: { printers: Printer[] } };
    'printers:save': { args: [{ report_printer: string, receipt_printer: string }], return: { success: boolean; error?: string } };

    'patientAnalysis:get': { args: [number, Date?, Date?], return: { data: AnalysisData } };
    'testAnalysis:get': { args: [Date?, Date?], return: { data: AnalysisData } };
    'financialAnalysis:get': { args: [string, Date?, Date?], return: { data: any } };

    'config:saveAgePreference': { args: [{ age_format: string[] }], return: { success: boolean; error?: string } };
    'config:getAgePreference': { args: [], return: { age_format: string[] } };

    'authenticate:login': { args: [string, string], return: { success: boolean; error?: string } };
    'authenticate:isAdmin': { args: [], return: boolean };
    'authenticate:getUsers': { args: [], return: { users: User[] } };
    'authenticate:updateUser': { args: [number, string, string], return: { success: boolean; error?: string } };
    'authenticate:updatePassword': { args: [number, string, string], return: { success: boolean; error?: string } };
};

type UnsubscribeFunction = () => void;

interface Patient {
    id: number;
    name: string;
    gender: string;
    date_of_birth: Date;
    contact_number?: string;
}

interface Test {
    id: number;
    name: string;
    code: string;
    price: number;
}

interface Doctor {
    id: number;
    name: string;
}

interface TestField {
    id: number;
    test_id: number;
    name: string;
}

interface NormalRange {
    id: number,
    test_id: number,
    test_field_id: number,
    rules: object[]
}

interface RegisteredTest {
    test: Test;
    doctor: Doctor | null;
    data: Record<string, any>;
    options: Record<string, any>;
    data_added: boolean;
    printed: boolean;
}

interface Registration {
    id: number;
    date: Date;
    patient: Patient;
    ref_number?: number;
    total_cost: number;
    paid_price: number;
    registeredTests: RegisteredTest[];
}

interface DataEmptyTests {
    testRegisterId: number;
    testId: number;
    date: Date;
    testName: string;
    patientId: number;
    patientName: string;
    patientDOB: Date;
    patientGender: string;
    options: Record<string, any>;
    ref_number?: number;
    doctorId?: number;
    doctorName?: string;
    data?: Record<string, any>;
}

interface AnalysisData {
    totalTestNumber: number,
    pieChartData: {
        testId: number,
        testName: string,
        count: number,
        tests: {
            date: Date,
            refNumber?: number,
            testRegisterId: number
        }[]
    }[],
}

interface FinancialAnalysisOutput {
    totalCost: number;
    totalPaid: number;
    periods: {
        startDate: Date;
        endDate: Date;
        periodCost: number;
        periodPaid: number;
        tests: {
            testId: number;
            testName: string;
            testTotalCost: number;
        }[]
    }[]
}

interface User {
    id: number;
    username: string;
    role: string;
}