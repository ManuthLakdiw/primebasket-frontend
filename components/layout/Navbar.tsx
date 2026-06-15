'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ShoppingCartIcon,
    MagnifyingGlassIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from "motion/react";
import {headerAnimationVariant} from "@/util/animations";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
    const closeMobileMenu = () => setMobileMenuOpen(false);

    const categories = ['Vegetables', 'Fruits', 'Cakes', 'Biscuits'];

    return (
        <motion.header
            variants={headerAnimationVariant}
            initial="hidden"
            animate="visible"
            className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={toggleMobileMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-orange-500 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 lg:hidden"
                            aria-expanded={mobileMenuOpen}
                            aria-label="Toggle navigation"
                        >
                            {mobileMenuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>

                        <Link
                            href="/"
                            className="flex-shrink-0 ml-2 lg:ml-0"
                            onClick={closeMobileMenu}
                        >
              <span className="text-2xl font-bold text-orange-500">
                PrimeBasket
              </span>
                        </Link>
                    </div>

                    <div className="hidden lg:flex flex-1 justify-center px-6">
                        <div className="max-w-lg w-full relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for fresh vegetables, fruits…"
                                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            href="/cart"
                            className="relative text-gray-600 hover:text-orange-500 transition-colors"
                        >
                            <ShoppingCartIcon className="h-6 w-6" />
                            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-orange-500 rounded-full">
                3
              </span>
                        </Link>

                        <Link
                            href="/login"
                            className="hidden lg:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>

            <nav className="hidden lg:block bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center space-x-8 h-12">
                        {categories.map((category) => (
                            <Link
                                key={category}
                                href={`/category/${category.toLowerCase()}`}
                                className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors duration-200"
                            >
                                {category}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="lg:hidden border-t border-gray-200 overflow-hidden"
                    >
                        <nav className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-white">

                            <div className="relative mb-3">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search products…"
                                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                />
                            </div>

                            {categories.map((category) => (
                                <Link
                                    key={category}
                                    href={`/category/${category.toLowerCase()}`}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                                    onClick={closeMobileMenu}
                                >
                                    {category}
                                </Link>
                            ))}

                            <Link
                                href="/login"
                                className="block w-full text-center px-3 py-2 mt-2 text-base font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors"
                                onClick={closeMobileMenu}
                            >
                                Sign In
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}