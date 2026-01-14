import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "../lib/auth-client";
import type { Family, Member, User } from "@family-task/shared";

export interface MyFamilyData {
    family: Family;
    member: Member & { user: User };
}

export const useMyFamily = () => {
    const session = authClient.useSession();

    return useQuery<MyFamilyData | null>({
        queryKey: ["my-family"],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/family`, {
                credentials: "include",
            });

            if (res.status === 401) return null;
            if (!res.ok) throw new Error("Error fetching family");

            return res.json();
        },
        enabled: !!session.data,
        retry: false,
    });
};

export const useCreateFamily = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { name: string }) => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/families`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error("Error creating family");
            }

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-family"] });
        },
    });
};

export const useJoinFamily = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { code: string }) => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/families/join`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Código inválido");
            }

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-family"] });
        },
    });
}