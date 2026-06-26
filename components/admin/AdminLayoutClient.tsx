'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayoutClient({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen flex overflow-hidden bg-gray-50">
            <div
                className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
                <div
                    className="absolute inset-0 bg-gray-600 opacity-75"
                    onClick={() => setSidebarOpen(false)}
                />
            </div>

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}