import express, { Application, Request, Response } from "express";
import cors from "cors";
import { createServer, Server } from "node:http";
import { Socket, Server as SocketIOServer } from "socket.io";
import { db } from "./db";
import { config } from "dotenv";
import { Block, Message } from "./utils";
config({ path: "./.env" });

const app: Application = express();
const server: Server = createServer(app);

let lock = false;
let increment: number = 1;

const isAdded = new Map();
let messages: Message[] = [];

const isRemoved = new Map();
const blocks: Block[] = [];
const pendingBlocks: Map<string, Block> = new Map();
const inValidBlocks = new Map();

const public_keys: string[] = [];

const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors({ origin: "*" }));
app.use(express.json());

io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  socket.on("block_init", (data) => {
    pendingBlocks.set(socket.id, {
      eventName: data.eventName,
      _messages: [],
      public_key: [data.public_key],
      signature: data.signature,
      isFinalized: false
    });
  });

  socket.on("add_message", (data) => {
    const block = pendingBlocks.get(socket.id)

    if(!block) {
      socket.emit("error", { message: "Block not initialized" });
      return;
    }

    if(isAdded.has(data.id)) {
      socket.emit("error", { message: "Message already added" });
      return;
    }

    isAdded.set(data.id, true);
    block._messages.push(data);
  });

  socket.on("disconnect", () => {
    pendingBlocks.delete(socket.id)
    console.log("A user disconnected");
  });
});

app.post("/public_keys", (req: Request, res: Response) => {
  const { key } = req.body;
  if (!key) {
    res.status(401).json({ message: "something went wrong" });
    return;
  }
  public_keys.push(key);
  io.emit("public_keys", public_keys);
  res.status(201).json({ message: "ok" });
  return;
});

app.post("/messages", (req: Request, res: Response) => {
  const { text, signature } = req.body;
  if (!text || !signature) {
    res.status(401).json({ message: "something went wrong" });
    return;
  }

  messages.push({ id: increment++, text, signature, status: "available" });
  io.emit("messages", messages);
  res.status(201).json({ message: "ok" });
  return;
});

app.post("/blocks", (req: Request, res: Response) => {
  const {id} = req.body;
  const block = pendingBlocks.get(id);
  if (!block) {
    res.status(404).json({ message: "Block not found" });
    return;
  }

  block.isFinalized = true;
  blocks.push(block);
  pendingBlocks.delete(id)

  res.status(201).json({ message: "ok" });
  return; 
})

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
