// /lib/socket.ts
import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";

let io: SocketServer | null = null;

export const initializeSocketServer = (server: HttpServer) => {
  if (!io) {
    io = new SocketServer(server, {
      path: "/api/web-socket/io",
      addTrailingSlash: false,
    });
  }
  return io;
};
