import { useMyFamily } from "../hooks/useMyFamily";
import { ParentHome } from "../features/dashboard/ParentHome";
import { ChildHome } from "../features/dashboard/ChildHome";
import { Loader2 } from "lucide-react";

export const HomePage = () => {
  const { data, isLoading } = useMyFamily();

  if (isLoading || !data?.member) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (data.member.role === "PARENT") {
    return <ParentHome />;
  }

  return <ChildHome />;
};
