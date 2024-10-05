import { getUserData } from "@/actions/get-user-data";
import {
  getCurrentWorkspaceData,
  getUserWorkspaceData,
} from "@/actions/workspaces";
import InfoSection from "@/components/info-section";
import Sidebar from "@/components/sidebar";
import Typography from "@/components/ui/typography";
import { Workspace as userWorkSpaceType } from "@/types/app";
import { redirect } from "next/navigation";

async function Workspace({ params: { id } }: { params: { id: string } }) {
  const userData = await getUserData();

  if (!userData) {
    return redirect("/auth");
  }

  const [userWorkspaceData, userWorkspaceError] = await getUserWorkspaceData(
    userData.workspaces!
  );

  const [currentWorkspaceData, currentWorkspaceError] =
    await getCurrentWorkspaceData(id);

  return (
    <>
      <div className="hidden md:block">
        <Sidebar
          currentWorkspaceData={currentWorkspaceData}
          userData={userData}
          userWorkspacesData={userWorkspaceData as userWorkSpaceType[]}
        />
        <InfoSection />
        WorkSpace
        <Typography text="Hiiii" variant="h1" />
        <Typography text="Hiiii" variant="h2" />
        <Typography text="Hiiii" variant="h3" />
        <Typography text="Hiiii" variant="h4" />
        <Typography text="Hiiii" variant="h5" />
        <Typography text="Hiiii" variant="h6" />
        <Typography text="Hiiii" variant="p" />
      </div>
      <div className="md:hidden block min-h-screen">Mobile</div>
    </>
  );
}

export default Workspace;
