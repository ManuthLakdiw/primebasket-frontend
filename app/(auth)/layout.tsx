import React from "react";
import AuthHeader from "@/components/auth/AuthHeader";

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
           <AuthHeader/>
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                {children}
            </main>
        </div>
    );
}