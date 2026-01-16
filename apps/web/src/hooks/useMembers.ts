import { useQuery } from "@tanstack/react-query";

export interface FamilyMember {
    userId: string;
    name: string;
    role: "PARENT" | "CHILD";
    avatar: string | null;
    balance: number;
}

export const useMembers = () => {
    return useQuery({
        queryKey: ["family-members"],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/families/members`, {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Error fetching members");
            return res.json() as Promise<FamilyMember[]>;
        },
    });
};