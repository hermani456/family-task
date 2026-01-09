import { useState } from "react";
import { useRewards } from "../hooks/useRewards";
import { toast } from "sonner";

interface Props {
  userRole: "PARENT" | "CHILD";
  userBalance: number;
}

export const RewardsList = ({ userRole, userBalance }: Props) => {
  const { data: rewards, createMutation, redeemMutation } = useRewards();
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !cost) return;
    createMutation.mutate({ title, cost: Number(cost) });
    setTitle("");
    setCost("");
  };

  const handleRedeem = (rewardId: string) => {
    toast.promise(redeemMutation.mutateAsync(rewardId), {
      loading: "Canjeando premio...",
      success: "¡Premio canjeado con éxito!",
      error: (err) => err.message || "Error al canjear",
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="font-bold text-gray-500 uppercase text-xs mb-2">
          Tienda de Premios
        </h3>

        {userRole === "PARENT" && (
          <form
            onSubmit={handleCreate}
            className="flex gap-2 bg-pink-50 p-2 rounded border border-pink-100"
          >
            <input
              className="border p-1 rounded flex-1 text-sm"
              placeholder="Ej: 1 Hora TV"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="border p-1 rounded w-20 text-sm"
              placeholder="Pts"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
            <button className="bg-pink-600 text-white px-3 rounded text-sm font-bold">
              +
            </button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 overflow-y-auto">
        {rewards?.map((r) => {
          const canAfford = userBalance >= r.cost;

          return (
            <div
              key={r.id}
              className="border rounded-lg p-3 flex flex-col justify-between bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-2">
                <h4 className="font-bold text-gray-800">{r.title}</h4>
                <p className="text-xs text-gray-500">{r.description}</p>
              </div>

              <div className="flex justify-between items-end mt-2">
                <span className="font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded text-sm">
                  {r.cost} pts
                </span>

                {userRole === "CHILD" && (
                  <button
                    onClick={() => handleRedeem(r.id)}
                    disabled={!canAfford || redeemMutation.isPending}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                      canAfford
                        ? "bg-black text-white hover:bg-gray-800"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {canAfford ? "Canjear" : "Falta saldo"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
