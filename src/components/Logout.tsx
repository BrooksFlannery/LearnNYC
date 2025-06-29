'use client'

import { authClient } from "~/lib/auth-client";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function Logout() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const handleLogout = () => {
        // 1. Optimistically leave the authenticated UI
        router.replace("/login");

        // 2. Clear any cached authed data
        queryClient.clear();

        // 3. Fire the sign-out request in the background
        void authClient.signOut().catch((err) => {
            console.error("signOut failed", err);
        });
    };

    return (
        <Button variant="outline" onClick={handleLogout}>
            Logout <LogOut className="size-4" />
        </Button>
    );
} 