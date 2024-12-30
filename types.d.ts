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
            insert: (patientId: number, doctorId: number | null, refNumber: number | null, date: Date, testIds: number[], totalCost: number, paidPrice: number) => Promise<{ success: boolean; error?: string }>;
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

    'normalRanges:getForTestField': { args: [nuumber], return: { normalRanges: NormalRange[] } };
    'normalRanges:getForTest': { args: [nuumber], return: { normalRanges: NormalRange[] } };
    'normalRanges:insertOrUpdate': { args: [number, number, object]; return: { success: boolean; error?: string } };

    'testRegister:insert': {
        args: [number, number | null, number | null, Date, number[], number, number],
        return: { success: boolean; error?: string }
    }
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