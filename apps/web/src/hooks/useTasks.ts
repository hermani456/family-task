import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useTasks = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
                credentials: "include",
            });
            return res.json();
        },
    });

    const createTaskMutation = useMutation({
        mutationFn: async (newTask: { title: string; points: number }) => {
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

    return { ...query, createTaskMutation };
};