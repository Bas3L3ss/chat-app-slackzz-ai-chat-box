import InfoSection from "@/components/info-section";
import Sidebar from "@/components/sidebar";
import React from "react";
import { Workspace as userWorkSpaceType } from "@/types/app";
import { getUserData } from "@/actions/get-user-data";
import { redirect } from "next/navigation";
import {
  getCurrentWorkspaceData,
  getUserWorkspaceData,
} from "@/actions/workspaces";
import { getUserWorkspaceChannels } from "@/actions/get-user-workspace-channels";
import ChatHeader from "@/components/chat-header";
import Typography from "@/components/ui/typography";
import TextEditor from "@/components/text-editor";

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
        <div className="h-[calc(100vh-256px)] overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-[6px] [&::-webkit-scrollbar-thumb]:bg-foreground/60 [&::-webkit-scrollbar-track]:bg-none [&::-webkit-scrollbar]:w-2">
          <Sidebar
            currentWorkspaceData={currentWorkspaceData}
            userData={userData}
            userWorkspacesData={userWorkspaceData as userWorkSpaceType[]}
          />
          <InfoSection
            userWorkspaceChannels={userWorkspaceChannels}
            currentWorkspaceData={currentWorkspaceData}
            currentChannelId={currentChannelData.id}
            userData={userData}
          />
          <div className="p-4 relative w-full overflow-hidden">
            <ChatHeader title={currentChannelData.name} />
            <div className="mt-10">
              <Typography text={"hi"} variant="h4" />
            </div>
          </div>
        </div>
        <div className="m-4">
          <TextEditor channel={currentChannelData} />
        </div>
      </div>
    </>
  );
};

export default ChannelPage;
