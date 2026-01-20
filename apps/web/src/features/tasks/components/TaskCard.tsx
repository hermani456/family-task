import {
  Bed,
  BookOpen,
  Gamepad2,
  ListTodo,
  Trash2,
  Users,
  Coins,
} from "lucide-react";
import { UserAvatar } from "../../../components/UserAvatar";

const getTaskIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("cama") || t.includes("ordenar") || t.includes("limpiar"))
    return <Bed className="size-6" />;
  if (t.includes("leer") || t.includes("estudiar") || t.includes("tarea"))
    return <BookOpen className="size-6" />;
  if (t.includes("perro") || t.includes("mascota") || t.includes("pasear"))
    return <Gamepad2 className="size-6" />;
  return <ListTodo className="size-6" />;
};

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    points: number;
    createdAt: Date | string;
    assignedToName?: string | null;
  };
  onDelete: (id: string) => void;
}

export const TaskCard = ({ task, onDelete }: TaskCardProps) => {
  return (
    <div className="bg-surface p-4 rounded-3xl border border-border shadow-sm flex items-center gap-4 active:scale-[0.99] transition-all relative overflow-hidden group hover:shadow-md">
      <div className="size-14 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 shrink-0 border border-sky-200">
        {getTaskIcon(task.title)}
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* titulo */}
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-foreground text-base leading-tight truncate pr-2">
            {task.title}
          </h3>
        </div>

        {/* asignado + puntos*/}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            {task.assignedToName ? (
              <div className="flex items-center gap-1.5 bg-gray-50 pr-2 rounded-full border border-gray-100">
                <UserAvatar name={task.assignedToName} className="size-5" />
                <span className="text-[10px] font-bold text-muted-foreground truncate max-w-20">
                  {task.assignedToName.split(" ")[0]}
                </span>
              </div>
            ) : (
              // para todos
              <div className="flex items-center gap-1.5 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                <Users className="size-3 text-indigo-500" />
                <span className="text-[10px] font-bold text-indigo-600">
                  Todos
                </span>
              </div>
            )}
          </div>

          <div className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg text-xs font-black border border-amber-200 shrink-0 flex items-center gap-1">
            <Coins className="size-3" />+{task.points}
          </div>
        </div>
      </div>
      {/* 3. BOTÓN BORRAR */}
      <div className="h-10 w-px bg-border mx-1" />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="size-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-90"
        title="Eliminar tarea"
      >
        <Trash2 className="size-5" />
      </button>
    </div>
  );
};
