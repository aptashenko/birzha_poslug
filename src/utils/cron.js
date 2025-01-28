import https from 'node:https'
// URL сервера, который нужно будить
const url = 'https://birzha-poslug.fly.dev';

// Функция для отправки запроса
function pingServer() {
    https.get(url, (res) => {
        console.log(`Сервер ответил с кодом состояния: ${res.statusCode}`);
    }).on('error', (err) => {
        console.error(`Ошибка при попытке подключения к серверу: ${err.message}`);
    });
}

// Интервал в миллисекундах (5 минут = 300 000 мс)
const interval = 300000;

// Запуск пинга сервера каждые 5 минут
export const startPingServer = () => {
    setInterval(pingServer, interval);

    console.log(`Скрипт запущен. Пинг сервера ${url} каждые ${interval / 60000} минут.`);
}
