import { useState, type FormEvent } from "react";
import { useLocalChat } from "./useLocalChat";

/** La pantalla: la lista de mensajes y el formulario para escribir. */
function App() {
    // El texto del input es estado local de este componente.
    const [input, setInput] = useState("");
    // `messages`, `isSending` y `send` vienen del hook.
    const { messages, isSending, send } = useLocalChat();

    function onSubmit(event: FormEvent) {
        event.preventDefault(); // evita que el formulario recargue la página
        send(input); // dispara el envío; el hook actualiza el estado
        setInput(""); // limpiamos el input
    }

    return (
        <div className="mx-auto flex h-dvh max-w-2xl flex-col gap-4 p-4">
            <h1 className="bg-gradient-to-r from-orange-500 via-crimson-500 to-crimson-600 bg-clip-text text-lg font-bold text-transparent">🔥 Chat con LM Studio</h1>

            <div className="flex-1 space-y-3 overflow-y-auto">
                {/* key={index} es seguro acá porque solo agregamos mensajes al final. */}
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={message.role === "user" ? "text-right" : "text-left"}
                    >
                        <span
                            className={
                                "inline-block whitespace-pre-wrap rounded-2xl px-4 py-2 text-left shadow-sm " +
                                (message.role === "user" ? "bg-gradient-to-br from-crimson-400 to-crimson-600 text-white" : "bg-white")
                            }
                        >
                            {/* content vacío = todavía no llegó ningún token */}
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
                    className="flex-1 rounded-full border border-crimson-200 bg-white px-4 py-2 outline-none focus:border-crimson-400"
                />

                <button
                    type="submit"
                    disabled={isSending}
                    className="rounded-full bg-gradient-to-r from-crimson-500 to-crimson-600 px-4 py-2 font-bold text-white disabled:opacity-50"
                >
                    {isSending ? "🔥" : "Enviar"}
                </button>
            </form>
        </div>
    );
}

export default App;
