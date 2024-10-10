import React from "react";
import { getUserData } from "@/actions/get-user-data";
import { redirect } from "next/navigation";
import {
  getCurrentWorkspaceData,
  getUserWorkspaceData,
} from "@/actions/workspaces";
import { getUserWorkspaceChannels } from "@/actions/get-user-workspace-channels";

import ChatGroup from "@/components/chat-group";
import { Workspace } from "@/types/app";

const ChannelPage = async ({
  params: { channelId, id },
}: {
  params: {
    id: string;
    channelId: string;
  };
}) => {
  const userData = await getUserData();

  if (!userData) return redirect("/auth");

  const [userWorkspaceData] = await getUserWorkspaceData(userData.workspaces!);

  const [currentWorkspaceData] = await getCurrentWorkspaceData(id);

  const userWorkspaceChannels = await getUserWorkspaceChannels(
    currentWorkspaceData.id,
    userData.id
  );

  const currentChannelData = userWorkspaceChannels.find(
    (channel) => channel.id === channelId
  );

  if (!currentChannelData) return redirect("/");

  return (
    <>
      <div className="hidden md:block">
        <ChatGroup
          type="Channel"
          userData={userData}
          currentChannelData={currentChannelData}
          currentWorkspaceData={currentWorkspaceData}
          userWorkspaceChannels={userWorkspaceChannels}
          userWorkspaceData={userWorkspaceData as Workspace[]}
          slug={id}
          socketQuery={{
            channelId: currentChannelData.id,
            workspaceId: currentWorkspaceData.id,
          }}
          chatId={channelId}
          socketUrl="/api/web-socket/messages"
          headerTitle={currentChannelData.name}
          paramKey="channelId"
          paramValue={channelId}
          apiUrl="/api/messages"
        />
      </div>
    </>
  );
};

export default ChannelPage;
