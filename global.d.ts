import type { ParsedMail as MpParsedMail } from "mailparser";

declare global {
    type ICommandCallback<T> = (event: Electron.IpcRendererEvent, ...args: T) => any;
    type OCommandCallback<T> = (event: Electron.IpcMainEvent, ...args: T) => any;

    type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;

    type ParsedMail = MpParsedMail & { id: string };
    type ParsedMailArray = ParsedMail[];

    interface SMTPStartPayload {
        username?: string;
        password?: string;
        port?: number;
    }

    interface SMTPServerInfo {
        port: number;
    }

    interface MailerCommandsIncoming {
        "get-mails": ICommandCallback<[]>;
        "get-mail": ICommandCallback<[string]>;
        "start-smtp": ICommandCallback<[SMTPStartPayload]>;
        "stop-smtp": ICommandCallback<[]>;
    }

    interface MailerCommandsOutgoing {
        mails: OCommandCallback<[ParsedMailArray]>;
        mail: OCommandCallback<[ParsedMail | null]>;
        "smtp-started": OCommandCallback<[SMTPServerInfo]>;
        "smtp-closed": OCommandCallback<[]>;
        "smtp-error": OCommandCallback<[string]>;
    }
}

export {};
