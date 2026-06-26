import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import React, {Suspense} from "react";

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
            </Suspense>
                {children}
            <Footer />
        </>
    );
}
