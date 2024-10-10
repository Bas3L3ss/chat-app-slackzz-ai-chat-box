"use client";

import ChatHeader from "@/components/chat-header";
import TextEditor from "@/components/text-editor";

import InfoSection from "@/components/info-section";
import Sidebar from "@/components/sidebar";
import { Channel, User, Workspace as userWorkSpaceType } from "@/types/app";
import { FC } from "react";
import ChatMessages from "./chat-messages";

type ChatGroupProps = {
  type: "Channel" | "DirectMessage";
  socketUrl: string;
  apiUrl: string;
  headerTitle: string;
  chatId: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "recipientId";
  paramValue: string;
  userData: User;
  currentWorkspaceData: userWorkSpaceType;
  currentChannelData: Channel | undefined;
  userWorkspaceData: userWorkSpaceType[];
  userWorkspaceChannels: Channel[];
  slug: string;
};

const ChatGroup: FC<ChatGroupProps> = ({
  apiUrl,
  chatId,
  currentChannelData,
  currentWorkspaceData,
  headerTitle,
  paramKey,
  paramValue,
  slug,
  socketQuery,
  socketUrl,
  type,
  userData,
  userWorkspaceChannels,
  userWorkspaceData,
}) => {
  return (
    <>
      <div className="h-[calc(100vh-256px)] overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-[6px] [&::-webkit-scrollbar-thumb]:bg-foreground/60 [&::-webkit-scrollbar-track]:bg-none [&::-webkit-scrollbar]:w-2">
        <Sidebar
          currentWorkspaceData={currentWorkspaceData}
          userData={userData}
          userWorkspacesData={userWorkspaceData as userWorkSpaceType[]}
        />
        <InfoSection
          currentWorkspaceData={currentWorkspaceData}
          userData={userData}
          userWorkspaceChannels={userWorkspaceChannels}
          currentChannelId={
            type === "Channel" ? currentChannelData?.id : undefined
          }
        />
        <div className="p-4 relative w-full overflow-hidden">
          <ChatHeader title={headerTitle} chatId={chatId} userData={userData} />
          <div className="mt-10">
            <ChatMessages
              apiUrl={apiUrl}
              chatId={chatId}
              name={currentChannelData?.name ?? "USERNAME"}
              paramKey={paramKey}
              paramValue={paramValue}
              socketQuery={socketQuery}
              socketUrl={socketUrl}
              type={type}
              userData={userData}
              workspaceData={currentWorkspaceData}
              channelData={currentChannelData}
            />
          </div>
        </div>
      </div>
      <div className="m-4">
        <TextEditor
          userData={userData}
          workspaceData={currentWorkspaceData}
          apiUrl={apiUrl}
          channel={currentChannelData}
          recipientId={type === "DirectMessage" ? chatId : undefined}
          type={type}
        />
      </div>
    </>
  );
};

export default ChatGroup;
