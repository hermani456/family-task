import { CheckCircle2, AlertCircle } from "lucide-react";
import { authClient } from "../../lib/auth-client";
import { UserAvatar } from "../../components/UserAvatar";
import { Navigate } from "react-router";

export const ParentHome = () => {
  const { data: session } = authClient.useSession();

  if (!session) return <Navigate to="/login" />;

  const pendingReviews = [
    { id: 1, title: "Lavar los platos", child: "Mateo", points: 50 },
    { id: 2, title: "Hacer la cama", child: "Sofia", points: 20 },
  ];

  const familyBalance = [
    { id: 1, name: "Mateo", points: 1200, avatar: "👦" },
    { id: 2, name: "Sofia", points: 850, avatar: "👧" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      <div className="flex items-start gap-3">
        <UserAvatar
          name={session.user?.name}
          className="size-10 md:size-12 border-2 border-gray-100 mb-3"
        />
        <div>
          <h1 className="text-2xl font-black tracking-tight">Hola, {session.user?.name}</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Resumen de hoy en casa.
          </p>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Por revisar
          </h2>
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
            {pendingReviews.length}
          </span>
        </div>

        <div className="space-y-3">
          {pendingReviews.map((task) => (
            <div
              key={task.id}
              className="bg-surface p-4 rounded-2xl border border-border shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-foreground">{task.title}</p>
                <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                  Hecho por <span className="text-primary">{task.child}</span>
                </p>
              </div>
              <button className="bg-primary/10 text-primary p-2 rounded-xl hover:bg-primary/20 transition-colors">
                <CheckCircle2 className="w-6 h-6" />
              </button>
            </div>
          ))}
          {pendingReviews.length === 0 && (
            <div className="text-center py-6 text-muted-foreground text-sm bg-surface/50 rounded-2xl border border-dashed border-border">
              ¡Todo al día! No hay tareas pendientes.
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          💰 Balance Familiar
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {familyBalance.map((child) => (
            <div
              key={child.id}
              className="bg-surface p-4 rounded-3xl border border-border flex flex-col items-center text-center shadow-sm"
            >
              <div className="text-3xl mb-2 grayscale-0">{child.avatar}</div>
              <div className="font-bold text-foreground">{child.name}</div>
              <div className="text-2xl font-black text-primary mt-1">
                {child.points}
              </div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                Puntos
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
