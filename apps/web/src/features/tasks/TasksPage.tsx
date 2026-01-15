import { useState } from "react";
import { Plus, Filter, ListTodo } from "lucide-react";
import { Drawer } from "../../components/ui/drawer";
import { CreateTaskForm } from "./components/CreateTaskModal"; // Tu form separado
import { TaskCard } from "./components/TaskCard"; // Tu nueva tarjeta
import { useDeleteTask, useTasks } from "../../hooks/useTasks"; // Tu hook de datos
import { toast } from "sonner";

export const TasksPage = () => {
  const [isCreateOpen, setCreateOpen] = useState(false);

  // Hook de datos (asumiendo que devuelve { data, isLoading })
  const { data: tasks, isLoading } = useTasks();
  const { mutateAsync: deleteTask } = useDeleteTask();

  const handleDelete = (id: string) => {
    // Opción 1: Confirmación Nativa (Rápida y Segura)
    // const confirm = window.confirm("¿Seguro que quieres borrar esta tarea?");
    // if (!confirm) return;

    // Opción 2: UX Premium con Sonner (Recomendada)
    // Creamos un toast personalizado que pregunta antes de borrar
    toast("¿Borrar esta tarea?", {
      description: "Esta acción no se puede deshacer.",
      action: {
        label: "Borrar",
        onClick: () => {
          // Ejecutamos la promesa dentro del toast
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
      duration: 5000, // Damos 5 segundos para decidir
    });
  };

  return (
    <>
      <div className="space-y-6 pb-32 animate-in fade-in duration-500">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Tareas</h1>
            <p className="text-sm text-muted-foreground font-medium">
              Gestiona las obligaciones del hogar
            </p>
          </div>
          <button className="p-2.5 text-muted-foreground hover:bg-surface rounded-full border border-transparent hover:border-border transition-all active:scale-95">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* LISTA DE TAREAS */}
        <div className="space-y-3">
          {/* ESTADO 1: CARGANDO (Skeletons) */}
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

          {/* ESTADO 2: SIN TAREAS (Empty State) */}
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

          {/* ESTADO 3: CON TAREAS */}
          {!isLoading &&
            tasks?.map((task) => (
              <TaskCard key={task.id} task={task} onDelete={handleDelete} />
            ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setCreateOpen(true)}
        className="fixed bottom-24 right-5 bg-primary text-primary-foreground p-4 rounded-2xl shadow-xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all z-40 group hover:shadow-primary/40"
        aria-label="Crear tarea"
      >
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* DRAWER */}
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
