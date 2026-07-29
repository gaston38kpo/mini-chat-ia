import "./App.css";
import ModelList from "./component/ModelList";
import { useModelStore } from "./store/modelStore";
import Chat from "./component/Chat";
import { Toaster } from "sonner";

function App() {
    const selectedModel = useModelStore((state) => state.selectedModel);

    return (
        <>
            <h1>Mini Chat IA</h1>

            <ModelList />

            <span>
                Modelo Seleccionado:
            </span>
                
            <small className="d-inline-flex mb-3 px-2 py-1 fw-semibold text-success-emphasis bg-success-subtle border border-success-subtle rounded-2">
            {selectedModel.display_name || "No hay modelo elegido"}
            </small>

            {selectedModel.instance_id && <Chat/>}

            <Toaster richColors position="top-center" />
        </>
    );
}

export default App;
