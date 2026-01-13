import type { ButtonHTMLAttributes } from "react";

interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  isDarkIcon?: boolean;
}

export const SocialButton = ({
  icon,
  label,
  isDarkIcon,
  className,
  ...props
}: SocialButtonProps) => {
  return (
    <button
      type="button"
      className={`flex items-center justify-center gap-3 border border-border bg-surface rounded-xl py-2.5 
                 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm group 
                 disabled:opacity-50 disabled:cursor-not-allowed ${
                   className || ""
                 }`}
      {...props}
    >
      <img
        src={icon}
        alt={label}
        className={`size-5 ${isDarkIcon ? "dark:invert" : ""}`}
      />
      <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </span>
    </button>
  );
};
