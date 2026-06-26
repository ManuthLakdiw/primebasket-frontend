'use client';

import {
    Bars3Icon,
    UserCircleIcon,
    ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

type Props = {
    onMenuClick: () => void;
};

export default function Header({ onMenuClick }: Props) {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="lg:hidden -ml-2 p-2 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        onClick={onMenuClick}
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    <Link
                        href="/"
                        className="hidden sm:inline-flex items-center text-sm text-gray-500 hover:text-orange-500 transition-colors"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Back to Home
                    </Link>
                </div>

                <p className="hidden md:block text-sm text-gray-600">{today}</p>

                <div className="flex items-center gap-4">
                    <Link href={'/profile'} className="flex items-center text-sm text-gray-500 hover:text-orange-500 transition-colors">
                        <UserCircleIcon className="h-8 w-8" />
                        <span className="ml-2 hidden sm:inline">Admin</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}