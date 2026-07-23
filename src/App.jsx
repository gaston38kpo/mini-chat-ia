import { useState } from "react";
import "./App.css";
import ModelList from "./component/ModelList";
import { useModelStore } from "./store/modelStore";

function App() {
    const { selectedModel } = useModelStore();

    return (
        <>
            <h1>Mini Chat IA</h1>

            <ModelList />

            <div>
              Modelo Seleccionado: {selectedModel.display_name}
            </div>
        </>
    );
}

export default App;
