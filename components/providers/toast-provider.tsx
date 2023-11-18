"use client";

import { Toaster } from "@/components/ui/toaster";

export default function ToastProvider({ children }: { children: React.ReactNode }) {
    return (
        <Toaster />
    );
};