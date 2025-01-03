import { previewPDF } from "../pdf/reportbase.js";
import { ipcMainHandle } from "../utils.js";

ipcMainHandle('report:test', async () => {
    previewPDF();
    return { success: true };
});