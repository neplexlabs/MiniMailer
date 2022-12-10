import { BrowserWindow, shell } from "electron";
import { createIpcHandler } from "./ipc";
import { createSMTPServer } from "./smtp/server";
import { isDev } from "./utils/isDev";

export class MiniMailer {
    public window = new BrowserWindow({
        center: true,
        show: false,
        webPreferences: {
            preload: `${__dirname}/preload/main.js`,
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    public smtp: ReturnType<typeof createSMTPServer> | null = null;

    public constructor() {
        this.window.webContents.setWindowOpenHandler((details) => {
            shell.openExternal(details.url);

            return { action: "deny" };
        });

        this._loadContent();
    }

    private _loadContent() {
        if (isDev) {
            this.window.loadURL("http://localhost:54887");
        } else {
            this.window.loadFile(`${__dirname}/../dist/index.html`);
        }
    }

    public create() {
        if (this.window.maximizable) this.window.maximize();
        this.window.show();
        createIpcHandler(this);
    }

    public stopSmtpServer() {
        if (!this.smtp) return;
        try {
            this.smtp.server.close(() => {
                this.send("smtp-closed");
                this.smtp = null;
            });
        } catch {
            this.send("smtp-closed");
            this.smtp = null;
        }
    }

    public startSmtpServer(data: SMTPStartPayload) {
        if (this.smtp) return;
        this.smtp = createSMTPServer({
            ...data,
            app: this
        });
        this.smtp.server.on("error", (err) => {
            this.send("smtp-error", `${err}`);
            this.stopSmtpServer();
        });
        this.smtp.server.on("close", () => {
            this.send("smtp-closed");
            if (this.smtp) this.smtp = null;
        });

        try {
            this.smtp.server.listen(this.smtp.port, () => {
                this.send("smtp-started", {
                    port: this.smtp!.port
                });
            });
        } catch (e) {
            this.stopSmtpServer();
            this.send("smtp-error", `${e}`);
        }
    }

    public send<K extends keyof MailerCommandsOutgoing>(
        channel: K,
        ...data: Parameters<OmitFirstArg<MailerCommandsOutgoing[K]>>
    ) {
        this.window.webContents.send(channel, ...data);
    }
}
