import { NextResponse } from "next/server"; // Use Next.js's response helper
import { getUserData } from "@/actions/get-user-data"; // Adjust this to App Router-compatible user data function
import { supabaseServerClient } from "@/supabase/supabaseServer";
import { SupabaseClient } from "@supabase/supabase-js";
import { getSocket } from "@/lib/socket";

// Server Action handler for PATCH and DELETE requests
export async function PATCH(
  req: Request,
  { params: { messagesId } }: { params: { messagesId: string } }
) {
  return handleRequest(req, "PATCH", messagesId);
}

export async function DELETE(
  req: Request,
  { params: { messagesId } }: { params: { messagesId: string } }
) {
  return handleRequest(req, "DELETE", messagesId);
}

// Common logic to handle both PATCH and DELETE requests
async function handleRequest(
  req: Request,
  method: "PATCH" | "DELETE",
  id: string
) {
  try {
    const userData = await getUserData();

    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract query params (messageId, channelId, workspaceId)
    const { searchParams } = new URL(req.url);

    const messageId = id;
    console.log(id);

    const channelId = searchParams.get("channelId");
    const workspaceId = searchParams.get("workspaceId");

    if (!messageId || !channelId || !workspaceId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Parse request body
    const { content } = method === "PATCH" ? await req.json() : {};

    const supabase = await supabaseServerClient();

    // Retrieve the message to be updated/deleted
    const { data: messageData, error } = await supabase
      .from("messages")
      .select("*, user: user_id (*)")
      .eq("id", messageId)
      .single();

    if (error || !messageData) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Check if user has permissions to edit/delete the message
    const isMessageOwner = messageData.user_id === userData.id;
    const canEditMessage = isMessageOwner || !messageData.is_deleted;
    // const isAdmin = userData.type === "admin";
    // const isRegulator = userData.type === "regulator";

    if (!canEditMessage) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (method === "PATCH") {
      if (!isMessageOwner) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      // Update the message content
      await updateMessageContent(supabase, messageId, content);
    } else if (method === "DELETE") {
      // Mark the message as deleted
      await deleteMessage(supabase, messageId);
    }

    // Retrieve updated message
    const { data: updatedMessage, error: messageError } = await supabase
      .from("messages")
      .select("*, user: user_id (*)")
      .order("created_at", { ascending: true })
      .eq("id", messageId)
      .single();

    if (messageError || !updatedMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Emit updated message to the channel via WebSocket
    const io = getSocket();
    io?.emit(`channel:${channelId}:channel-messages:update`, updatedMessage);

    return NextResponse.json({ message: updatedMessage }, { status: 200 });
  } catch (error) {
    console.log("MESSAGE ID ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Function to update message content
async function updateMessageContent(
  supabase: SupabaseClient,
  messageId: string,
  content: string
) {
  await supabase
    .from("messages")
    .update({
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", messageId)
    .select("*, user: user_id (*)")
    .single();
}

// Function to mark a message as deleted
async function deleteMessage(supabase: SupabaseClient, messageId: string) {
  await supabase
    .from("messages")
    .update({
      content: "This message has been deleted",
      file_url: null,
      is_deleted: true,
    })
    .eq("id", messageId)
    .select("*, user: user_id (*)")
    .single();
}
