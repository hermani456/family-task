import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TaskWithAssignee } from "@family-task/shared";

export const useTasks = () => {
    return useQuery<TaskWithAssignee[]>({
        queryKey: ["tasks"],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Error fetching tasks");
            return res.json();
        },
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newTask: { title: string; points: number; assignedToId?: string | null }) => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(newTask),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Error al crear la tarea");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
};

export const useUpdateTaskStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || "Error updating task");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });

            queryClient.invalidateQueries({ queryKey: ["my-family"] });
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (taskId: string) => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || "Error al eliminar la tarea");
            }
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
};