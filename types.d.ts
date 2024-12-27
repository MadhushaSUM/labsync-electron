interface Window {
    electron: {
        patients: {
            get: (page: number, pageSize: number, search: string) => Promise<{ total: number; patients: Patient[] }>;
            insert: (patient: Omit<Patient, 'id'>) => Promise<{ success: boolean; error?: string }>;
            update: (patient: Patient) => Promise<{ success: boolean; error?: string }>;
            delete: (id: number) => Promise<{ success: boolean; error?: string }>;
        };
    };
}


type EventPayloadMapping = {
    'patients:get': { args: [number, number, string]; return: { patients: Patient[], total: number } };
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