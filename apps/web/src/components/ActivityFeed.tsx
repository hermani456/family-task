import { useHistory } from "../hooks/useHistory";

export const ActivityFeed = () => {
  const { data: history, isLoading } = useHistory();

  if (isLoading)
    return <div className="text-xs text-gray-400">Cargando actividad...</div>;

  return (
    <div className="h-full flex flex-col">
      <h3 className="font-bold text-gray-500 uppercase text-xs mb-3">
        Actividad Reciente
      </h3>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {history?.length === 0 && (
          <p className="text-xs text-gray-400 italic">
            No hay movimientos aún.
          </p>
        )}

        {history?.map((item) => {
          const isEarned = item.type === "EARNED";

          return (
            <div
              key={item.id}
              className="flex justify-between items-center text-sm border-b pb-2 last:border-0"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-700">
                  {item.description}
                </span>
                <span className="text-[10px] text-gray-400">
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <span
                className={`font-bold px-2 py-0.5 rounded text-xs ${
                  isEarned
                    ? "text-green-600 bg-green-50"
                    : "text-red-500 bg-red-50"
                }`}
              >
                {isEarned ? "+" : ""}
                {item.amount}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
