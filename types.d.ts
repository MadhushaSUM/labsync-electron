interface Window {
    electron: {
        patients: {
            get: () => Promise<{ patients: Patient[] }>;
            insert: (patient: Omit<Patient, 'id'>) => Promise<{ success: boolean; error?: string }>;
            update: (patient: Patient) => Promise<{ success: boolean; error?: string }>;
            delete: (id: number) => Promise<{ success: boolean; error?: string }>;
        };
    };
}


type EventPayloadMapping = {
    'patients:get': { args: []; return: { patients: Patient[] } };
    'patients:insert': { args: [Omit<Patient, 'id'>]; return: { success: boolean; error?: string } };
    'patients:update': { args: [Patient]; return: { success: boolean; error?: string } };
    'patients:delete': { args: [number]; return: { success: boolean; error?: string } };
};

type UnsubscribeFunction = () => void;

interface Patient {
    id: number;
    name: string;
    gender: string;
    date_of_birth: Date;
    contact_number?: string;
}