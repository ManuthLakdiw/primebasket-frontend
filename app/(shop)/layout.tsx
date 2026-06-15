import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import React from "react";

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <>
            <Navbar />
                {children}
            <Footer />
        </>
    );
}