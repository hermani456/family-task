import {
  Bed,
  Gift,
  ListTodo,
  CheckCircle2,
  Clock,
  Gamepad2,
  BookOpen,
} from "lucide-react";
import { authClient } from "../../lib/auth-client";
import { useMyFamily } from "../../hooks/useMyFamily";
import { useState } from "react";
import { PointsHistory } from "../../components/PointsHistory";
import { Drawer } from "../../components/ui/drawer";

export const ChildHome = () => {
  const [isHistoryOpen, setHistoryOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const { data: familyData } = useMyFamily();
  const member = familyData?.member;

  // Mock data separado por estados
  const myTasks = [
    {
      id: 1,
      title: "Hacer la cama",
      points: 20,
      status: "PENDING",
      type: "chore",
    },
    {
      id: 2,
      title: "Leer 10 minutos",
      points: 15,
      status: "PENDING",
      type: "study",
    },
  ];

  const inReviewTasks = [
    {
      id: 3,
      title: "Ordenar juguetes",
      points: 50,
      status: "IN_REVIEW",
      type: "chore",
    },
  ];

  // Helper para iconos dinámicos (Senior Pattern: UI Driven by Data)
  const getTaskIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("cama") || t.includes("ordenar"))
      return <Bed className="size-6" />;
    if (t.includes("leer") || t.includes("estudiar"))
      return <BookOpen className="size-6" />;
    if (t.includes("jugar")) return <Gamepad2 className="size-6" />;
    return <ListTodo className="size-6" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          ¡Hola, {session?.user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground font-medium text-sm">
          ¡A completar misiones!
        </p>
      </div>

      {/* HERO CARD DE PUNTOS */}
      <button
        onClick={() => setHistoryOpen(true)}
        className="w-full text-left bg-linear-to-br from-primary to-primary/70 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group"
      >
        <div className="relative z-10">
          <p className="text-indigo-100 font-bold text-xs uppercase tracking-wider mb-1">
            Tus Puntos
          </p>
          <div className="text-6xl font-black tracking-tighter flex items-baseline gap-2">
            {member?.balance || 0}
            <span className="text-xl font-bold opacity-60">pts</span>
          </div>
        </div>
        <Gift className="absolute -bottom-6 -right-6 size-40 text-white/10 rotate-12 group-hover:rotate-6 transition-transform duration-500" />
      </button>

      {/* SECCIÓN 1: MISIONES ACTIVAS */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-600">
            <ListTodo className="size-5" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Misiones de Hoy</h2>
        </div>

        <div className="space-y-3">
          {myTasks.map((task) => (
            <div
              key={task.id}
              className="bg-surface p-4 rounded-3xl border border-border shadow-sm flex items-start gap-4 active:scale-[0.98] transition-all relative overflow-hidden"
            >
              <div className="size-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 shrink-0 mt-1">
                {getTaskIcon(task.title)}
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-foreground text-base leading-tight pr-2">
                    {task.title}
                  </h3>
                  <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-black border border-amber-200 shrink-0">
                    +{task.points}
                  </span>
                </div>

                <button
                  className="w-full bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-600 font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 border border-slate-200 hover:border-emerald-600 active:scale-95 group"
                  onClick={() => console.log("Completar", task.id)}
                >
                  <div className="size-5 rounded-full border-2 border-slate-400 group-hover:border-white flex items-center justify-center transition-colors">
                    <CheckCircle2 className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  ¡Listo!
                </button>
              </div>
            </div>
          ))}

          {myTasks.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-4">
              ¡No tienes misiones pendientes!
            </p>
          )}
        </div>
      </section>

      {/* SECCIÓN 2: EN REVISIÓN */}
      {inReviewTasks.length > 0 && (
        <section className="opacity-80">
          <div className="flex items-center gap-2 mb-4 px-1 mt-8">
            <div className="bg-amber-100 p-1.5 rounded-lg text-amber-600">
              <Clock className="size-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              Esperando a Papá
            </h2>
          </div>

          <div className="space-y-3">
            {inReviewTasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-50 p-4 rounded-3xl border border-dashed border-slate-300 flex items-center gap-4"
              >
                <div className="size-12 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400 shrink-0 grayscale">
                  {getTaskIcon(task.title)}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-muted-foreground text-base leading-tight line-through decoration-slate-400">
                      {task.title}
                    </h3>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                      Revisando
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Ganarás{" "}
                    <span className="font-bold text-foreground">
                      {task.points} pts
                    </span>{" "}
                    cuando se apruebe.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <Drawer
        isOpen={isHistoryOpen}
        onClose={() => setHistoryOpen(false)}
        title="Mis Movimientos"
      >
        <PointsHistory />
      </Drawer>
    </div>
  );
};
