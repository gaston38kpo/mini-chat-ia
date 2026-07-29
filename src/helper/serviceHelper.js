const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://192.168.1.68:1234/api/v1";

const headers = { 'Content-Type': 'application/json' };

const request = async (path, options, label) => {
    let response;

    try {
        response = await fetch(`${BASE_URL}${path}`, options);
    } catch (error) {
        console.error(`${label} error: ${error}`);
        throw error;
    }

    if (!response.ok) {
        console.error(`${label} error status: ${response.status}`);
        throw new Error(`${label} error status: ${response.status}`);
    }

    return response.json();
}

export { request, headers };