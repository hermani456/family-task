import { ArrowDownRight, ArrowUpRight, Clock } from "lucide-react";
import { useHistory } from "../hooks/useHistory";

export const PointsHistory = () => {
  const { data: history = [] } = useHistory();

  return (
    <div className="space-y-4 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
      {history.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border"
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                item.type === "EARNED"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-rose-100 text-rose-600"
              }`}
            >
              {item.type === "EARNED" ? (
                <ArrowUpRight className="size-5" />
              ) : (
                <ArrowDownRight className="size-5" />
              )}
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">
                {item.description}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                <Clock className="size-3" />{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <span
            className={`font-black text-sm ${
              item.type === "EARNED" ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {item.amount > 0 ? "+" : ""}
            {item.amount}
          </span>
        </div>
      ))}
    </div>
  );
};
