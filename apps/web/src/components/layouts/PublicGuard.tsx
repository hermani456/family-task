import { Navigate, Outlet } from "react-router";
import { authClient } from "../../lib/auth-client";
import { useMyFamily } from "../../hooks/useMyFamily";
import { Loader2 } from "lucide-react";

export const PublicGuard = () => {
  const { data: session, isPending } = authClient.useSession();
  const { data: familyData, isLoading: isFamilyLoading } = useMyFamily();

  // While the session or family data is being resolved, don't render child routes
  // (prevents flashing public pages before redirect)
  if (isPending || typeof session === "undefined" || (session && isFamilyLoading)) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // If the user is already authenticated...
  if (session) {
    // ...and has a family, redirect them to the Dashboard
    if (familyData?.family) {
      return <Navigate to="/" replace />;
    }
    // ...and doesn't have a family, send them to onboarding instead.
    // This prevents a logged-in user without a family from accessing
    // the login/register pages.
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};
