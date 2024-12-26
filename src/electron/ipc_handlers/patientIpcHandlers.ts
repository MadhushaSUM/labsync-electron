import { getPatients, insertPatient, updatePatient, deletePatient } from '../database/db.js';
import { ipcMainHandle } from '../utils.js';

ipcMainHandle('patients:get', async () => {
    const patients = await getPatients();
    return { patients };
});

ipcMainHandle('patients:insert', async (Patient) => {
    try {
        await insertPatient(Patient);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
});

ipcMainHandle('patients:update', async (Patient) => {
    try {
        await updatePatient(Patient);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
});

ipcMainHandle('patients:delete', async (id) => {
    try {
        await deletePatient(id);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
});
