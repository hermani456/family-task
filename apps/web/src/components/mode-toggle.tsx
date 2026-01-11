import { useEffect, useRef, useState } from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useTheme } from "../context/theme-context";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cierra el menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (mode: "light" | "dark" | "system") => {
    setTheme(mode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {/* Animación de Sol a Luna usando clases de Tailwind y Lucide */}
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-500" />
        <span className="sr-only"> Cambiar tema </span>
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 origin-top-right rounded-lg border border-border bg-surface shadow-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100 z-50">
          <div className="p-1 flex flex-col gap-0.5">
            <MenuItem
              onClick={() => handleSelect("light")}
              active={theme === "light"}
              icon={<Sun className="h-4 w-4 mr-2" />}
              label="Claro"
            />

            <MenuItem
              onClick={() => handleSelect("dark")}
              active={theme === "dark"}
              icon={<Moon className="h-4 w-4 mr-2" />}
              label="Oscuro"
            />

            <MenuItem
              onClick={() => handleSelect("system")}
              active={theme === "system"}
              icon={<Monitor className="h-4 w-4 mr-2" />}
              label="Sistema"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponente simple para limpiar el render
function MenuItem({
  onClick,
  active,
  icon,
  label,
}: {
  onClick: () => void;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex w-full cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors 
        ${
          active
            ? "bg-primary/10 text-primary font-medium"
            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        }
      `}
    >
      {icon}
      <span> {label} </span>
      {active && <Check className="ml-auto h-3 w-3" />}
    </button>
  );
}
