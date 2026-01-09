import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Reward } from "@family-task/shared";

export const useRewards = () => {
    const queryClient = useQueryClient();

    const query = useQuery<Reward[]>({
        queryKey: ["rewards"],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rewards`, { credentials: "include" });
            return res.json();
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: { title: string; cost: number }) => {
            await fetch(`${import.meta.env.VITE_API_URL}/api/rewards`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rewards"] }),
    });

    const redeemMutation = useMutation({
        mutationFn: async (rewardId: string) => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rewards/${rewardId}/redeem`, {
                method: "POST",
                credentials: "include",
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rewards"] });
            queryClient.invalidateQueries({ queryKey: ["my-family"] });
        },
    });

    return { ...query, createMutation, redeemMutation };
};