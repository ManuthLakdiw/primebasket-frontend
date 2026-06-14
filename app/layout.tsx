import "./globals.css";
import React from "react";
import {Toaster} from "react-hot-toast";

export default function RootLayout({children,}: Readonly<{children: React.ReactNode}>) {
    return (
        <html lang="en" className="h-full antialiased">
            <body className="h-full flex flex-col">
                <Toaster position="top-center" reverseOrder={false} />
                {children}
            </body>
        </html>
    );
}