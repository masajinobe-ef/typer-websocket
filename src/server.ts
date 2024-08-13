import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Подключение к WebSocket
wss.on("connection", (ws: WebSocket) => {
  console.log("Новый клиент подключен");

  ws.on("message", (message: string) => {
    console.log(`Received: ${message}`);
    // транслировать сообщение всем подключенным клиентам, кроме отправителя
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("Клиент отключен");
  });

  ws.on("error", (error) => {
    console.error(`Ошибка WebSocket: ${error}`);
  });
});

// Обслуживать статические файлы (например, HTML, CSS, JS)
app.use(express.static("public"));

// Запустить HTTP-сервер
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`HTTP -сервер работает на http://localhost:${PORT}`);
});
