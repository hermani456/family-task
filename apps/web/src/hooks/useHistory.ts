import { useQuery } from "@tanstack/react-query";
import type { Transaction } from "@family-task/shared";

export const useHistory = () => {
    return useQuery<Transaction[]>({
        queryKey: ["history"],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/history`, {
                credentials: "include",
            });
            return res.json();
        },
        refetchInterval: 5000,
    });
};