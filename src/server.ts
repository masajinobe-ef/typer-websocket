import express from "express";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

interface CustomSocket extends Socket {
  username?: string;
}

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

let connectedUsers: CustomSocket[] = [];
let userCount = 0;

io.on("connection", (socket: CustomSocket) => {
  console.log("Новый клиент подключен");

  socket.on("newUser", (username: string) => {
    socket.username = username;
    connectedUsers.push(socket);
    userCount++;
    io.emit("userCount", userCount);
    io.emit(
      "userList",
      connectedUsers.map((user) => user.username)
    );
  });

  socket.on("message", (messageData) => {
    socket.broadcast.emit("message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("Клиент отключен");
    userCount--;
    connectedUsers = connectedUsers.filter((user) => user !== socket);
    io.emit("userCount", userCount);
    io.emit(
      "userList",
      connectedUsers.map((user) => user.username)
    );
  });

  socket.on("error", (error) => {
    console.error(`Ошибка Socket.IO: ${error}`);
  });
});

app.use(express.static("public"));

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`HTTP-сервер работает на http://localhost:${PORT}`);
});

const shutdown = () => {
  console.log("Сервер отключается...");

  io.emit(
    "serverShutdown",
    "Сервер будет отключен. Пожалуйста, завершите свои действия."
  );

  connectedUsers.forEach((userSocket) => {
    userSocket.disconnect(true);
  });

  setTimeout(() => {
    console.log("Сервер отключен.");
    process.exit(0);
  }, 5000);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
