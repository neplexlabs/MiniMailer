import { randomUUID } from "crypto";
import { SMTPServer, SMTPServerDataStream } from "smtp-server";
import { ParsedMail, simpleParser } from "mailparser";
import { MailError } from "./MailError";

const SERVER_PORT = 50478 as const;

function createMessage(stream: SMTPServerDataStream) {
    return new Promise<ParsedMail>((resolve, reject) => {
        stream.on("error", (err) => {
            reject(err);
        });

        stream.on("end", () => {
            if (stream.sizeExceeded) {
                const err = new MailError("Error: message exceeds fixed maximum message size 50 MB", 552);
                return reject(err);
            }
        });

        simpleParser(stream).then(
            (m) => resolve(m),
            (e) => reject(e)
        );
    });
}

interface ServerInfo {
    port: number;
    server: SMTPServer;
    mails: Map<string, ParsedMail>;
}

export function createSMTPServer() {
    const mailStore = new Map<string, ParsedMail>();
    const server = new SMTPServer({
        authOptional: true,
        disabledCommands: ["AUTH", "STARTTLS"],
        authMethods: ["PLAIN", "LOGIN", "CRAM-MD5"],
        size: 50 * 1024 * 1024,
        hidePIPELINING: true,
        onAuth(auth, session, callback) {
            callback(null, {
                user: randomUUID()
            });
        },
        onData(stream, session, callback) {
            createMessage(stream).then(
                (mail) => {
                    callback(null);
                    mailStore.set(randomUUID(), mail);
                },
                (e) => callback(e || new MailError("failed to parse email"))
            );
        }
    });

    return {
        port: SERVER_PORT,
        server,
        mails: mailStore
    } as ServerInfo;
}
