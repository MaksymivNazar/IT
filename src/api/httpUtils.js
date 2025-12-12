export const getErrorMessageFromResponse = async (response) => {
    try {
        const data = await response.json();

        if (Array.isArray(data.message)) {
            return data.message.join(' ');
        }
        if (typeof data.message === 'string') {
            return data.message;
        }
        if (data.error) {
            return data.error;
        }
    } catch {}
    return `Помилка ${response.status}`;
};
