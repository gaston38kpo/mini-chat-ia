const toDomainModel = (model) => {
    return {
        ...model,
        displayName: model.display_name ?? "",
        loadedInstances: Array.isArray(model.loaded_instances) ? model.loaded_instances : []
    };
};

const normalizeModels = (response) => {
    const sourceModels = Array.isArray(response?.models) ? response.models : [];
    const seen = new Map();

    for (const model of sourceModels) {
        seen.set(model.key, toDomainModel(model));
    }

    return Array.from(seen.values());
};

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
    normalizeModels,
    getLoadedInstanceIds
};
