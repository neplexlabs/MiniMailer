import { ipcMain } from "electron";
import { MiniMailer } from "./MiniMailer";

export function createIpcHandler(app: MiniMailer) {
    ipcMain.on("start-smtp", (_, data: SMTPStartPayload) => {
        app.startSmtpServer(data);
    });

    ipcMain.on("stop-smtp", () => {
        app.stopSmtpServer();
    });

    ipcMain.on("get-mails", () => {
        if (!app.smtp) return app.send("mails", []);
        const mails = [...app.smtp.mails.values()];

        app.send("mails", mails);
    });

    ipcMain.on("get-mail", (_, id: string) => {
        const mail = app.smtp?.mails.find((r) => r.id === id);
        return app.send("mail", mail || null);
    });
}

export function unregisterAll() {
    ipcMain.removeAllListeners();
}
