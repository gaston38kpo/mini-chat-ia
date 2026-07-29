import { headers, request } from "../helper/serviceHelper";

// OBTENGO LOS MODELOS
const getModelsList = async () => {
    return await request('/models', undefined, 'getModelsList');
}

// CARGO UN MODELO
const loadModel = async (modelKey) => {
    const jsBody = { model: modelKey };

    return await request('/models/load', {
        method: 'POST',
        headers,
        body: JSON.stringify(jsBody)
    }, 'loadModel');
}

// DESCARGO UN MODELO
const unloadModel = async (instanceId) => {
    const jsBody = { instance_id: instanceId };

    return await request('/models/unload', {
        method: 'POST',
        headers,
        body: JSON.stringify(jsBody)
    }, 'unloadModel');
}

// ENVIO UN MENSAJE AL MODELO
const sendMessage = async (instanceId, model, input) => {
    const jsBody = { input, model };

    if (instanceId) {
        jsBody.previous_response_id = instanceId;
    }

    return await request('/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify(jsBody)
    }, 'sendMessage');
}

export {
    getModelsList,
    loadModel,
    unloadModel,
    sendMessage
};
    