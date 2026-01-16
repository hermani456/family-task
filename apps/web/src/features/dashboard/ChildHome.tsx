import { useState } from "react";
import {
  Bed,
  ListTodo,
  CheckCircle2,
  Clock,
  Gamepad2,
  BookOpen,
  Sparkles,
  Loader2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { authClient } from "../../lib/auth-client";
import { useMyFamily } from "../../hooks/useMyFamily";
import { useTasks, useUpdateTaskStatus } from "../../hooks/useTasks";
import { PointsHistory } from "../../components/PointsHistory";
import { Drawer } from "../../components/ui/drawer";

export const ChildHome = () => {
  const [isHistoryOpen, setHistoryOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const { data: familyData } = useMyFamily();
  const member = familyData?.member;

  const { data: tasks, isLoading } = useTasks();
  const { mutate: updateStatus } = useUpdateTaskStatus();

  // separamos por ESTADO para la UI
  const pendingTasks =
    tasks?.filter((t) => ["PENDING", "IN_PROGRESS"].includes(t.status)) || [];

  const inReviewTasks = tasks?.filter((t) => t.status === "REVIEW") || [];

  const handleCompleteTask = (taskId: string) => {
    const end = Date.now() + 1000;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    updateStatus(
      { taskId, status: "REVIEW" },
      {
        onSuccess: () => {
          toast.success("¡Bien hecho! 🌟", {
            description: "Papá revisará tu tarea pronto.",
          });
        },
        onError: () => {
          toast.error("Ups, algo falló. Inténtalo de nuevo.");
        },
      }
    );
  };

  // Helper de Iconos
  const getTaskIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("cama") || t.includes("ordenar") || t.includes("limpiar"))
      return <Bed className="size-6" />;
    if (t.includes("leer") || t.includes("estudiar") || t.includes("tarea"))
      return <BookOpen className="size-6" />;
    if (t.includes("perro") || t.includes("mascota"))
      return <Gamepad2 className="size-6" />;
    return <ListTodo className="size-6" />;
  };

  // SKELETON LOADING
  if (isLoading) {
    return (
      <div className="space-y-6 pt-4 px-1 pb-24">
        <div className="h-16 w-3/4 bg-surface rounded-xl animate-pulse" />
        <div className="h-40 w-full bg-surface rounded-3xl animate-pulse" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-24 w-full bg-surface rounded-3xl animate-pulse"
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
          ¡Hola, {session?.user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground font-medium text-sm">
          ¡A completar misiones!
        </p>
      </div>

      {/* HERO CARD DE PUNTOS */}
      <button
        onClick={() => setHistoryOpen(true)}
        className="w-full text-left bg-linear-to-br from-primary to-primary/80 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group active:scale-[0.98] transition-all"
      >
        <div className="relative z-10">
          <p className="text-indigo-100 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
            Tus Puntos
            <Sparkles className="size-3 text-yellow-300 animate-pulse" />
          </p>
          <div className="text-6xl font-black tracking-tighter flex items-baseline gap-2">
            {member?.balance || 0}
            <span className="text-xl font-bold opacity-60">pts</span>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 size-40 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform" />
        <Loader2 className="absolute -bottom-4 -right-4 size-32 text-white/5 rotate-12" />
      </button>

      {/* MISIONES ACTIVAS */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-600">
            <ListTodo className="size-5" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Misiones de Hoy</h2>
        </div>

        <div className="space-y-3">
          {pendingTasks.map((task) => (
            <div
              key={task.id}
              className="bg-surface p-4 rounded-3xl border border-border shadow-sm flex items-start gap-4 active:scale-[0.99] transition-all relative overflow-hidden"
            >
              <div className="size-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 shrink-0 mt-1">
                {getTaskIcon(task.title)}
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-foreground text-base leading-tight pr-2 line-clamp-2">
                    {task.title}
                  </h3>
                  <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-black border border-amber-200 shrink-0">
                    +{task.points}
                  </span>
                </div>

                <button
                  className="w-full bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-600 font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 border border-slate-200 hover:border-emerald-600 active:scale-95 group"
                  onClick={() => handleCompleteTask(task.id)}
                >
                  <div className="size-5 rounded-full border-2 border-slate-400 group-hover:border-white flex items-center justify-center transition-colors">
                    <CheckCircle2 className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  ¡Listo!
                </button>
              </div>
            </div>
          ))}

          {pendingTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center opacity-60">
              <div className="bg-slate-100 p-4 rounded-full mb-2">
                <CheckCircle2 className="size-8 text-slate-400" />
              </div>
              <p className="text-sm font-bold text-slate-500">
                ¡Todo limpio por aquí!
              </p>
              <p className="text-xs text-slate-400">
                No tienes misiones pendientes.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* EN REVISIÓN */}
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
                <div className="size-12 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400 shrink-0 grayscale opacity-70">
                  {getTaskIcon(task.title)}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-muted-foreground text-base leading-tight line-through decoration-slate-400">
                      {task.title}
                    </h3>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 uppercase tracking-wide">
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

      {/* DRAWER DE HISTORIAL */}
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
