'use client';

import { useState } from "react";
import toast from "react-hot-toast";
import { User, useAuthStore } from "@/store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, PersonalInfoValues } from "@/util/validations";
import { updateMyDetailsAction } from "@/actions/user";

export function PersonalInfoTab({ user }: { user: User }) {
    const [saving, setSaving] = useState(false);


    const loadUser = useAuthStore((state) => state.loadUser);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty }
    } = useForm<PersonalInfoValues>({
        resolver: zodResolver(personalInfoSchema),
        mode: 'onTouched',
        defaultValues: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            telephone: user.telephone || '',
        }
    });

    const onSubmit = async (data: PersonalInfoValues) => {
        setSaving(true);
        try {
            const response = await updateMyDetailsAction(
                data.firstName,
                data.lastName,
                data.telephone
            );

            if (response.success) {
                toast.success("Profile updated successfully!");
                await loadUser();
            } else {
                toast.error(response.error || "Failed to update profile");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        {...register("firstName")}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
                            errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        {...register("lastName")}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
                            errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Telephone</label>
                    <input
                        type="text"
                        {...register("telephone")}
                        placeholder="+94 XX XXX XXXX"
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
                            errors.telephone ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.telephone && (
                        <p className="mt-1 text-sm text-red-600">{errors.telephone.message}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={!isDirty || saving}
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}