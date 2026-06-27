'use client';

import { motion } from "motion/react";
import { tabAnimationVariant } from "@/util/animations";
import { OrderHistoryTab } from "@/components/profile/OrderHistoryTab";

export default function OrdersPage() {
    return (
        <motion.div
            variants={tabAnimationVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order History</h2>
            <OrderHistoryTab />
        </motion.div>
    );
}