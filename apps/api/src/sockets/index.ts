import type { Server as HttpServer } from "http";
import { Server, type Socket } from "socket.io";
import { env } from "../config/env";
import { ChatMessage } from "../models";
import { isDbConnected } from "../config/db";
import { verifyToken } from "../utils/jwt";
import type { AuthPrincipal, ChatSender } from "../types";

interface JoinPayload {
  roomId: string;
  user?: { id?: string; name?: string; role?: string };
}
interface ChatSendPayload {
  roomId: string;
  text: string;
}
interface PresenceMovePayload {
  roomId: string;
  position: [number, number, number];
  rotationY: number;
}

interface Peer {
  id: string;
  name: string;
  role: string;
  position: [number, number, number];
  rotationY: number;
}

const rooms = new Map<string, Map<string, Peer>>();

function getRoom(roomId: string): Map<string, Peer> {
  let room = rooms.get(roomId);
  if (!room) {
    room = new Map();
    rooms.set(roomId, room);
  }
  return room;
}

function presenceList(roomId: string): Peer[] {
  return [...getRoom(roomId).values()];
}

export function initSockets(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientOrigin,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (token) {
      try {
        socket.data.principal = verifyToken(String(token));
      } catch {
        socket.data.principal = undefined;
      }
    }
    next();
  });

  io.on("connection", (socket: Socket) => {
    const joinedRooms = new Set<string>();
    let identity: ChatSender = { name: "Guest", role: "user" };

    socket.on("room:join", async (payload: JoinPayload) => {
      if (!payload?.roomId) return;
      const { roomId, user } = payload;

      const principal = socket.data.principal as AuthPrincipal | undefined;
      identity = principal
        ? { id: principal.id, name: principal.name || "Guest", role: principal.role }
        : { name: user?.name || "Guest", role: "user" };

      socket.join(roomId);
      joinedRooms.add(roomId);

      getRoom(roomId).set(socket.id, {
        id: socket.id,
        name: identity.name,
        role: identity.role,
        position: [0, 0, 0],
        rotationY: 0,
      });
      io.to(roomId).emit("presence:state", { peers: presenceList(roomId) });

      let messages: unknown[] = [];
      if (isDbConnected()) {
        try {
          const history = await ChatMessage.find({ roomId })
            .sort({ createdAt: -1 })
            .limit(50)
            .exec();
          messages = history.reverse();
        } catch {
          messages = [];
        }
      }
      socket.emit("chat:history", { messages });
    });

    socket.on("chat:send", async (payload: ChatSendPayload) => {
      if (!payload?.roomId || !payload.text?.trim()) return;
      const { roomId, text } = payload;
      if (!joinedRooms.has(roomId)) return;

      const base = {
        roomId,
        sender: identity,
        text: text.trim().slice(0, 2000),
        createdAt: new Date(),
      };

      let message: unknown = base;
      if (isDbConnected()) {
        try {
          message = (await ChatMessage.create(base)).toJSON();
        } catch {
          message = base;
        }
      }

      io.to(roomId).emit("chat:new", { message });
    });

    socket.on("presence:move", (payload: PresenceMovePayload) => {
      if (!payload?.roomId) return;
      const { roomId, position, rotationY } = payload;
      const peer = getRoom(roomId).get(socket.id);
      if (!peer) return;
      peer.position = position ?? peer.position;
      peer.rotationY = typeof rotationY === "number" ? rotationY : peer.rotationY;
      io.to(roomId).emit("presence:state", { peers: presenceList(roomId) });
    });

    socket.on("disconnect", () => {
      for (const roomId of joinedRooms) {
        const room = rooms.get(roomId);
        if (room?.delete(socket.id)) {
          socket.to(roomId).emit("presence:leave", { id: socket.id });
          io.to(roomId).emit("presence:state", { peers: presenceList(roomId) });
          if (room.size === 0) rooms.delete(roomId);
        }
      }
    });
  });

  return io;
}
