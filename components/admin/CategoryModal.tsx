'use client';

import { useState, useEffect, FormEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {CategoryFormValues, categorySchema} from "@/util/validations";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string; description?: string}) => void;
    initialData: { name: string; description?: string };
};

export default function CategoryModal({ isOpen, onClose, onSave, initialData }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: initialData,
        mode: "onTouched"
    });

    useEffect(() => {
        reset(initialData);
    }, [initialData, reset]);

    const onSubmit = (data: CategoryFormValues) => {
        onSave(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
                onClick={onClose}
            />
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 transform transition-all">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {initialData.name ? 'Edit Category' : 'Add New Category'}
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="cat-name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            {...register("name")}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="e.g., Dairy Products"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description <span className={"text-xs text-gray-500"}>(optional)</span></label>
                            <textarea
                                {...register("description")}
                                rows={3}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                placeholder="Brief description"
                            />
                        </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md hover:bg-orange-600 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : (initialData.name ? 'Update' : 'Create')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}