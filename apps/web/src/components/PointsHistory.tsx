import { ArrowDownRight, ArrowUpRight, Clock } from "lucide-react";

// Mock Data
const history = [
  {
    id: 1,
    title: "Hacer la cama",
    points: 20,
    type: "EARNED",
    date: "Hoy, 10:00 AM",
  },
  {
    id: 2,
    title: "Canje: 1 Hora Videojuegos",
    points: -100,
    type: "SPENT",
    date: "Ayer, 18:30 PM",
  },
  {
    id: 3,
    title: "Ordenar juguetes",
    points: 50,
    type: "EARNED",
    date: "Ayer, 16:00 PM",
  },
];

export const PointsHistory = () => {
  return (
    <div className="space-y-4">
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
              <p className="font-bold text-sm text-foreground">{item.title}</p>
              <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                <Clock className="size-3" /> {item.date}
              </p>
            </div>
          </div>
          <span
            className={`font-black text-sm ${
              item.type === "EARNED" ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {item.points > 0 ? "+" : ""}
            {item.points}
          </span>
        </div>
      ))}
    </div>
  );
};
