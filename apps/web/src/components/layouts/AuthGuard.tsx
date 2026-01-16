import { Navigate, Outlet, useLocation } from "react-router"; // react-router-dom
import { authClient } from "../../lib/auth-client";
import { useMyFamily } from "../../hooks/useMyFamily";
import { Loader2 } from "lucide-react";

export const AuthGuard = () => {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const { data: familyData, isLoading } = useMyFamily();

  const location = useLocation();

  const showSpinner =
    isSessionPending ||
    (session && isLoading);

  if (showSpinner) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          Cargando tu hogar...
        </p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasFamily = !!familyData?.family;

  if (!hasFamily) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};
