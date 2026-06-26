'use client';

import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {
    XMarkIcon,
    HomeIcon,
    TagIcon,
    Squares2X2Icon,
    UsersIcon,
    ShoppingBagIcon,
    ChartBarIcon,
    ArrowRightOnRectangleIcon,
    TicketIcon,
} from '@heroicons/react/24/outline';
import {useAuthStore, User} from "@/store/authStore";

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Categories', href: '/admin/dashboard/categories', icon: TagIcon },
    { name: 'Products', href: '/admin/dashboard/products', icon: Squares2X2Icon },
    { name: 'Users', href: '/admin/dashboard/users', icon: UsersIcon },
    { name: 'Orders', href: '/admin/dashboard/orders', icon: ShoppingBagIcon },
    { name: 'Reports', href: '/admin/dashboard/reports', icon: ChartBarIcon },
];

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: Props) {
    const pathname = usePathname();
    const {user, logout } = useAuthStore((state) => state!);
    const router = useRouter();

    const sidebarContent = (
        <>
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                <Link href="/" className="text-xl font-bold text-orange-500" onClick={onClose}>
                    PrimeBasket
                </Link>
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            prefetch={false}
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                                isActive
                                    ? 'bg-orange-50 text-orange-600'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-orange-500'
                            }`}
                        >
                            <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-gray-200 px-4 py-4">
                <div className="flex items-center mb-3">
                    <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                        A
                    </div>
                    <div className="ml-3 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{user?.email}</p>
                        <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                </div>
                <button
                    onClick={async () => {
                        await logout()
                        router.replace('/');
                    }}
                    className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                    Logout
                </button>
            </div>
        </>
    );

    return (
        <>
            <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-30 bg-white border-r border-gray-200">
                {sidebarContent}
            </aside>
            <div
                className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {sidebarContent}
            </div>
        </>
    );
}