import { BrowserWindow, shell } from "electron";
import { isDev } from "./utils/isDev";

export class MiniMailer {
    public window = new BrowserWindow({
        center: true,
        show: false
    });

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
    }
}
