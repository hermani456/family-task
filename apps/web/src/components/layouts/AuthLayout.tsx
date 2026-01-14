import { HousePlus } from "lucide-react";
import { ViewTransition } from "react";
import VTLink from "../Transition";

interface AuthLayoutProps {
  children: React.ReactNode;
  mode: "login" | "register";
}

const AuthLayout = ({ children, mode }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-12 md:pt-24 p-4">
      <div className="flex flex-col items-center mb-6 animate-in fade-in zoom-in duration-500">
        <div className="size-16 bg-primary rounded-2xl rotate-3 shadow-xl shadow-primary/30 mb-4 flex items-center justify-center">
          <HousePlus className="text-primary-foreground w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-foreground">
          Family<span className="text-primary">Task</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-1">
          Organiza tu hogar, diviértete en familia.
        </p>
      </div>

      <div className="w-full max-w-87.5">
        <div className="bg-surface border border-border rounded-full p-1.5 flex mb-6 shadow-sm">
          <VTLink
            to="/login"
            className={`flex-1 text-center py-2 text-sm font-bold rounded-full transition-all duration-200 ${
              mode === "login"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Ingresar
          </VTLink>
          <VTLink
            to="/register"
            className={`flex-1 text-center py-2 text-sm font-bold rounded-full transition-all duration-200 ${
              mode === "register"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Registrarse
          </VTLink>
        </div>

        <div className="bg-surface border border-border rounded-3xl p-6 shadow-xl shadow-black/5">
          <ViewTransition name="auth-form">{children}</ViewTransition>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
