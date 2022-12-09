import { contextBridge, ipcRenderer } from "electron";

const MiniMailerContext = {
    send<K extends keyof MailerCommandsIncoming>(
        channel: K,
        ...data: Parameters<OmitFirstArg<MailerCommandsIncoming[K]>>
    ) {
        ipcRenderer.send(channel, ...data);
    },
    receive<K extends keyof MailerCommandsOutgoing>(channel: K, handler: MailerCommandsOutgoing[K]) {
        ipcRenderer.on(channel, handler as any);
    },
    receiveOnce<K extends keyof MailerCommandsOutgoing>(channel: K, handler: MailerCommandsOutgoing[K]) {
        ipcRenderer.once(channel, handler as any);
    },
    close<K extends keyof MailerCommandsOutgoing>(channel: K, handler: MailerCommandsOutgoing[K]) {
        ipcRenderer.off(channel, handler);
    }
};

export type IMiniMailerContext = typeof MiniMailerContext;

contextBridge.exposeInMainWorld("MiniMailer", MiniMailerContext);
