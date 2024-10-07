import { NextRequest } from "next/server";
import { initializeSocketServer } from "@/lib/socket";
import { Server as HttpServer } from "http";

export async function GET(req: NextRequest) {
  const httpServer = process.stdin as unknown as HttpServer;

  try {
    initializeSocketServer(httpServer);
    return new Response("Socket server initialized", { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
