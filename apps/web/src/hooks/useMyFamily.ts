import { useQuery } from "@tanstack/react-query";
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