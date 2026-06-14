'use client';

import { motion } from "motion/react";
import Link from "next/link";
import React from "react";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { headerAnimationVariant } from "@/util/animations";

export default function AuthHeader() {
    const router = useRouter();

    const handleBackHome = () => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="text-sm">Are you sure you want to leave? Your progress will be lost.</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            router.push('/');
                        }}
                        className="bg-orange-500 text-white px-3 py-1 rounded text-xs"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-gray-200 px-3 py-1 rounded text-xs"
                    >
                        No
                    </button>
                </div>
            </div>
        ), { duration: 6000 });
    };

    return (
        <motion.header
            variants={headerAnimationVariant}
            initial="hidden"
            animate="visible"
            className="bg-white border-b border-gray-200"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-orange-500">
                    PrimeBasket
                </Link>

                <button
                    onClick={handleBackHome}
                    className="text-sm text-gray-500 hover:text-orange-500 transition-colors"
                >
                    &larr; Back to Home
                </button>
            </div>
        </motion.header>
    );
}