import { NextResponse } from "next/server"; // Using Next.js's response helper for better responses
import { getUserData } from "@/actions/get-user-data";
import { supabaseServerClient } from "@/supabase/supabaseServer";

// Define the POST method handler
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

    const { error: creatingMessageError } = await supabase
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

    return NextResponse.json(
      { message: "Message created successfully" },
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

// Define the method handler for unsupported methods
export async function OPTIONS() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
