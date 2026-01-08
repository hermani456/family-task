import { useQuery } from "@tanstack/react-query";
import { authClient } from "../lib/auth-client";

interface MyFamilyData {
    family: {
        memberId: string;
        role: "PARENT" | "CHILD";
        balance: number;
        familyId: string;
        familyName: string;
        inviteCode: string;
    } | null;
}

export const useMyFamily = () => {
    const session = authClient.useSession();

    return useQuery({
        queryKey: ["my-family"],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/family`, {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Error fetching family");
            return res.json() as Promise<MyFamilyData>;
        },
        enabled: !!session.data,
    });
};