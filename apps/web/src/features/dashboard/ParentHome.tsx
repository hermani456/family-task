import { AlertCircle, Check, X, ChartPie, Loader2 } from "lucide-react";
import { authClient } from "../../lib/auth-client";
import { UserAvatar } from "../../components/UserAvatar";
import { ActionButton } from "../../components/ui/ActionButton";
import { Navigate } from "react-router";
import { toast } from "sonner";
import confetti from "canvas-confetti";

import { useTasks, useUpdateTaskStatus } from "../../hooks/useTasks";
import { useMembers } from "../../hooks/useMembers";

export const ParentHome = () => {
  const { data: session } = authClient.useSession();

  const { data: tasks, isLoading: loadingTasks } = useTasks();
  const { data: members, isLoading: loadingMembers } = useMembers();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateTaskStatus();

  if (!session) return <Navigate to="/login" />;

  // Tareas que están esperando aprobación
  const pendingReviews = tasks?.filter((t) => t.status === "REVIEW") || [];

  // Miembros que son hijos
  const childrenMembers = members?.filter((m) => m.role === "CHILD") || [];
  console.log("Children Members:", childrenMembers);
  const isLoading = loadingTasks || loadingMembers;

  const handleApprove = (taskId: string, points: number, childName: string) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10b981", "#34d399", "#a7f3d0"],
    });

    updateStatus(
      { taskId, status: "DONE" },
      {
        onSuccess: () => {
          toast.success(`¡Tarea aprobada!`, {
            description: `${childName} ha recibido +${points} puntos.`,
            icon: "🎉",
          });
        },
        onError: () => toast.error("Error al aprobar la tarea"),
      }
    );
  };

  const handleReject = (taskId: string, childName: string) => {
    toast("¿Rechazar esta tarea?", {
      description: "Volverá a la lista de pendientes del niño.",
      action: {
        label: "Corregir",
        onClick: () => {
          updateStatus(
            { taskId, status: "PENDING" },
            {
              onSuccess: () => toast.info(`Tarea devuelta a ${childName}`),
            }
          );
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => {
          toast.dismiss();
        },
      },
      duration: 5000,
    });
  };

  // 4. Skeleton Loading (Para evitar saltos visuales)
  if (isLoading) {
    return (
      <div className="space-y-8 pt-4 pb-10 px-1">
        <div className="h-40 bg-surface rounded-3xl animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-surface rounded-3xl animate-pulse" />
          <div className="h-32 bg-surface rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      {/* SECCIÓN: POR REVISAR */}
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
          {pendingReviews.map((task) => {
            const childName = task.assignedToName || "Alguien";

            return (
              <div
                key={task.id}
                className="bg-surface p-5 rounded-3xl border border-border shadow-sm flex flex-col gap-4 transition-all hover:shadow-md"
              >
                {/* Header de la tarjeta */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      name={childName}
                      className="size-10 border border-gray-100"
                    />
                    <div>
                      <p className="font-bold text-lg leading-none text-foreground line-clamp-1">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground font-semibold mt-1.5">
                        Hecho por{" "}
                        <span className="text-primary font-bold">
                          {childName.split(" ")[0]}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Badge de Puntos */}
                  <div className="bg-surface border-2 border-primary/10 px-3 py-1.5 rounded-xl flex flex-col items-center min-w-14">
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
                    variant="danger"
                    disabled={isUpdating}
                    icon={<X className="w-5 h-5" />}
                    onClick={() => handleReject(task.id, childName)}
                  >
                    Corregir
                  </ActionButton>

                  <ActionButton
                    variant="success"
                    disabled={isUpdating}
                    icon={
                      isUpdating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )
                    }
                    onClick={() =>
                      handleApprove(task.id, task.points, childName)
                    }
                  >
                    Aprobar
                  </ActionButton>
                </div>
              </div>
            );
          })}

          {pendingReviews.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground bg-surface/50 rounded-3xl border-2 border-dashed border-border/60">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="font-bold text-foreground">¡Todo al día!</p>
              <p className="text-xs opacity-70">
                Tus hijos no han enviado tareas nuevas.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECCIÓN: BALANCE FAMILIAR */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
            <ChartPie className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Balance Familiar
          </h2>
        </div>

        {childrenMembers.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {childrenMembers.map((child) => (
              <div
                key={child.userId}
                className="bg-surface p-4 rounded-3xl border border-border flex flex-col items-center text-center shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                <div className="mb-3 relative">
                  <UserAvatar
                    name={child.name}
                    className="size-14 border-4 border-white shadow-sm"
                  />
                </div>

                <div className="font-bold text-foreground text-lg truncate w-full px-2">
                  {child.name.split(" ")[0]}
                </div>

                <div className="flex items-baseline gap-1 mt-1">
                  <div className="text-2xl font-black text-primary">
                    {child.balance || 0}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    PTS
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State si no hay hijos
          <div className="text-center py-8 bg-surface rounded-2xl border border-dashed">
            <p className="text-sm text-muted-foreground">
              No hay hijos en la familia aún.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
