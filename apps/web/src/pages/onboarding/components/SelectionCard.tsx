interface SelectionCardProps {
  icon: React.ReactNode;
  color: "indigo" | "amber";
  badge: string;
  title: string;
  desc: string;
  onClick: () => void;
}

export const SelectionCard = ({
  icon,
  color,
  badge,
  title,
  desc,
  onClick,
}: SelectionCardProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-surface p-5 rounded-3xl text-left border border-transparent hover:border-border shadow-sm hover:shadow-md transition-all active:scale-[0.98] group"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-3 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 ${
            color === "indigo"
              ? "bg-indigo-100 text-indigo-600"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          {icon}
        </div>
        <div
          className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wide ${
            color === "indigo"
              ? "bg-indigo-50 text-indigo-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          {badge}
        </div>
      </div>
      <div>
        <h2
          className={`text-lg font-bold text-foreground transition-colors ${
            color === "indigo"
              ? "group-hover:text-primary"
              : "group-hover:text-secondary"
          }`}
        >
          {title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          {desc}
        </p>
      </div>
    </button>
  );
};
