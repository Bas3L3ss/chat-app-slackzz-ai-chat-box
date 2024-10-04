import { getUserData } from "@/actions/get-user-data";
import { redirect } from "next/navigation";

export default async function Home() {
  const userData = await getUserData();

  if (!userData) {
    return redirect("/auth");
  }

  const userWorkSpaceId = userData.workspaces?.[0];

  if (!userWorkSpaceId) {
    redirect("/create-workspace");
  }

  if (userWorkSpaceId) {
    return redirect(`/workspace/${userWorkSpaceId}`);
  }
}
