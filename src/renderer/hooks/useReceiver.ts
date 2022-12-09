import { useEffect } from "react";

export function useReceiver<K extends keyof MailerCommandsOutgoing>(channel: K, callback: MailerCommandsOutgoing[K]) {
    useEffect(() => {
        MiniMailer.receive(channel, callback);

        return () => MiniMailer.close(channel, callback);
    }, []);

    return {
        close: () => MiniMailer.close(channel, callback)
    };
}
