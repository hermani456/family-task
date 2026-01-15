import { AlertCircle, Check, X, ChartPie } from "lucide-react";
import { authClient } from "../../lib/auth-client";
import { UserAvatar } from "../../components/UserAvatar";
import { ActionButton } from "../../components/ui/ActionButton";
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <div className="bg-amber-100 p-1.5 rounded-lg text-amber-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            Por revisar
          </h2>
          {pendingReviews.length > 0 && (
            <span className="bg-amber-100 text-amber-700 text-xs font-black px-2.5 py-1 rounded-full border border-amber-200">
              {pendingReviews.length} pendientes
            </span>
          )}
        </div>

        <div className="space-y-4">
          {pendingReviews.map((task) => (
            <div
              key={task.id}
              className="bg-surface p-5 rounded-3xl border border-border shadow-sm flex flex-col gap-4"
            >
              {/* Header de la tarjeta */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={task.child}
                    className="size-10 border border-gray-100"
                  />
                  <div>
                    <p className="font-bold text-lg leading-none text-foreground">
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold mt-1.5">
                      Hecho por{" "}
                      <span className="text-primary font-bold">
                        {task.child}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Badge de Puntos */}
                <div className="bg-surface border-2 border-primary/10 px-3 py-1.5 rounded-xl flex flex-col items-center min-w-15">
                  <span className="text-lg font-black text-primary leading-none">
                    +{task.points}
                  </span>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">
                    Pts
                  </span>
                </div>
              </div>

              <div className="h-px bg-border w-full" />

              <div className="grid grid-cols-2 gap-3">
                <ActionButton
                  variant="primary"
                  icon={<X className="w-5 h-5" />}
                  onClick={() => console.log("Rechazar")}
                >
                  Corregir
                </ActionButton>

                <ActionButton
                  variant="success"
                  icon={<Check className="w-5 h-5" />}
                  onClick={() => console.log("Aprobar")}
                >
                  Aprobar
                </ActionButton>
              </div>
            </div>
          ))}

          {pendingReviews.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground bg-surface/50 rounded-3xl border-2 border-dashed border-border/60">
              <Check className="w-10 h-10 text-muted-foreground/30 mb-2" />
              <p className="font-medium">¡Todo al día!</p>
              <p className="text-xs opacity-70">No hay tareas pendientes.</p>
            </div>
          )}
        </div>
      </section>

      {/* BALANCE */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
            <ChartPie className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Balance Familiar
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {familyBalance.map((child) => (
            <div
              key={child.id}
              className="bg-surface p-4 rounded-3xl border border-border flex flex-col items-center text-center shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

              <div className="mb-3 relative">
                <UserAvatar
                  name={child.name}
                  className="size-14 border-4 border-white shadow-sm"
                />
              </div>

              <div className="font-bold text-foreground text-lg">
                {child.name}
              </div>

              <div className="flex items-baseline gap-1 mt-1">
                <div className="text-2xl font-black text-primary">
                  {child.points}
                </div>
                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  PTS
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
