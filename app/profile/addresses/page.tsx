'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { tabAnimationVariant } from '@/util/animations';
import { AddressesTab } from '@/components/profile/AddressesTab';
import { useAuthStore } from '@/store/authStore';
import { motion } from "motion/react";
import AddressModal from "@/components/profile/AddressModal";
import {AddressFormValues} from "@/util/validations";
import {Address} from "@/components/profile/AddressModal";
import {addAddressAction, deleteAddressAction, updateAddressAction} from "@/actions/user";
import {showConfirmToast} from "@/components/ui/ConfirmToast";

export default function AddressesPage() {
    const { user, loadUser } = useAuthStore();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const addresses: Address[] = user?.addresses || [];
    const existingTypes = addresses.map((a) => a.addressType);
    const maxReached = addresses.length >= 3;

    const handleAdd = () => {
        if (maxReached) return;
        setEditingAddress(null);
        setModalOpen(true);
    };

    const handleEdit = (addr: Address) => {
        setEditingAddress(addr);
        setModalOpen(true);
    };

    const handleDelete = (addr: Address) => {
        showConfirmToast({
            title: `Delete ${addr.addressType} Address?`,
            message: "Are you sure you want to delete this address? You can add it back later.",
            confirmText: "Delete",
            onConfirm: async () => {
                const toastId = toast.loading("Deleting address...");

                const res = await deleteAddressAction(addr.addressType);

                if (res.success) {
                    toast.success(res.message || "Address deleted", { id: toastId });
                    await loadUser();
                } else {
                    toast.error(res.error || "Failed to delete", { id: toastId });
                }
            }
        });
    };

    const handleSave = async (data: AddressFormValues) => {
        const toastId = toast.loading(editingAddress ? "Updating address..." : "Adding address...");

        if (editingAddress) {
            const res = await updateAddressAction(data);
            if (res.success) {
                toast.success(res.message || "Address updated successfully", { id: toastId });
                await loadUser();
            } else {
                toast.error(res.error || "Failed to update", { id: toastId });
            }
        } else {
            const res = await addAddressAction(data);
            if (res.success) {
                toast.success(res.message || "Address added successfully", { id: toastId });
                await loadUser();
            } else {
                toast.error(res.error || "Failed to add", { id: toastId });
            }
        }

        setModalOpen(false);
        setEditingAddress(null);
    };

    if (!user) return null;

    return (
        <motion.div
            variants={tabAnimationVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
                {!maxReached && (
                    <button
                        onClick={handleAdd}
                        className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
                    >
                        + Add New
                    </button>
                )}
                {maxReached && (
                    <span className="text-sm text-gray-400">Maximum addresses reached</span>
                )}
            </div>

            <AddressesTab
                addresses={addresses}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAdd}
                maxReached={maxReached}
            />

            <AddressModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                existingTypes={existingTypes}
                editingAddress={editingAddress}
            />
        </motion.div>
    );
}