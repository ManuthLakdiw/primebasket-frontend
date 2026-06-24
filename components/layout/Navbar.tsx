'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    ShoppingCartIcon,
    MagnifyingGlassIcon,
    Bars3Icon,
    XMarkIcon,
    UserCircleIcon,
    ChevronDownIcon,
    ArrowLeftOnRectangleIcon,
    SparklesIcon,
    LifebuoyIcon,
} from '@heroicons/react/24/outline';
import { headerAnimationVariant } from '@/util/animations';
import { useAuthStore } from '@/store/authStore';
import { AnimatePresence, motion } from "motion/react";
import { getAllPublicCategories } from "@/actions/category";
import {useCartStore} from "@/store/cartStore";

type Category = {
    id: number;
    name: string;
    description: string;
    productCount: number;
};

const createSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');



export default function Navbar() {
    const { user, isLoading, logout, loadUser } = useAuthStore();
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [catLoading, setCatLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const totalItems = useCartStore((state) => state.totalItems);


    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            closeMobileMenu();
        }
    };


    useEffect(() => {
        loadUser();
    }, [loadUser]);

    useEffect(() => {
        const fetchCategories = async () => {
            setCatLoading(true);
            try {
                const result = await getAllPublicCategories();
                if (result.success && result.data) {
                    setCategories(result.data);
                } else {
                    console.error('Failed to fetch categories', result.error);
                }
            } catch (error) {
                console.error('Network error', error);
            } finally {
                setCatLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
    const closeMobileMenu = () => setMobileMenuOpen(false);

    const getInitial = () => (user ? user.firstName[0].toUpperCase() : '?');

    return (
        <motion.header
            variants={headerAnimationVariant}
            initial="hidden"
            animate="visible"
            className="bg-white shadow-md sticky top-0 z-50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={toggleMobileMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-orange-500 hover:bg-orange-50 focus:outline-none lg:hidden"
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                        </button>
                        <Link href="/" className="flex-shrink-0 ml-2 lg:ml-0" onClick={closeMobileMenu}>
                            <span className="text-2xl font-bold text-orange-500">PrimeBasket</span>
                        </Link>
                    </div>

                    <div className="hidden lg:flex flex-1 justify-center px-6">
                        <form onSubmit={handleSearch} className="max-w-lg w-full relative">
                            <button type="button" onClick={(e) => handleSearch(e)} className="absolute inset-y-0 left-0 pl-3 flex items-center focus:outline-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 hover:text-orange-500 transition-colors" />
                            </button>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSearch(e);
                                    }
                                }}
                                placeholder="Search fresh vegetables, fruits…"
                                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            />
                        </form>
                    </div>

                    <div className="flex items-center space-x-5">
                        <Link href="/cart" className="relative text-gray-600 hover:text-orange-500 transition-colors">
                            <ShoppingCartIcon className="h-6 w-6" />
                            {totalItems > 0 && (
                                <motion.span
                                    key={totalItems}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-orange-500 rounded-full"
                                >
                                    {totalItems > 99 ? '99+' : totalItems}
                                </motion.span>
                            )}
                        </Link>

                        {isLoading ? (
                            <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full hidden lg:block" />
                        ) : user ? (
                            <div className="relative hidden lg:block" ref={profileMenuRef}>
                                <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center gap-2 focus:outline-none">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-200">
                                            <span className="text-xl font-bold text-orange-600">{getInitial()}</span>
                                        </div>
                                        {user.role === 'ADMIN' && (
                                            <div className="absolute -top-2 -right-1 bg-yellow-400 p-0.5 rounded-full shadow border-2 border-white">
                                                <SparklesIcon className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Hi, {user.firstName}</span>
                                    <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {profileMenuOpen && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full mt-3 w-52 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                                            <div className="px-4 py-2 border-b border-gray-100 mb-2">
                                                <p className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                            <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition" onClick={() => setProfileMenuOpen(false)}><UserCircleIcon className="w-5 h-5" /> Profile</Link>
                                            {user.role === 'ADMIN' && (
                                                <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition" onClick={() => setProfileMenuOpen(false)}><LifebuoyIcon className="w-5 h-5" /> Dashboard</Link>
                                            )}
                                            <button onClick={async () => { await logout(); setProfileMenuOpen(false); router.replace('/'); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left mt-1 pt-2 border-t border-gray-100"><ArrowLeftOnRectangleIcon className="w-5 h-5" /> Logout</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link href="/login" className="hidden lg:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none">Sign In</Link>
                        )}
                    </div>
                </div>
            </div>

            <nav className="hidden lg:block bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center gap-x-4 py-2">
                        {catLoading ? (
                            <div className="flex gap-4">{[...Array(6)].map((_, i) => <div key={i} className="h-4 w-16 bg-gray-100 animate-pulse rounded" />)}</div>
                        ) : (
                            <>
                                <Link href="/" className={`text-[11px] font-bold uppercase tracking-wide transition-colors ${pathname === '/' ? 'text-orange-600' : 'text-gray-500 hover:text-orange-600'}`}>Discover</Link>
                                {categories.map((cat) => {
                                    const slug = createSlug(cat.name);

                                    const isActive = pathname.includes(slug);
                                    return (
                                        <Link key={cat.id} href={`/category/${createSlug(cat.name)}`} className={`text-[11px] font-bold uppercase tracking-wide transition-colors hover:text-orange-600 whitespace-nowrap ${isActive ? 'text-orange-600' : 'text-gray-500'}`}>{cat.name}</Link>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="lg:hidden border-t border-gray-200 overflow-hidden bg-white">
                        <nav className="px-3 pt-3 pb-5 space-y-1 sm:px-4">
                            <div className="relative mb-4">
                                <form onSubmit={handleSearch} className="max-w-lg w-full relative">
                                    <button type="button" onClick={(e) => handleSearch(e)} className="absolute inset-y-0 left-0 pl-3 flex items-center focus:outline-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 hover:text-orange-500 transition-colors" />
                                    </button>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSearch(e);
                                            }
                                        }}
                                        placeholder="Search fresh vegetables, fruits…"
                                        className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                    />
                                </form>
                            </div>

                            {isLoading ? (
                                <div className="w-full h-12 bg-gray-200 animate-pulse rounded-md mb-4" />
                            ) : user ? (
                                <div className="p-3 bg-gray-50 rounded-lg mb-4 border border-gray-100">
                                    <p className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                    <div className="mt-2 flex gap-2">
                                        <Link href="/profile" className="text-xs text-blue-600 font-medium" onClick={closeMobileMenu}>Profile</Link>
                                        {user.role === 'ADMIN' && <Link href="/admin/dashboard" className="text-xs text-blue-600 font-medium" onClick={closeMobileMenu}>Dashboard</Link>}
                                        <button onClick={async () => { await logout(); closeMobileMenu(); router.replace('/'); }} className="text-xs text-red-600 font-medium">Logout</button>
                                    </div>
                                </div>
                            ) : (
                                <Link href="/login" className="block w-full text-center px-4 py-2.5 mt-2 text-base font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 transition" onClick={closeMobileMenu}>Sign In / Register</Link>
                            )}

                            <div className="mt-6">
                                <h3 className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shop By Category</h3>
                                <div className="space-y-1">
                                    {catLoading ? [1, 2, 3, 4].map((i) => <div key={i} className="h-8 bg-gray-100 animate-pulse rounded-md mb-1" />) :
                                        categories.map((cat) => {
                                            const slug = createSlug(cat.name);
                                            const isActive = pathname.includes(slug);

                                            return (
                                                <Link
                                                    key={cat.id}
                                                    href={`/category/${slug}`}
                                                    className={`block px-3 py-3 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-orange-600 bg-orange-50' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'}`}
                                                    onClick={closeMobileMenu}
                                                >
                                                    {cat.name}
                                                </Link>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}