'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {AnimatePresence, motion } from "motion/react";
import {AddressFormValues, addressSchema} from "@/util/validations";
import {modalAnimationVariant, overlayAnimationVariant} from "@/util/animations";

export type Address = {
    id?: string;
    addressType: AddressFormValues['addressType'];
    street: string;
    city: string;
    district: string;
    postalCode: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: AddressFormValues) => void;
    existingTypes: Address['addressType'][];
    editingAddress?: Address | null;
};

const allTypes: Address['addressType'][] = ['HOME', 'OFFICE', 'OTHER'];

export default function AddressModal({
                                         isOpen,
                                         onClose,
                                         onSave,
                                         existingTypes,
                                         editingAddress,
                                     }: Props) {
    const isEdit = !!editingAddress;

    const availableTypes = isEdit
        ? allTypes
        : allTypes.filter((type) => !existingTypes.includes(type));

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        mode: "onTouched",
        defaultValues: {
            addressType: editingAddress?.addressType ?? availableTypes[0] ?? 'HOME',
            street: '',
            city: '',
            district: '',
            postalCode: '',
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (editingAddress) {
                reset({
                    addressType: editingAddress.addressType,
                    street: editingAddress.street,
                    city: editingAddress.city,
                    district: editingAddress.district,
                    postalCode: editingAddress.postalCode,
                });
            } else {

                reset({
                    addressType: 'HOME',
                    street: '',
                    city: '',
                    district: '',
                    postalCode: '',
                });
            }
        }
    }, [isOpen, editingAddress, reset]);

    const onSubmit = (data: AddressFormValues) => {
        onSave(data);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        variants={overlayAnimationVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute inset-0 bg-gray-900 bg-opacity-50"
                        onClick={onClose}
                    />
                    <motion.div
                        variants={modalAnimationVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>

                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {isEdit ? 'Edit Address' : 'Add New Address'}
                        </h3>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Address Type
                                </label>
                                <select
                                    {...register('addressType')}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-orange-500 sm:text-sm ${
                                        errors.addressType ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    {availableTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type.charAt(0) + type.slice(1).toLowerCase()}
                                        </option>
                                    ))}
                                    {availableTypes.length === 0 && (
                                        <option value="" disabled>
                                            No available types
                                        </option>
                                    )}
                                </select>
                                {errors.addressType && (
                                    <p className="text-red-500 text-xs mt-1">{errors.addressType.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Street</label>
                                <input
                                    {...register('street')}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 sm:text-sm ${
                                        errors.street ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.street && (
                                    <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <input
                                        {...register('city')}
                                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 sm:text-sm ${
                                            errors.city ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.city && (
                                        <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">District</label>
                                    <input
                                        {...register('district')}
                                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 sm:text-sm ${
                                            errors.district ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.district && (
                                        <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                                <input
                                    {...register('postalCode')}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 sm:text-sm ${
                                        errors.postalCode ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.postalCode && (
                                    <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
                                    className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}