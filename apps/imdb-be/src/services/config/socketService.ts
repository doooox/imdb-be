import { Server } from "socket.io";

export const socket = (httpServer) => {

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
  const port = Number(process.env.NX_PORT) + 1;

  httpServer.listen(port);
}
