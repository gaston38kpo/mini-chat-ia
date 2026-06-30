const getModelsList = async () => {
    const response = await fetch('http://localhost:3000/models');
    const data = await response.json();
    return data;
}

export {
    getModelsList
};
    