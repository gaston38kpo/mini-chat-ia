const BASE_URL = "http://192.168.1.68:1234/api/v1";

const headers = { 'Content-Type': 'application/json' };

const getModelsList = async () => {
    const response = await fetch(`${BASE_URL}/models`);
    const data = await response.json();
    return data;
}

const loadModel = async (modelKey) => {
    const jsBody = { model: modelKey };

    return await fetch(`${BASE_URL}/models/load`, {
        method: 'POST',
        headers,
        body: JSON.stringify(jsBody)
    }).then(response => {
        if (!response.ok) {
            console.error(`error status: ${response.status}`);
        }
        return response.json();
    });
}

const unloadModel = async (instanceId) => {
    const jsBody = { instance_id: instanceId };

    return await fetch(`${BASE_URL}/models/unload`, {
        method: 'POST',
        headers,
        body: JSON.stringify(jsBody)
    }).then(response => {
        if (!response.ok) {
            console.error(`error status: ${response.status}`);
        }
        return response.json();
    });
}

export {
    getModelsList,
    loadModel,
    unloadModel
};
    