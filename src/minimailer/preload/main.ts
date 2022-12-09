import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("MiniMailer", {
    send(channel: string, ...data: any[]) {
        ipcRenderer.send(channel, ...data);
    },
    receive(channel: string, handler: (...args: any[]) => any) {
        ipcRenderer.on(channel, handler);
    },
    receiveOnce(channel: string, handler: (...args: any[]) => any) {
        ipcRenderer.once(channel, handler);
    },
    close(channel: string, handler: (...args: any[]) => any) {
        ipcRenderer.off(channel, handler);
    }
});
