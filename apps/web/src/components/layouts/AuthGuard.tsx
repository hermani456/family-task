import { Navigate, Outlet, useLocation } from "react-router";
import { authClient } from "../../lib/auth-client";
import { useMyFamily } from "../../hooks/useMyFamily";
import { Loader2 } from "lucide-react";

export const AuthGuard = () => {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const { data: familyData, isLoading: isFamilyPending } = useMyFamily();
  console.log(familyData)
  const location = useLocation();

  // 1. Loading state: while we don't know the user yet, show a spinner
  // This prevents a flicker where the app would briefly redirect to login
  // and then bounce back once the session is resolved.
  if (isSessionPending || (session && isFamilyPending)) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          Cargando tu hogar...
        </p>
      </div>
    );
  }

  // 2. Not authenticated -> redirect to login
  // `state={{ from: location }}` allows returning the user to their
  // original destination after a successful login.
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authenticated but no family -> redirect to onboarding
  // Check whether `familyData.family` exists.
  const hasFamily = !!familyData?.family;

  // If there's no family, send the user to onboarding so they can
  // create or join a family.
  if (!hasFamily) {
    return <Navigate to="/onboarding" replace />;
  }

  // 4. All good -> render the child route (e.g. Dashboard)
  return <Outlet />;
};
