export function getDate(date) {
    const options = {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
    };
    const optionsTime = {
        hour: 'numeric',
        minute: 'numeric',
    };

    return `${date.toLocaleDateString('ru-RU', options)} ${date.toLocaleTimeString('ru-RU', optionsTime)}`;
}
