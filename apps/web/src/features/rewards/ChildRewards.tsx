import { Lock, ShoppingBag, Coins, Sparkles } from "lucide-react";
import { toast } from "sonner"; // Usamos Sonner para el feedback
import { authClient } from "../../lib/auth-client";
import { useMyFamily } from "../../hooks/useMyFamily";

export const ChildRewards = () => {
  const { data: session } = authClient.useSession();
  const { data: familyData } = useMyFamily();

  const currentBalance = familyData?.member?.balance || 0;

  const rewards = [
    {
      id: 1,
      title: "1 Hora de Videojuegos",
      cost: 100,
      image: "🎮",
      description: "Minecraft o Roblox",
    },
    {
      id: 2,
      title: "Helado después de comer",
      cost: 200,
      image: "🍦",
      description: "Tu sabor favorito",
    },
    {
      id: 3,
      title: "Ir al Cine",
      cost: 1500,
      image: "🍿",
      description: "Con palomitas incluidas",
    },
    {
      id: 4,
      title: "Juguete Pequeño",
      cost: 800,
      image: "🧸",
      description: "Lego o figura de acción",
    },
    {
      id: 5,
      title: "Noche de Pizza",
      cost: 1200,
      image: "🍕",
      description: "Elegimos la película",
    },
  ];

  const handleRedeem = (reward: any) => {
    toast.success(`¡Canjeaste "${reward.title}"!`, {
      description: "Avísale a tus padres para recibirlo.",
      icon: "🎉",
      duration: 5000,
    });
    // confetti?
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Tienda de Premios
        </h1>
        <p className="text-muted-foreground font-medium text-sm">
          ¡Gasta tus puntos sabiamente!
        </p>
      </div>

      {/* WALLET CARD  */}
      <div className="bg-linear-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
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
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <ShoppingBag className="size-8 text-white" />
          </div>
        </div>
        <Coins className="absolute -bottom-6 -left-6 size-32 text-white/10 rotate-45" />
      </div>

      {/* GRID DE PRODUCTOS */}
      <section>
        <div className="grid grid-cols-2 gap-4">
          {rewards.map((reward) => {
            const canAfford = 1000 >= reward.cost;
            const progress = Math.min(
              (currentBalance / reward.cost) * 100,
              100
            );

            return (
              <div
                key={reward.id}
                className={`
                  relative flex flex-col p-4 rounded-3xl border transition-all duration-300
                  ${
                    canAfford
                      ? "bg-surface border-border shadow-sm hover:shadow-md hover:-translate-y-1"
                      : "bg-muted border-dashed border-gray-200 opacity-90 grayscale-[0.5]"
                  }
                `}
              >
                {/* Badge de Costo */}
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md px-2 py-1 rounded-lg border border-gray-100 shadow-sm z-10">
                  <span
                    className={`text-xs font-black ${
                      canAfford ? "text-emerald-600" : "text-gray-400"
                    }`}
                  >
                    {reward.cost} pts
                  </span>
                </div>

                {/* Imagen/Emoji */}
                <div className="h-24 flex items-center justify-center text-6xl mb-2 drop-shadow-sm">
                  {reward.image}
                </div>

                {/* Info */}
                <div className="flex-1 text-center mb-4">
                  <h3 className="font-bold text-foreground leading-tight mb-1 line-clamp-2">
                    {reward.title}
                  </h3>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">
                    {reward.description}
                  </p>
                </div>

                {/* Botón de Acción o Estado */}
                {canAfford ? (
                  <button
                    onClick={() => handleRedeem(reward)}
                    className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="size-4" />
                    Canjear
                  </button>
                ) : (
                  <div className="space-y-2">
                    {/* Barra de progreso para motivación */}
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-muted-foreground">
                      <Lock className="size-3" />
                      <span>Faltan {reward.cost - currentBalance}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
