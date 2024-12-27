import { getPatients, insertPatient, updatePatient, deletePatient } from '../database/db.js';
import { ipcMainHandle } from '../utils.js';

ipcMainHandle('patients:get', async (page, pageSize, search) => {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    const { patients, total } = await getPatients(offset, limit, search);
    return { patients, total };
});

ipcMainHandle('patients:insert', async (Patient) => {
    try {
        await insertPatient(Patient);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
});

ipcMainHandle('patients:update', async (id, Patient) => {
    try {
        await updatePatient(id, Patient);
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
