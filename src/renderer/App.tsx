import { Box, SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";
import { useReceiver } from "./hooks/useReceiver";
import { useSender } from "./hooks/useSender";
import Dashboard from "./pages/Dashboard";
import { List, MailRenderer } from "./pages/Mail/List";

export default function App() {
    const [currentMail, setCurrentMail] = useState<ParsedMail | null>(null);

    return (
        <Box className="select-none p-3">
            <SimpleGrid columns={currentMail ? 3 : 2} gap={5}>
                <Dashboard />
                <List onMail={(mail) => setCurrentMail(mail)} />
                {currentMail ? <MailRenderer mail={currentMail} /> : null}
            </SimpleGrid>
        </Box>
    );
}
