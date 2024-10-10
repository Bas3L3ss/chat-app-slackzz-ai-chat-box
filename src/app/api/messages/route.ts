import { getUserData } from "@/actions/get-user-data";
import { getSocket } from "@/lib/socket";
import { supabaseServerClient } from "@/supabase/supabaseServer";
import { NextResponse } from "next/server";

function getPagination(page: number, size: number) {
  const limit = size ? +size : 10;
  const from = page ? page * limit : 0;
  const to = page ? from + limit - 1 : limit - 1;

  return { from, to };
}

export async function GET(req: Request) {
  try {
    const supabase = await supabaseServerClient();
    const userData = await getUserData();
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get("channelId");

    if (!userData) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new Response("Bad Request", { status: 400 });
    }

    const page = Number(searchParams.get("page"));
    const size = Number(searchParams.get("size"));

    const { from, to } = getPagination(page, size);

    const { data, error } = await supabase
      .from("messages")
      .select("*, user: user_id (*)")
      .eq("channel_id", channelId)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("GET MESSAGES ERROR: ", error);
      return new Response("Bad Request", { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.log("SERVER ERROR: ", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    // to check for user credentials, and for messages insertion (1)
    const userData = await getUserData();

    if (!userData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // to check for channel and workspace, and for messages insertion  (2)
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get("channelId");
    const workspaceId = searchParams.get("workspaceId");

    if (!channelId || !workspaceId) {
      return NextResponse.json({ message: "Bad request" }, { status: 400 });
    }

    const { content, fileUrl } = await req.json(); // req.body equivalent for App Router

    if (!content && !fileUrl) {
      return NextResponse.json({ message: "Bad request" }, { status: 400 });
    }

    const supabase = await supabaseServerClient();

    // to ensure that channel exists
    const { data: channelData } = await supabase
      .from("channels")
      .select("*")
      .eq("id", channelId)
      .contains("members", [userData.id]);

    if (!channelData?.length) {
      return NextResponse.json(
        { message: "Channel not found" },
        { status: 403 }
      );
    }

    const { data: messageData, error: creatingMessageError } = await supabase
      .from("messages")
      .insert({
        user_id: userData.id, //(1)
        workspace_id: workspaceId, //(2)
        channel_id: channelId, //(2)
        content,
        file_url: fileUrl,
      })
      .select("*, user: user_id(*)")
      .order("created_at", { ascending: true })
      .single();

    if (creatingMessageError) {
      console.log("MESSAGE CREATION ERROR: ", creatingMessageError);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }

    const io = getSocket();
    if (io) {
      io.emit(`channel:${channelId}:channel-messages`, messageData);
    }

    return NextResponse.json(
      { message: "Message created successfully", data: messageData },
      { status: 200 }
    );
  } catch (error) {
    console.log("ERROR: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
