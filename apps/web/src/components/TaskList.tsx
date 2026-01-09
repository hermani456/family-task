import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useMembers } from "../hooks/useMembers";
import type { TaskWithAssignee } from "@family-task/shared";

interface TaskListProps {
  userRole: "PARENT" | "CHILD";
  userId: string;
}

export const TaskList = ({ userRole, userId }: TaskListProps) => {
  const {
    data: tasks,
    isLoading,
    createTaskMutation,
    updateStatusMutation,
  } = useTasks();
  const { data: members } = useMembers();

  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    createTaskMutation.mutate({
      title,
      points: 50,
      assignedToId: assignedTo || null,
    });
    setTitle("");
    setAssignedTo("");
  };

  if (isLoading) return <div className="p-4 text-center">Cargando...</div>;

  return (
    <div className="h-full flex flex-col">
      {userRole === "PARENT" && (
        <form
          onSubmit={handleCreate}
          className="mb-4 flex flex-col gap-2 bg-gray-50 p-3 rounded"
        >
          <input
            className="border p-2 rounded w-full"
            placeholder="Nueva tarea..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex gap-2">
            <select
              className="border p-2 rounded flex-1 text-sm"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">👤 Para cualquiera</option>
              {members?.map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.name}
                </option>
              ))}
            </select>
            <button className="bg-black text-white px-4 rounded text-sm font-bold">
              Crear
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3 overflow-y-auto flex-1 pr-2">
        {tasks?.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No hay tareas visibles para ti.
          </p>
        )}

        {tasks?.map((t: TaskWithAssignee) => {
          const isMine = t.assignedToId === userId;

          return (
            <div
              key={t.id}
              className="p-4 border rounded-xl shadow-sm flex justify-between items-center bg-white"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-lg">{t.title}</h4>
                  {t.assignedToName && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        isMine
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isMine ? "👤 TÚ" : `👤 ${t.assignedToName}`}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    t.status === "DONE"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {t.status.replace("_", " ")} ({t.points} pts)
                </span>
              </div>

              <div className="flex gap-2">
                {userRole === "CHILD" && (
                  <>
                    {t.status === "PENDING" && (
                      <button
                        onClick={() =>
                          updateStatusMutation.mutate({
                            taskId: t.id,
                            status: "IN_PROGRESS",
                          })
                        }
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
                      >
                        Empezar
                      </button>
                    )}
                    {t.status === "IN_PROGRESS" && (
                      <button
                        onClick={() =>
                          updateStatusMutation.mutate({
                            taskId: t.id,
                            status: "REVIEW",
                          })
                        }
                        className="px-3 py-1 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700"
                      >
                        Terminar
                      </button>
                    )}
                    {t.status === "REVIEW" && (
                      <span className="text-xs text-purple-600 animate-pulse">
                        En revisión...
                      </span>
                    )}
                  </>
                )}

                {userRole === "PARENT" && t.status === "REVIEW" && (
                  <>
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({
                          taskId: t.id,
                          status: "PENDING",
                        })
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      ✖
                    </button>
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({
                          taskId: t.id,
                          status: "DONE",
                        })
                      }
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm font-bold hover:bg-green-700"
                    >
                      ✓ Aprobar
                    </button>
                  </>
                )}

                {t.status === "DONE" && <span className="text-2xl">✅</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
