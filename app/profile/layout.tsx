'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    UserIcon,
    ShieldCheckIcon,
    MapPinIcon,
    ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import AuthHeader from "@/components/auth/AuthHeader";
import { useAuthStore } from "@/store/authStore";
import {useEffect} from "react";

function ProfileAvatar({ firstName, lastName }: { firstName: string; lastName: string }) {
    const initials = `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase();
    return (
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold shadow-md ring-4 ring-white">
            {initials || '?'}
        </div>
    );
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/login');
        }
    }, [isLoading, user, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    const tabs = [
        { href: '/profile/personal', label: 'Personal Info', icon: UserIcon },
        { href: '/profile/security', label: 'Security & Login', icon: ShieldCheckIcon },
        { href: '/profile/addresses', label: 'Addresses', icon: MapPinIcon },
        { href: '/profile/orders', label: 'Order History', icon: ShoppingBagIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <AuthHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                 <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <ProfileAvatar firstName={user.firstName} lastName={user.lastName} />
                    <div className="text-center sm:text-left mt-2 sm:mt-0">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                        <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {
                                user.role === 'ADMIN' ? 'Administrator' : 'Customer'
                            }
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    <nav className="lg:w-64 flex-shrink-0">
                        <ul className="space-y-1">
                            {tabs.map((tab) => {
                                const isActive = pathname === tab.href;
                                return (
                                    <li key={tab.href}>
                                        <Link
                                            href={tab.href}
                                            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-white text-orange-600 shadow-sm ring-1 ring-gray-200/50'
                                                    : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                                            }`}
                                        >
                                            <tab.icon className={`h-5 w-5 mr-3 flex-shrink-0 ${isActive ? 'text-orange-500' : 'text-gray-400'}`} />
                                            {tab.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 min-h-[500px]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}