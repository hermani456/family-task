import { useState } from "react";
import { Lock, ShoppingBag, Coins, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { authClient } from "../../lib/auth-client";
import { useMyFamily } from "../../hooks/useMyFamily";
import { useRewards } from "../../hooks/useRewards";

interface Reward {
  id: string;
  createdAt: Date;
  familyId: string;
  title: string;
  description: string | null;
  cost: number;
  image: string | null;
}

export const ChildRewards = () => {
  const { data: session } = authClient.useSession();
  const { data: familyData, isLoading: loadingFamily } = useMyFamily();
  const {
    data: rewards,
    isLoading: loadingRewards,
    redeemMutation,
  } = useRewards();

  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const currentBalance = familyData?.member?.balance || 0;
  const isLoading = loadingFamily || loadingRewards;

  const handleRedeem = (reward: Reward) => {
    toast(`¿Canjear "${reward.title}"?`, {
      description: `Gastarás ${reward.cost} puntos de tu saldo.`,
      action: {
        label: "Sí, canjear",
        onClick: () => {
          setRedeemingId(reward.id);

          const promise = redeemMutation.mutateAsync(reward.id);

          toast.promise(promise, {
            loading: "Procesando canje...",
            success: () => {
              const end = Date.now() + 1000;
              const colors = ["#10b981", "#34d399", "#f59e0b"];
              (function frame() {
                confetti({
                  particleCount: 3,
                  angle: 60,
                  spread: 55,
                  origin: { x: 0 },
                  colors,
                });
                confetti({
                  particleCount: 3,
                  angle: 120,
                  spread: 55,
                  origin: { x: 1 },
                  colors,
                });
                if (Date.now() < end) requestAnimationFrame(frame);
              })();

              return `¡Disfruta tu ${reward.title}! 🎉`;
            },
            error: (err) => err.message || "No tienes suficientes puntos 😢",
            finally: () => setRedeemingId(null),
          });
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => toast.dismiss(),
      },
      duration: 5000,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 pt-4 px-1">
        <div className="h-40 bg-gray-100 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-48 bg-gray-100 rounded-3xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Tienda de Premios
        </h1>
        <p className="text-muted-foreground font-medium text-sm">
          ¡Hola {session?.user?.name?.split(" ")[0]}, gasta tus puntos
          sabiamente!
        </p>
      </div>

      {/* WALLET CARD */}
      <div className="bg-linear-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform">
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <p className="text-emerald-100 font-bold text-xs uppercase tracking-wider mb-1">
              Saldo Disponible
            </p>
            <div className="text-5xl font-black tracking-tighter flex items-baseline gap-2">
              {currentBalance}
              <span className="text-lg font-bold opacity-80">pts</span>
            </div>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm shadow-inner">
            <ShoppingBag className="size-8 text-white" />
          </div>
        </div>
        <Coins className="absolute -bottom-6 -left-6 size-32 text-white/10 rotate-45 group-hover:rotate-12 transition-transform duration-500" />
      </div>

      {/* GRID DE PRODUCTOS */}
      <section>
        {rewards?.length === 0 ? (
          <div className="text-center py-10 opacity-60">
            <p>Tu familia aún no ha creado premios.</p>
            <p className="text-xs mt-2">¡Diles que agreguen algunos! 🎁</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {rewards?.map((reward) => {
              const canAfford = currentBalance >= reward.cost;
              const progress = Math.min(
                (currentBalance / reward.cost) * 100,
                100
              );

              const isThisLoading = redeemingId === reward.id;
              const isAnyLoading = redeemingId !== null;

              return (
                <div
                  key={reward.id}
                  className={`
                    relative flex flex-col p-4 rounded-3xl border transition-all duration-300
                    ${
                      canAfford
                        ? "bg-surface border-border shadow-sm hover:shadow-md hover:-translate-y-1"
                        : "bg-gray-50 border-dashed border-gray-200 opacity-90 grayscale-[0.3]"
                    }
                    `}
                >
                  <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md px-2 py-1 rounded-lg border border-gray-100 shadow-sm z-10">
                    <span
                      className={`text-xs font-black ${
                        canAfford ? "text-emerald-600" : "text-gray-400"
                      }`}
                    >
                      {reward.cost} pts
                    </span>
                  </div>

                  <div className="h-24 flex items-center justify-center text-6xl mb-2 drop-shadow-sm select-none">
                    {reward.image || "🎁"}
                  </div>

                  <div className="flex-1 text-center mb-4 min-h-12">
                    <h3 className="font-bold text-foreground leading-tight mb-1 line-clamp-2 text-sm">
                      {reward.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">
                      {reward.description ||
                        (canAfford ? "¡Puedes tenerlo!" : "¡Sigue ahorrando!")}
                    </p>
                  </div>

                  {canAfford ? (
                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={isAnyLoading}
                      className={`w-full py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-black/10 active:scale-95 transition-all flex items-center justify-center gap-2 
                           ${
                             isAnyLoading
                               ? "opacity-70 cursor-not-allowed bg-gray-600"
                               : "bg-primary text-primary-foreground hover:primary/30"
                           }`}
                    >
                      {isThisLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Sparkles className="size-4 text-yellow-300" />
                      )}
                      {isThisLoading ? "Canjeando..." : "Canjear"}
                    </button>
                  ) : (
                    <div className="space-y-2 w-full">
                      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden border border-gray-100">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted-foreground">
                        <Lock className="size-3" />
                        <span>Faltan {reward.cost - currentBalance} pts</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
