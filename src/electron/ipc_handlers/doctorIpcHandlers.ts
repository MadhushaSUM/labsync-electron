import { deleteDoctor, getDoctors, insertDoctor, updateDoctor } from '../database/db.js';
import { ipcMainHandle, writeErrorLog } from '../utils.js';

ipcMainHandle('doctors:get', async (page, pageSize, search) => {
    try {
        const limit = pageSize;
        const offset = (page - 1) * pageSize;
        const { doctors, total } = await getDoctors(offset, limit, search);
        return { doctors, total };
    } catch (error) {
        writeErrorLog(error);
        return { doctors: [], total: 0 }
    }
});

ipcMainHandle('doctors:insert', async (doctor) => {
    try {
        await insertDoctor(doctor);
        return { success: true };
    } catch (error: any) {
        writeErrorLog(error);
        return { success: false, error: error.message };
    }
});

ipcMainHandle('doctors:update', async (id, doctor) => {
    try {
        await updateDoctor(id, doctor);
        return { success: true };
    } catch (error: any) {
        writeErrorLog(error);
        return { success: false, error: error.message };
    }
});

ipcMainHandle('doctors:delete', async (id) => {
    try {
        await deleteDoctor(id);
        return { success: true };
    } catch (error: any) {
        writeErrorLog(error);
        return { success: false, error: error.message };
    }
});
