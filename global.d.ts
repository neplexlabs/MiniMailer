import type { ParsedMail } from "mailparser";

declare global {
    type ICommandCallback<T> = (event: Electron.IpcRendererEvent, ...args: T) => any;
    type OCommandCallback<T> = (event: Electron.IpcMainEvent, ...args: T) => any;

    type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;

    type ParsedMailArray = (ParsedMail & { id: string })[];

    interface MailerCommandsIncoming {
        "get-mails": ICommandCallback<[]>;
        "get-mail": ICommandCallback<[string]>;
        "start-smtp": ICommandCallback<[]>;
        "stop-smtp": ICommandCallback<[]>;
    }

    interface MailerCommandsOutgoing {
        mails: OCommandCallback<[ParsedMailArray]>;
        "smtp-started": OCommandCallback<[{ port: number }]>;
        "smtp-stopped": OCommandCallback<[]>;
    }
}

export {};
