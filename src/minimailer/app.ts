import { app, BrowserWindow } from "electron";
import { MiniMailer } from "./MiniMailer";
import { MiniMailerUpdater } from "./updater/MiniMailerUpdater";

let minimailer: MiniMailer;

async function bootstrap() {
    let updater = new MiniMailerUpdater();
    updater.start();
    const hadUpdate = await updater.check();
    if (hadUpdate) return updater.stop();

    minimailer = new MiniMailer();

    minimailer.window.once("ready-to-show", () => {
        updater.stop();
        (updater as MiniMailerUpdater | null) = null;
        minimailer.create();
    });
}

app.whenReady().then(() => {
    bootstrap();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            bootstrap();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
