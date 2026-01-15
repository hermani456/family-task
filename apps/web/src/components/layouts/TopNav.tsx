import { Moon, Sun } from "lucide-react";
import { authClient } from "../../lib/auth-client";
import { UserAvatar } from "../../components/UserAvatar";
import { useTheme } from "../../context/theme-context";

export const TopNav = () => {
  const { theme, setTheme } = useTheme();
  const { data: session } = authClient.useSession();

  if (!session) return null;

  return (
    <header className="sticky top-0 z-40 w-full py-10 border-b border-border bg-background/80 backdrop-blur-md px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <UserAvatar
          name={session.user.name}
          className="size-14 border border-border"
        />
        <div className="leading-tight">
          <p className="text-2xl font-black tracking-tight leading-tight text-foreground">
            Hola, {session.user?.name?.split(" ")[0]}
          </p>
          <p className="text-muted-foreground font-medium text-sm">Admin</p>
        </div>
      </div>

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors active:scale-95"
      >
        <span className="sr-only">Cambiar tema</span>
        {theme === "dark" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </header>
  );
};
