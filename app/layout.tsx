import "./globals.css";
import React from "react";
import {Toaster} from "react-hot-toast";
import AuthProvider from "@/components/AuthProvider";
import {GoogleOAuthProvider} from "@react-oauth/google";

export default function RootLayout({children,}: Readonly<{children: React.ReactNode}>) {
    return (
        <html lang="en" className="h-full antialiased">
            <body className="h-full">
            <AuthProvider>
                <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID!}>
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            style: {
                                background: '#ffffff',
                                color: '#374151',
                                fontSize: '14px',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #e5e7eb',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#f97316',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                        reverseOrder={false}
                    />
                    {children}
                </GoogleOAuthProvider>
            </AuthProvider>

            </body>
        </html>
    );
}