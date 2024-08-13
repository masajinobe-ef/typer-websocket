import { io } from "socket.io-client";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Пожалуйста, введите свое имя: ", (name) => {
  if (!name.trim()) {
    console.log("Имя не может быть пустым. Выход...");
    rl.close();
    return;
  }

  const socket = io("http://localhost:8080");

  socket.emit("newUser", name);

  socket.on("connect", () => {
    console.log(
      `\nПодключено к серверу как ${name}. Вы можете начать болтать!\n`
    );
  });

  socket.on("message", (messageData) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${messageData.username}: ${messageData.text}`);
  });

  socket.on("error", (error) => {
    console.error(`Ошибка Socket.IO: ${error}`);
  });

  rl.on("line", (input) => {
    if (input.trim()) {
      const timestamp = new Date().toLocaleTimeString();
      const messageData = {
        username: name,
        text: input,
        timestamp: timestamp,
      };
      socket.emit("message", messageData);
    } else {
      console.log("Сообщение не может быть пустым.");
    }
  });
});
