import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { Drawer } from "../../components/ui/drawer"; // Importamos nuestro componente
// import { CreateTaskForm } from "./components/CreateTaskForm"; // Tu formulario separado

export const TasksPage = () => {
  const [isCreateOpen, setCreateOpen] = useState(false);

  return (
    <>
      <div className="space-y-6 pb-32">
        {" "}
        {/* pb-32 para dar espacio al FAB */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight">Tareas</h1>
          <button className="p-2 text-muted-foreground hover:bg-gray-100 rounded-full border border-transparent hover:border-gray-200 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
        {/* ... Tu lista de tareas ... */}
        <div className="p-4 bg-surface rounded-2xl border border-border shadow-sm">
          <p className="font-bold">Ejemplo de tarea</p>
        </div>
      </div>

      {/* FAB (Floating Action Button) */}
      <button
        onClick={() => setCreateOpen(true)}
        className="fixed bottom-24 right-5 bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all z-40 group"
      >
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* NUESTRO DRAWER NATIVO CON VIEW TRANSITIONS */}
      <Drawer
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        title="Nueva Tarea"
      >
        {/* Aquí iría <CreateTaskForm /> pero por ahora lo pongo inline */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-muted-foreground ml-1">
              ¿Qué hay que hacer?
            </label>
            <input
              placeholder="Ej. Lavar los platos"
              className="w-full mt-1 p-4 bg-background border border-border rounded-xl font-medium focus:ring-2 focus:ring-primary/20 outline-none"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <div className="w-1/3">
              <label className="text-sm font-bold text-muted-foreground ml-1">
                Puntos
              </label>
              <input
                type="number"
                placeholder="10"
                className="w-full mt-1 p-4 bg-background border border-border rounded-xl font-bold text-center outline-none focus:border-primary"
              />
            </div>
            <div className="w-2/3">
              <label className="text-sm font-bold text-muted-foreground ml-1">
                Asignar a
              </label>
              <select className="w-full mt-1 p-4 bg-background border border-border rounded-xl font-medium outline-none">
                <option>Todos</option>
                <option>Mateo</option>
                <option>Sofia</option>
              </select>
            </div>
          </div>

          <button className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 mt-4 active:scale-[0.98] transition-transform">
            Crear Tarea
          </button>
        </div>
      </Drawer>
    </>
  );
};
