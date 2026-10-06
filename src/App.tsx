import { Toaster } from "./components/ui/sonner";
import GameShell from "./component/GameShell";
import HudBanner from "./component/HudBanner";
import RosterPanel from "./component/RosterPanel";
import ChroniclePanel from "./component/ChroniclePanel";
import StatusStrip from "./component/StatusStrip";
import useChat from "./component/useChat";
import useChatProvider from "./component/useChatProvider";
import useSelectedModel from "./component/useSelectedModel";
import { useModelStore } from "./store/modelStore";
import { getAppConfig } from "./constants/appConfig";

function App() {
    const { provider, providerLabel } = useChatProvider();
    const { selectedModel, isUnloading, onUnloadModel } = useSelectedModel();
    const setLastResponseId = useModelStore((state) => state.setLastResponseId);
    const appConfig = getAppConfig(providerLabel);
    const canManageModels = provider?.capabilities.canManageModels ?? false;

    // Lifted from Chat.tsx so the status strip can read the message count and the
    // sending flag. Chat.tsx stays the renderer for this slice and receives this
    // state as props through ChroniclePanel.
    const {
        messages,
        currentMessage,
        isSending,
        onSendMessage,
        onChangeInputText
    } = useChat({ selectedModel, setLastResponseId });

    return (
        <>
            <GameShell
                hud={<HudBanner appConfig={appConfig} providerLabel={providerLabel} />}
                roster={
                    <RosterPanel
                        selectedModel={selectedModel}
                        canManageModels={canManageModels}
                        isUnloading={isUnloading}
                        onUnloadModel={onUnloadModel}
                    />
                }
                chronicle={
                    <ChroniclePanel
                        selectedModel={selectedModel}
                        messages={messages}
                        currentMessage={currentMessage}
                        isSending={isSending}
                        onSendMessage={onSendMessage}
                        onChangeInputText={onChangeInputText}
                    />
                }
                status={
                    <StatusStrip
                        messageCount={messages.length}
                        connectionLabel={providerLabel}
                        isSending={isSending}
                    />
                }
            />

            <Toaster />
        </>
    );
}

export default App;
