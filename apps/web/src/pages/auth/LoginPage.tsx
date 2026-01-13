import AuthLayout from "../../components/layouts/AuthLayout";
import { Mail, Lock, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginSchema } from "../../lib/auth-schema";
import { signIn } from "../../lib/auth-client";
import { toast } from "sonner";
import { SocialButton } from "../../components/ui/social-button";

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    const { data: session, error } = await signIn.email({
      email: data.email,
      password: data.password,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Bienvenido de nuevo ${session?.user?.name || "usuario"}`);
  };

  return (
    <AuthLayout mode="login">
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-sm font-bold text-muted-foreground tracking-tight"
          >
            Email
          </label>
          <div className="relative group">
            <div
              className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors 
                ${
                  errors.email
                    ? "text-danger"
                    : "text-muted-foreground group-focus-within:text-primary"
                }`}
            >
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              id="email"
              placeholder="ejemplo@familia.com"
              {...register("email")}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-background text-foreground font-medium 
                         placeholder:text-muted-foreground/50 transition-all duration-200 shadow-sm outline-none
                         ${
                           errors.email
                             ? "border-danger focus:ring-2 focus:ring-danger/20"
                             : "border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
                         }`}
            />
          </div>
          {errors.email && (
            <div className="mt-1 text-xs text-danger font-medium ml-1">
              {errors.email.message}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-sm font-bold text-muted-foreground tracking-tight"
          >
            Contraseña
          </label>
          <div className="relative group">
            <div
              className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors 
                ${
                  errors.password
                    ? "text-danger"
                    : "text-muted-foreground group-focus-within:text-primary"
                }`}
            >
              <Lock className="w-5 h-5" />
            </div>
            <input
              type="password"
              id="password"
              placeholder="••••••"
              {...register("password")}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-background text-foreground font-medium 
                         placeholder:text-muted-foreground/50 transition-all duration-200 shadow-sm outline-none
                         ${
                           errors.password
                             ? "border-danger focus:ring-2 focus:ring-danger/20"
                             : "border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
                         }`}
            />
          </div>
          {errors.password && (
            <div className="mt-1 text-xs text-danger font-medium ml-1">
              {errors.password.message}
            </div>
          )}

          <div className="text-right">
            <a
              href="#"
              className="text-xs font-bold text-primary hover:text-primary/80 hover:underline transition-all"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-lg shadow-primary/20 
                     hover:shadow-primary/40 hover:bg-primary/90 active:translate-y-0 transition-all duration-200
                     disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Ingresando...
            </>
          ) : (
            "Ingresar"
          )}
        </button>

        <div className="pt-2">
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
