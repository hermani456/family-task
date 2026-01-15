import { CheckCircle2, Gift, Target } from "lucide-react";
import { authClient } from "../../lib/auth-client";
import { useMyFamily } from "../../hooks/useMyFamily";

export const ChildHome = () => {
  const { data: session } = authClient.useSession();
  const { data: familyData } = useMyFamily();

  const member = familyData?.member;

  const myTasks = [
    { id: 1, title: "Hacer la cama", points: 20, status: "PENDING" },
    { id: 2, title: "Ordenar juguetes", points: 50, status: "PENDING" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          ¡Vamos, {session?.user?.name?.split(" ")[0]}! 🚀
        </h1>
        <p className="text-muted-foreground font-medium text-sm">
          Completa tareas para ganar premios.
        </p>
      </div>

      {/* TARJETA DE PUNTOS */}
      <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-indigo-100 font-bold text-sm uppercase tracking-wider mb-1">
            Tus Puntos
          </p>
          <div className="text-5xl font-black tracking-tight flex items-baseline gap-2">
            {member?.balance || 0}
            <span className="text-lg font-bold opacity-60">pts</span>
          </div>
        </div>
        <Gift className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12" />
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-600">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Misiones de Hoy</h2>
        </div>

        <div className="space-y-3">
          {myTasks.map((task) => (
            <div
              key={task.id}
              className="bg-surface p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div>
                <p className="font-bold text-foreground">{task.title}</p>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md mt-1 inline-block">
                  +{task.points} pts
                </span>
              </div>

              <button className="h-12 w-12 rounded-full border-2 border-border flex items-center justify-center text-muted-foreground hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-colors">
                <CheckCircle2 className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
