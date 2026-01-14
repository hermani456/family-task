import { NavLink } from "react-router";
import { Home, CheckSquare, Gift, Store } from "lucide-react";
import { authClient } from "../../lib/auth-client"; // Tu cliente auth
import type { UserRole } from "@family-task/shared"; // Asumo que tienes esto

export const BottomNav = () => {
  const { data: session } = authClient.useSession();
  
  // Si no hay sesión o member, no renderizamos nada (o un skeleton)
  if (!session?.user) return null;

  // Supongamos que obtenemos el rol del contexto o sesión
  // Por ahora lo hardcodeamos para probar, pero esto debe venir de useMyFamily()
  const role: UserRole = "PARENT"; // o "CHILD"

  // Configuración de rutas según rol
  const parentLinks = [
    { to: "/", icon: Home, label: "Inicio" },
    { to: "/tasks", icon: CheckSquare, label: "Tareas" },
    { to: "/rewards", icon: Gift, label: "Premios" },
  ];

  const childLinks = [
    { to: "/", icon: CheckSquare, label: "Mis Tareas" }, // Hijo suele ver tareas al inicio
    { to: "/shop", icon: Store, label: "Tienda" },
  ];

  const links = role === "PARENT" ? parentLinks : childLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border pb-safe">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-gray-600 dark:hover:text-gray-300"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon
                  className={`w-6 h-6 transition-transform ${
                    isActive ? "scale-110" : "scale-100"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-[10px] font-bold">{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};