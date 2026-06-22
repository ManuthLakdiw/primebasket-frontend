'use client';

import { motion } from "motion/react";
import { tabAnimationVariant } from "@/util/animations";
import { SecurityTab } from "@/components/profile/SecurityTab";
import { useAuthStore } from "@/store/authStore";

export default function SecurityPage() {
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <motion.div
            variants={tabAnimationVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Security & Login</h2>
            <SecurityTab user={user} />
        </motion.div>
    );
}