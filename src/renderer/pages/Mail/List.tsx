import { Box, Card, CardBody, CardHeader, Container, Divider, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useReceiver } from "../../hooks/useReceiver";
import { useSender } from "../../hooks/useSender";
import { VscArrowLeft } from "react-icons/vsc";
import sanitizeHtml from "sanitize-html";

interface MailListCardProps {
    title: string;
    description: string;
    onClick?: () => any;
}

function MailListCard(data: MailListCardProps) {
    const { description, title, onClick } = data;
    return (
        <div onClick={onClick} className="border border-gray-400 rounded-md p-2">
            <Heading size="md">{title}</Heading>
            <Text fontSize="sm">{description}</Text>
        </div>
    );
}

interface ListProps {
    onMail?: (data: ParsedMail | null) => any;
}

export function List(props: ListProps) {
    const [mails, setMails] = useState<ParsedMailArray>([]);
    const { send } = useSender();

    useReceiver("mails", (_, mailsData) => {
        setMails(mailsData);
    });

    useReceiver("mail", (_, data) => {
        props.onMail?.(data);
    });

    useEffect(() => {
        send("get-mails");
    }, []);

    return (
        <Container bg="whitesmoke" maxH={"full"} className="overflow-y-auto p-3" rounded="md">
            {mails.length ? (
                <Flex direction="column" className="space-y-3">
                    {mails.map((m, i) => (
                        <MailListCard
                            key={i}
                            title={m.subject || m.id}
                            description={!m.html ? m.text || "" : m.html}
                            onClick={() => {
                                props.onMail?.(m);
                            }}
                        />
                    ))}
                </Flex>
            ) : (
                <Text>No mails to show!</Text>
            )}
        </Container>
    );
}

interface MailRendererProps {
    mail: ParsedMail;
}

export function MailRenderer(props: MailRendererProps) {
    const { mail } = props;

    return (
        <Container bg="whitesmoke" p="3" rounded="md">
            <Heading size="sm">{mail.subject || mail.id}</Heading>
            {mail.from ? <Text>From: {mail.from?.text}</Text> : null}
            {mail.cc ? (
                <Text>
                    CC: {Array.isArray(mail.cc) ? mail.cc.map((m, i) => <Text key={i}>{m.text}</Text>) : mail.cc.text}
                </Text>
            ) : null}
            {mail.to ? (
                <Text>
                    To: {Array.isArray(mail.to) ? mail.to.map((m, i) => <Text key={i}>{m.text}</Text>) : mail.to.text}
                </Text>
            ) : null}
            <Text
                className="mt-4"
                dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(mail.html || mail.text || "", {
                        allowVulnerableTags: false,
                        allowIframeRelativeUrls: false
                    })
                }}
            ></Text>
        </Container>
    );
}
