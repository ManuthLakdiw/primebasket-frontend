'use client';

import { motion } from "motion/react";
import { tabAnimationVariant } from "@/util/animations";
import { PersonalInfoTab } from "@/components/profile/PersonalInfoTab";
import { useAuthStore } from "@/store/authStore";
export default function PersonalPage() {
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <motion.div
            variants={tabAnimationVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
            <PersonalInfoTab user={user} />
        </motion.div>
    );
}