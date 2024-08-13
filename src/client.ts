import WebSocket from "ws";
import readline from "readline";

// Создаем интерфейс для чтения ввода из консоли
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Запрашиваем имя у пользователя
rl.question("Пожалуйста, введите свое имя: ", (name) => {
  if (!name.trim()) {
    console.log("Имя не может быть пустым.Выход...");
    rl.close();
    return;
  }

  // Подключаемся к WebSocket-серверу
  const ws = new WebSocket("ws://localhost:8080");

  // Обработка события открытия соединения
  ws.on("open", () => {
    console.log(`Подключено к серверу как ${name}. Вы можете начать болтать!`);
  });

  // Обработка входящих сообщений
  ws.on("message", (message: string) => {
    console.log(`Полученный: ${message}`);
  });

  // Обработка ошибок
  ws.on("error", (error) => {
    console.error(`Ошибка WebSocket: ${error}`);
  });

  // Функция для отправки сообщений
  const sendMessage = (message: string) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(`${name}: ${message}`);
    } else {
      console.log("WebSocket не открыт. Невозможно отправить сообщение.");
    }
  };

  // Чтение сообщений из консоли
  rl.on("line", (input) => {
    sendMessage(input);
  });
});
