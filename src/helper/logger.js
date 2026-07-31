const logError = (message, error) => {
    if (import.meta.env.DEV) {
        console.error(message, error);
    }
};

export { logError };
