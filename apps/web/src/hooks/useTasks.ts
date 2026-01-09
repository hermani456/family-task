import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TaskWithAssignee } from "@family-task/shared"; 

export const useTasks = () => {
    const queryClient = useQueryClient();

    const query = useQuery<TaskWithAssignee[]>({
        queryKey: ["tasks"],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
                credentials: "include",
            });
            return res.json();
        },
    });

    const createTaskMutation = useMutation({
        mutationFn: async (newTask: { title: string; points: number; assignedToId?: string | null }) => {
            await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(newTask),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Error updating task");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["my-family"] });
        },
        onError: (err) => alert(err.message),
    });

    return { ...query, createTaskMutation, updateStatusMutation };
};