import { Calendar, Trash2, Users } from "lucide-react";
import { UserAvatar } from "../../../components/UserAvatar";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    points: number;
    createdAt: Date | string;
    assignedTo?: { name: string } | null;
  };
  onDelete: (id: string) => void;
}

export const TaskCard = ({ task, onDelete }: TaskCardProps) => {
  const dateStr = new Date(task.createdAt).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="bg-surface p-4 rounded-2xl border border-border shadow-sm flex flex-col gap-3 transition-all hover:shadow-md active:scale-[0.99]">
      
      {/* Header: Título y Puntos */}
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-foreground text-base leading-tight pr-2 line-clamp-2">
          {task.title}
        </h3>
        <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-black border border-emerald-200 shrink-0 whitespace-nowrap">
          +{task.points} pts
        </span>
      </div>

      {/* Footer: Asignado a y Fecha */}
      <div className="flex items-center justify-between mt-1">
        
        {/* Asignación */}
        <div className="flex items-center gap-2">
          {task.assignedTo ? (
            // Asignado a alguien específico
            <>
              <UserAvatar name={task.assignedTo.name} className="size-6 border border-border" />
              <span className="text-xs font-semibold text-muted-foreground">
                {task.assignedTo.name.split(" ")[0]}
              </span>
            </>
          ) : (
            // Asignado a Todos
            <>
              <div className="size-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200">
                <Users className="size-3.5" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                Todos
              </span>
            </>
          )}
        </div>

        {/* Fecha y Acción */}
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium bg-secondary/30 px-2 py-1 rounded-md">
                <Calendar className="size-3" />
                {dateStr}
            </div>
            
            {/* Botón Borrar */}
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                }}
                className="text-muted-foreground hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
            >
                <Trash2 className="size-4" />
            </button>
        </div>
      </div>
    </div>
  );
};