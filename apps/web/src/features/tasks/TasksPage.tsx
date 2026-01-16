import { useState } from "react";
import { Plus, ListTodo, ClipboardCheck } from "lucide-react";
import { Drawer } from "../../components/ui/drawer";
import { CreateTaskForm } from "./components/CreateTaskModal";
import { TaskCard } from "./components/TaskCard";
import { useDeleteTask, useTasks } from "../../hooks/useTasks";
import { toast } from "sonner";

export const TasksPage = () => {
  const [isCreateOpen, setCreateOpen] = useState(false);

  const { data: tasks, isLoading } = useTasks();
  const { mutateAsync: deleteTask } = useDeleteTask();

  const handleDelete = (id: string) => {
    toast("¿Borrar esta tarea?", {
      description: "Esta acción no se puede deshacer.",
      action: {
        label: "Borrar",
        onClick: () => {
          toast.promise(deleteTask(id), {
            loading: "Eliminando...",
            success: "Tarea eliminada correctamente",
            error: "No se pudo eliminar la tarea",
          });
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

  return (
    <>
      <div className="space-y-6 pb-32 animate-in fade-in duration-500">
        {/* HEADER */}
        <div className="flex items-center gap-2 px-1">
          <div className="bg-primary/70 p-2 rounded-xl text-secondary">
            <ClipboardCheck className="size-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-foreground leading-none">
              Tareas
            </h2>
            <p className="text-xs text-muted-foreground font-semibold">
              Gestiona las tareas del hogar
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {isLoading && (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-surface rounded-2xl animate-pulse border border-border/50"
                />
              ))}
            </>
          )}

          {!isLoading && tasks?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-80">
              <div className="bg-surface border border-dashed border-border p-4 rounded-full mb-4">
                <ListTodo className="size-8 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-foreground">
                No hay tareas creadas
              </h3>
              <p className="text-sm text-muted-foreground max-w-50 mt-1">
                Toca el botón + para crear la primera tarea del hogar.
              </p>
            </div>
          )}

          {!isLoading &&
            tasks?.map((task) => (
              <TaskCard key={task.id} task={task} onDelete={handleDelete} />
            ))}
        </div>
      </div>

      <button
        onClick={() => setCreateOpen(true)}
        className="fixed bottom-24 right-5 bg-primary text-primary-foreground p-4 rounded-2xl shadow-xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all z-40 group hover:shadow-primary/40"
        aria-label="Crear tarea"
      >
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <Drawer
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        title="Nueva Tarea"
      >
        <CreateTaskForm onSuccess={() => setCreateOpen(false)} />
      </Drawer>
    </>
  );
};
