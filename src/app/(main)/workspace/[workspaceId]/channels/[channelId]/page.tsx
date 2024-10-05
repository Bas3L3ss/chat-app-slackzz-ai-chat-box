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

const ChannelPage = async ({
  params: { channelId, workspaceId },
}: {
  params: {
    workspaceId: string;
    channelId: string;
  };
}) => {
  const userData = await getUserData();

  if (!userData) return redirect("/auth");

  const [userWorkspaceData] = await getUserWorkspaceData(userData.workspaces!);

  const [currentWorkspaceData] = await getCurrentWorkspaceData(workspaceId);

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
      </div>
    </>
  );
};

export default ChannelPage;
