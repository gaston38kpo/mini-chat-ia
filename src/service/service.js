const BASE_URL = "http://192.168.1.68:1234/api/v1";

const headers = { 'Content-Type': 'application/json' };

// OBTENGO LOS MODELOS
const getModelsList = async () => {
    return await fetch(`${BASE_URL}/models`)
        .then(response => response.json());
}

// CARGO UN MODELO
const loadModel = async (modelKey) => {
    const jsBody = { model: modelKey };

    return await fetch(`${BASE_URL}/models/load`, {
        method: 'POST',
        headers,
        body: JSON.stringify(jsBody)
    }).then(response => {
        if (!response.ok) {
            console.error(`loadModel error status: ${response.status}`);
        }
        return response.json();
    }).catch(error => {
        console.error(`loadModel error: ${error}`);
    });
}

// DESCARGO UN MODELO
const unloadModel = async (instanceId) => {
    const jsBody = { instance_id: instanceId };

    return await fetch(`${BASE_URL}/models/unload`, {
        method: 'POST',
        headers,
        body: JSON.stringify(jsBody)
    }).then(response => {
        if (!response.ok) {
            console.error(`unloadModel error status: ${response.status}`);
        }
        return response.json();
    }).catch(error => {
        console.error(`unloadModel error: ${error}`);
    });
}

export {
    getModelsList,
    loadModel,
    unloadModel
};
    