import { Navigate, Outlet } from "react-router";
import { authClient } from "../../lib/auth-client";
import { useMyFamily } from "../../hooks/useMyFamily";
import { Loader2 } from "lucide-react";

export const PublicGuard = () => {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const {
    data: familyData,
    isLoading: isFamilyLoading,
    isFetching,
    isError,
  } = useMyFamily();

  const isWaitingForFamily =
    session && (isFamilyLoading || isFetching || (!familyData && !isError));

  if (isSessionPending || isWaitingForFamily) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (session) {
    // Solo redirigimos cuando estamos SEGUROS de que tiene familia
    if (familyData?.family) {
      return <Navigate to="/" replace />;
    }
    // Si tiene sesión pero no familia, al onboarding
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};
