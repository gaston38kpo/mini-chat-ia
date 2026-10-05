import type { ChatModel } from "../chat/providers/chatProvider.contract";

const getLoadedInstanceIds = (models: ChatModel[]): string[] => {
    return [...new Set(
        models.flatMap((model) =>
            Array.isArray(model.loadedInstances)
                ? model.loadedInstances
                    .map((instance) => instance.id)
                    .filter((id): id is string => Boolean(id))
                : []
        )
    )];
};

export {
    getLoadedInstanceIds
};
