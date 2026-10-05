const getLoadedInstanceIds = (models) => {
    return [...new Set(
        models.flatMap((model) =>
            Array.isArray(model.loadedInstances)
                ? model.loadedInstances.map((instance) => instance.id).filter(Boolean)
                : []
        )
    )];
};

export {
    getLoadedInstanceIds
};
