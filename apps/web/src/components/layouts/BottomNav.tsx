import { NavLink } from "react-router";
import { Home, CheckSquare, Gift, ShoppingBag } from "lucide-react";
import { authClient } from "../../lib/auth-client";
import { useMyFamily } from "../../hooks/useMyFamily";

export const BottomNav = () => {
  const { data: session } = authClient.useSession();
  const { data: familyData } = useMyFamily();

  if (!session?.user) return null;

  const role = familyData?.member?.role || "CHILD";

  // 1. Enlaces para PADRES
  const parentLinks = [
    { to: "/", icon: Home, label: "Inicio" },
    { to: "/tasks", icon: CheckSquare, label: "Tareas" },
    { to: "/rewards", icon: Gift, label: "Premios" },
  ];

  // 2. Enlaces para HIJOS
  const childLinks = [
    { to: "/", icon: Home, label: "Mi Progreso" },
    { to: "/shop", icon: ShoppingBag, label: "Tienda" },
  ];

  const links = role === "PARENT" ? parentLinks : childLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors active:scale-90 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon
                  className={`size-6 transition-transform duration-300 ${
                    isActive ? "-translate-y-1" : ""
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`text-[10px] font-bold transition-opacity ${
                    isActive ? "opacity-100" : "opacity-80"
                  }`}
                >
                  {link.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
