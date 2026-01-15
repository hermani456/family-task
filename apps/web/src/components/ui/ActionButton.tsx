import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "success" | "danger" | "primary" | "outline";
  icon?: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const ActionButton = ({
  children,
  variant = "primary",
  icon,
  isLoading,
  fullWidth,
  className = "",
  disabled,
  ...props
}: ActionButtonProps) => {
  const variants = {
    success:
      "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20",

    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20",

    primary:
      "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20",

    outline:
      "bg-surface border-2 border-border hover:bg-muted text-muted-foreground",
  };

  const baseStyles =
    "relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100";
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        icon && <span className="text-current">{icon}</span>
      )}

      <span>{children}</span>
    </button>
  );
};
