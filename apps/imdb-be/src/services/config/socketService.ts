import * as express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

export const socket = () => {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    socket.join("comment-room")
    socket.on("comment-added", () => {
      socket.to("comment-room").emit("comment-added")
    })

    socket.join("like-room")
    socket.on("movie-liked", () => {
      socket.to('like-room').emit("movie-liked")
    })
  });

  httpServer.listen(5001);
}
