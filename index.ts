import express, { Application, Request, Response } from "express";
import cors from "cors";
import { createServer, Server } from "node:http";
import { Socket, Server as SocketIOServer } from "socket.io";
import { db } from "./db";
import { config } from "dotenv";
config({ path: "./.env" });

const app: Application = express();
const server: Server = createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors({ origin: "*" }));
app.use(express.json());

io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  socket.on("block:create", async (data) => {
    const { name, username } = data;

    const hash = Math.random().toString(36).substring(2, 15);

    const existingBlock = await db.block.findUnique({
      where: { blockHash: hash },
    });

    if (existingBlock)
      return socket.emit("error", { message: "something went wrong" });

    const isCreated = await db.block.create({
      data: {
        signature: "1",
        blockHash: hash,
        eventName: name,
        creator: {
          connect: { username: username },
        },
      },
    });

    if (!isCreated)
      return socket.emit("error", { message: "something went wrong" });

    socket.join(name);

    socket.emit("block:created", {
      count: io.sockets.adapter.rooms.get(name)?.size || 0,
      id: isCreated.id
    });
  });

  socket.on("block:join", (data) => {
    const { name, username } = data;

    socket.join(name);
    socket
      .to(name)
      .emit("block:user:joined", {
        count: io.sockets.adapter.rooms.get(name)?.size || 0,
        username,
      });
  });

  socket.on("block:transaction", (data) => {
    socket.to(data.name).emit("block:msg", { id: data.name, transaction: data.transaction });
  })

  socket.on("user:join", (data) => {
    socket.join(data.name)
    console.log("join");
    
  })

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
