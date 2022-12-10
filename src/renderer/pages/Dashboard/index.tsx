import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    CloseButton,
    Code,
    Container,
    FormControl,
    FormLabel,
    Input,
    Text
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useReceiver } from "../../hooks/useReceiver";
import { useSender } from "../../hooks/useSender";

export default function Dashboard() {
    const [isRunning, setIsRunning] = useState(false);
    const [serverInfo, setServerInfo] = useState<SMTPServerInfo | null>(null);
    const { send } = useSender();
    const portRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>("");

    useReceiver("smtp-started", (_, data) => {
        setIsRunning(true);
        setServerInfo(data);
    });

    useReceiver("smtp-closed", (_) => {
        setIsRunning(false);
        setServerInfo(null);
    });

    useReceiver("smtp-error", (_, e) => {
        setError(e);
        setIsRunning(false);
    });

    const handleSubmit = () => {
        setError("");
        const port = portRef.current?.valueAsNumber;
        const name = usernameRef.current?.value || "";
        const password = passwordRef.current?.value || "";

        if (isRunning) {
            send("stop-smtp");
        } else {
            send("start-smtp", { username: name, password, port: isNaN(port!) ? undefined : port });
        }
    };

    return (
        <Container w="sm" rounded={"md"} p="3" bg="whitesmoke">
            {error ? (
                <Alert status="error" variant="left-accent">
                    <AlertIcon />
                    {error}
                </Alert>
            ) : null}
            <Text fontSize="xl">SMTP Settings</Text>
            <FormControl isDisabled={isRunning}>
                <FormLabel>SMTP Port</FormLabel>
                <Input bg="white" ref={portRef} type="number" min={1024} max={65535} placeholder="Custom SMTP port" />
                <FormLabel>Authentication Username</FormLabel>
                <Input bg="white" ref={usernameRef} type="text" placeholder="Leave empty for no username check" />
                <FormLabel>Authentication Password</FormLabel>
                <Input bg="white" ref={passwordRef} type="text" placeholder="Leave empty for no password check" />
                <Button onClick={handleSubmit} variant="solid" colorScheme="teal" className="w-full mt-3">
                    {isRunning ? "Stop" : "Start"} SMTP Server
                </Button>
            </FormControl>
            {serverInfo ? (
                <Box mt="5">
                    <Text mb="3">
                        You can now link your smtp client to <Code>localhost</Code> at port{" "}
                        <Code>{serverInfo.port}</Code>
                    </Text>
                </Box>
            ) : null}
        </Container>
    );
}
