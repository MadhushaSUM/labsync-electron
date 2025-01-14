import { getUserById, getUserByUsername, getUsers, updateUser, updateUserPassword } from "../database/db.js";
import { Session } from "../session.js";
import { ipcMainHandle } from "../utils.js";

ipcMainHandle('authenticate:login', async (username, password) => {
    try {
        const users = await getUserByUsername(username);
        if (users.length > 0) {
            if (password == users[0].password) {
                Session.setSession(username, users[0].role);
                return { success: true }
            }
        }
        return { success: false, error: "Invalid username or password!" }
    } catch (error) {
        console.error(error);
        return { success: false, error: "Internal error. Failed to login!" }
    }
});

ipcMainHandle('authenticate:isAdmin', async () => {
    return Session.isAdmin();
});

ipcMainHandle('authenticate:getUsers', async () => {
    try {
        const users = await getUsers();
        return { users }
    } catch (error) {
        console.error(error);
        return { users: [] }
    }
});

ipcMainHandle('authenticate:updateUser', async (id: number, username: string, role: string) => {
    try {
        await updateUser(id, username, role);
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
});

ipcMainHandle('authenticate:updatePassword', async (id: number, currentPassword: string, newPassword: string) => {
    try {
        const users = await getUserById(id);;
        if (users.length > 0) {
            if (currentPassword == users[0].password) {
                await updateUserPassword(id, newPassword);
                return { success: true }
            }
        }
        return { success: false, error: "Invalid current password!" }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
})