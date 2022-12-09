export function useSender() {
    return {
        send: <K extends keyof MailerCommandsIncoming>(
            channel: K,
            ...data: Parameters<OmitFirstArg<MailerCommandsIncoming[K]>>
        ) => {
            MiniMailer.send(channel, ...data);
        }
    };
}
