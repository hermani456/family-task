import { authClient } from "../../lib/auth-client";
import { ParentRewards } from "./ParentRewards";
import { ChildRewards } from "./ChildRewards";
import { useMembers } from "../../hooks/useMembers";

export const RewardsPage = () => {
  const { data: session } = authClient.useSession();
  const { data: members } = useMembers();
  const userRole = members?.find((m) => m.userId === session?.user.id)?.role;

  if (!userRole) return <div>Cargando...</div>;

  return userRole === "PARENT" ? <ParentRewards /> : <ChildRewards />;
};
