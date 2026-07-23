import { useState } from "react";
import "./App.css";
import ModelList from "./component/ModelList";
import { useModelStore } from "./store/modelStore";
import Chat from "./component/Chat";

function App() {
    const { selectedModel } = useModelStore();

    return (
        <>
            <h1>Mini Chat IA</h1>

            <ModelList />

            <div>
              Modelo Seleccionado: {selectedModel.display_name}
            </div>

            {selectedModel.instance_id && <Chat />}
        </>
    );
}

export default App;
