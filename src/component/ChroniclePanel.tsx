import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/8bit/card";
import Chat from "./Chat";
import type React from "react";
import type { ChatMessage } from "../chat/providers/chatProvider.contract";
import type { SelectedModel } from "../constants/appConstants";

interface ChroniclePanelProps {
    selectedModel: SelectedModel;
    messages: ChatMessage[];
    currentMessage: string;
    isSending: boolean;
    onSendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
    onChangeInputText: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Rank 2 zone: the chronicle/dialogue stage. In this transitional slice it
 * frames the existing `Chat` renderer, which now receives its state as props
 * because `useChat` was lifted into `App` so the status strip can read the
 * message count and sending flag. S4 absorbs this renderer and drops `Chat`.
 */
const ChroniclePanel = (props: ChroniclePanelProps) => {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-sm">Chronicle</CardTitle>
            </CardHeader>

            <CardContent className="min-h-0 flex-1 overflow-y-auto">
                <Chat {...props} />
            </CardContent>
        </Card>
    );
};

export default ChroniclePanel;
