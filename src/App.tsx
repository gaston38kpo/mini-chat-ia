import { useState, type FormEvent } from "react";
import { useLocalChat } from "./useLocalChat";

function App() {
    const [input, setInput] = useState("");
    const { messages, isSending, send } = useLocalChat();

    function onSubmit(event: FormEvent) {
        event.preventDefault();
        send(input);
        setInput("");
    }

    return (
        <div className="mx-auto flex h-dvh max-w-2xl flex-col gap-4 p-4">
            <h1 className="text-lg font-semibold">Chat con LM Studio</h1>

            <div className="flex-1 space-y-3 overflow-y-auto">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={message.role === "user" ? "text-right" : "text-left"}
                    >
                        <span className="inline-block whitespace-pre-wrap rounded border border-gray-300 px-3 py-2 text-left">
                            {message.content || "…"}
                        </span>
                    </div>
                ))}
            </div>

            <form onSubmit={onSubmit} className="flex gap-2">
                <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    disabled={isSending}
                    placeholder="Escribí tu mensaje"
                    className="flex-1 rounded border border-gray-300 px-3 py-2"
                />

                <button
                    type="submit"
                    disabled={isSending}
                    className="rounded border border-gray-300 px-4 py-2"
                >
                    {isSending ? "..." : "Enviar"}
                </button>
            </form>
        </div>
    );
}

export default App;
