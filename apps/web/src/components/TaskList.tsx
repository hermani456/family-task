import { useState } from "react";
import { useTasks } from "../hooks/useTasks";

interface Task {
  id: string;
  title: string;
  points: number;
  status: "PENDING" | "IN_PROGRESS" | "REVIEW" | "DONE" | "REJECTED";
}

export const TaskList = () => {
  const { data: tasks, isLoading, createTaskMutation } = useTasks();
  const [title, setTitle] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    createTaskMutation.mutate({ title, points: 50 });
    setTitle("");
  };

  if (isLoading) return <div>Cargando tareas...</div>;

  return (
    <div className="h-full flex flex-col">
      <form onSubmit={handleCreate} className="mb-4 flex gap-2">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Nueva tarea..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="bg-black text-white px-4 rounded font-bold">
          +
        </button>
      </form>

      <div className="space-y-2 overflow-y-auto flex-1">
        {tasks?.length === 0 && (
          <p className="text-gray-400 text-center">No hay tareas aún.</p>
        )}

        {tasks?.map((t: Task) => (
          <div
            key={t.id}
            className="bg-white p-3 border rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <h4 className="font-medium">{t.title}</h4>
              <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                {t.points} pts
              </span>
            </div>
            <span
              className={`text-xs font-bold ${
                t.status === "DONE" ? "text-green-600" : "text-gray-400"
              }`}
            >
              {t.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
