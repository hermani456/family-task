import { LogOut, Moon, Sun } from "lucide-react";
import { authClient } from "../../lib/auth-client";
import { UserAvatar } from "../../components/UserAvatar";
import { useTheme } from "../../context/theme-context";
import { signOut } from "../../lib/auth-client";
import { useNavigate } from "react-router";
import { useMyFamily } from "../../hooks/useMyFamily";

export const TopNav = () => {
  const { data: familyData } = useMyFamily();
  const { theme, setTheme } = useTheme();
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();

  const roleLabel = familyData?.member?.role === "CHILD" ? "Hijo/a" : "Admin";

  if (!session) return null;

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md px-4 py-4 flex items-center justify-between">
      {/* IZQUIERDA: Perfil */}
      <div className="flex items-center gap-3">
        <UserAvatar
          name={session.user.name}
          className="size-12 border border-border shadow-sm"
        />
        <div className="leading-tight">
          <p className="text-xl font-black tracking-tight text-foreground">
            Hola, {session.user?.name?.split(" ")[0]}
          </p>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-wider">
            {roleLabel}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* 1. TEMA  */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 rounded-full text-muted-foreground hover:bg-surface hover:text-foreground transition-all active:scale-95 border border-transparent hover:border-border"
          title="Cambiar tema"
        >
          <span className="sr-only">Cambiar tema</span>
          {theme === "dark" ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
        </button>

        <div className="h-6 w-px bg-border/60 mx-1" />

        {/* 2. LOGOUT  */}
        <button
          onClick={handleLogout}
          className="p-2.5 rounded-full text-muted-foreground hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-all active:scale-95 group"
          title="Cerrar Sesión"
        >
          <LogOut className="size-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>
    </header>
  );
};
