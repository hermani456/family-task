import AuthLayout from "../../components/layouts/AuthLayout";
import { Mail, Lock } from "lucide-react";

export const LoginPage = () => {
  return (
    <AuthLayout mode="login">
      <form className="space-y-5">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-sm font-bold text-muted-foreground tracking-tight"
          >
            Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              id="email"
              placeholder="ejemplo@familia.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground font-medium 
                         placeholder:text-muted-foreground/50
                         focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
                         transition-all duration-200 shadow-sm"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-sm font-bold text-muted-foreground tracking-tight"
          >
            Contraseña
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type="password"
              id="password"
              placeholder="••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground font-medium 
                         placeholder:text-muted-foreground/50
                         focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
                         transition-all duration-200 shadow-sm"
            />
          </div>

          <div className="text-right">
            <a
              href="#"
              className="text-xs font-bold text-primary hover:text-primary/80 hover:underline transition-all"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>
        <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:bg-primary/90 active:translate-y-0 transition-all duration-200">
          Ingresar
        </button>
        <div className="pt-2">
          <div className="relative flex py-2 items-center">
            <div className="grow border-t border-border"></div>
            <span className="shrink px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              O continúa con
            </span>
            <div className="grow border-t border-border"></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <SocialButton
              icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              label="Google"
            />
            <SocialButton
              icon="https://raw.githubusercontent.com/devicons/devicon/refs/tags/v2.17.0/icons/apple/apple-original.svg"
              label="Apple"
              isDarkIcon
            />
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

interface SocialButtonProps {
  icon: string;
  label: string;
  isDarkIcon?: boolean;
}

const SocialButton = ({ icon, label, isDarkIcon }: SocialButtonProps) => (
  <button
    type="button"
    className="flex items-center justify-center gap-3 border border-border bg-surface rounded-xl py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm group"
  >
    <img
      src={icon}
      alt={label}
      className={`w-5 h-5 ${isDarkIcon ? "dark:invert" : ""}`}
    />
    <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">
      {label}
    </span>
  </button>
);
