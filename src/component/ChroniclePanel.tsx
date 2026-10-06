import Markdown from "react-markdown";
import { Send } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/8bit/card";
import { Badge } from "@/components/ui/8bit/badge";
import { Button } from "@/components/ui/8bit/button";
import { Input } from "@/components/ui/8bit/input";
import { ScrollArea } from "@/components/ui/8bit/scroll-area";
import { Spinner } from "@/components/ui/8bit/spinner";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
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
 * Rank 2 zone: the chronicle/dialogue stage. The message log is an 8bitcn
 * scroll-area that keeps the `role="log"` + `aria-live="polite"` live region;
 * the composer is the bottom dialogue box and sends on Enter (form submit),
 * blocked while a send is running. This absorbs the former `Chat.tsx` renderer.
 */
const ChroniclePanel = ({
    selectedModel,
    messages,
    currentMessage,
    isSending,
    onSendMessage,
    onChangeInputText
}: ChroniclePanelProps) => {
    const lastMessage = messages[messages.length - 1];
    const isWaiting = isSending && !lastMessage?.content;
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const viewport = bottomRef.current?.closest<HTMLElement>(
            '[data-slot="scroll-area-viewport"]'
        );

        if (!viewport) return;

        const distanceFromBottom =
            viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;

        // Follow the stream only when the user is already near the bottom.
        if (distanceFromBottom < 80) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }, [messages]);

    return (
        <Card className="h-full min-h-0">
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm">Chronicle</CardTitle>

                    <Badge variant="secondary" className="text-[10px]">
                        {messages.length}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
                <ScrollArea
                    role="log"
                    aria-live="polite"
                    aria-label="Registro de mensajes"
                    className="min-h-0 flex-1 border-2 border-foreground/30 bg-background/40 p-3"
                >
                    <div className="flex flex-col gap-4">
                        {messages.length === 0 && (
                            <p className="text-xs text-muted-foreground">
                                Aun no hay mensajes en esta conversacion.
                            </p>
                        )}

                        {messages.map((message) => {
                            const isUserMessage = message.role === "user";

                            return (
                                <div
                                    key={message.id}
                                    className={cn(
                                        "flex",
                                        isUserMessage ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[85%] border-2 p-3",
                                            isUserMessage
                                                ? "border-foreground bg-foreground/10"
                                                : "border-foreground/30 bg-background"
                                        )}
                                    >
                                        <span className="retro text-[10px] uppercase text-muted-foreground">
                                            {isUserMessage
                                                ? "Tu"
                                                : message.modelName || selectedModel.displayName}
                                        </span>

                                        <div className="mt-2 text-sm leading-relaxed [font-family:system-ui] [&_a]:underline [&_code]:bg-foreground/10 [&_code]:px-1 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:my-1 [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:bg-foreground/10 [&_pre]:p-2 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-4">
                                            <Markdown>{message.content}</Markdown>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {isWaiting && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Spinner className="size-4" />
                                <span>Esperando respuesta...</span>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>
                </ScrollArea>

                <form onSubmit={onSendMessage} className="flex items-start gap-2">
                    <Input
                        type="text"
                        name="message"
                        value={currentMessage}
                        onChange={onChangeInputText}
                        disabled={isSending}
                        placeholder="Escribe tu mensaje"
                        aria-label="Escribe tu mensaje"
                        className="flex-1"
                    />

                    <Button
                        type="submit"
                        disabled={isSending}
                        aria-label="Enviar mensaje"
                        className="shrink-0"
                    >
                        {isSending ? (
                            <Spinner className="size-4" />
                        ) : (
                            <Send className="size-4" />
                        )}

                        <span>Enviar</span>
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ChroniclePanel;
