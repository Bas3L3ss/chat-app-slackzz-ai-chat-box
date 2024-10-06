import { NextApiRequest, NextApiResponse } from "next";

import { getUserDataPages } from "@/actions/get-user-data";
import supabaseServerClientPages from "@/supabase/supabaseServerPages";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return res.status(200).json({ message: "hi" });
  }
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    // to check for user credentials, and for messages insertion (1)
    const userData = await getUserDataPages(req, res);

    if (!userData) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // to check for channel and workspace, and for messages insertion  (2)
    const { channelId, workspaceId } = req.query;

    if (!channelId || !workspaceId) {
      return res.status(400).json({ message: "Bad request" });
    }

    const { content, fileUrl } = req.body;

    if (!content && !fileUrl) {
      return res.status(400).json({ message: "Bad request" });
    }

    const supabase = supabaseServerClientPages(req, res);

    // to ensure that channel exists
    const { data: channelData } = await supabase
      .from("channels")
      .select("*")
      .eq("id", channelId)
      .contains("members", [userData.id]);

    if (!channelData?.length) {
      return res.status(403).json({ message: "Channel not found" });
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
      .select("*, user: user_id(*)") //select and order are for if you want to retrieve data {error, data}
      .order("created_at", { ascending: true })
      .single(); // to ensure only insert one record not an array (which is usually weird to work with).

    if (creatingMessageError) {
      console.log("MESSAEGE CREATION ERROR: ", creatingMessageError);
      return res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
