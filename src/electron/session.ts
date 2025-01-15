export class Session {
    private static instance: Session;

    private static username: string;
    private static role: string;

    private constructor() {
        console.log("A session created!");
    }

    private static setUsername(username: string) {
        this.username = username;
    }
    private static setRole(role: string) {
        this.role = role;
    }

    public static setSession(username: string, role: string) {
        if (!Session.instance) {
            Session.instance = new Session();
        }
        Session.setUsername(username);
        Session.setRole(role);
    }

    public static getSession() {
        return { username: this.username, role: this.role }
    }

    public static isAdmin() {
        return this.role == 'admin';
    }
}
