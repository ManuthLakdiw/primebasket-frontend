'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    XMarkIcon,
    PlusCircleIcon,
    MinusCircleIcon,
} from '@heroicons/react/24/outline';
import Toggle from './Toggle';
import { ProductFormValues, productSchema } from '@/util/validations';
import { getCategoriesForDropdownAction } from "@/actions/category";
import {createProductAction, updateProductAction} from "@/actions/produts";
import toast from "react-hot-toast";
import { uploadImageToCloudinary } from "@/util/cloudinary";

export type ProductData = {
    id?: number;
    sku: string;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    images: string[];
    isFeatured: boolean;
    isActive: boolean;
    attributes: Record<string, string>;
    categoryId: string;
    salePrice?: number;
    saleStartDate?: string;
    saleEndDate?: string;
};

type CategoryDropdown = {
    id: number;
    name: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ProductData) => void;
    initialProduct: ProductData | null;
};

export default function ProductModal({ isOpen, onClose, onSave, initialProduct }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [categories, setCategories] = useState<CategoryDropdown[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: '', sku: '', description: '', price: 0, stockQuantity: 0, categoryId: '',
            salePrice: '', saleStartDate: '', saleEndDate: '',
            images: [], isFeatured: false, isActive: true, attributes: [{ key: '', value: '' }]
        },
        mode: "onTouched"
    });

    const { fields: attrFields, append: appendAttr, remove: removeAttr, replace: replaceAttr } = useFieldArray({
        control,
        name: "attributes"
    });
    const watchImages = watch('images') || [];
    const watchIsFeatured = watch('isFeatured');
    const watchIsActive = watch('isActive');

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [isOpen]);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoadingCategories(true);
            const response = await getCategoriesForDropdownAction();

            if (response.success && response.data) {
                setCategories(response.data);
            } else {
                console.error("Failed to load categories", response.error);
            }
            setIsLoadingCategories(false);
        };

        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    useEffect(() => {
        if (initialProduct && isOpen && categories.length > 0) {
            const mappedAttributes = Object.keys(initialProduct.attributes || {}).length > 0
                ? Object.entries(initialProduct.attributes).map(([k, v]) => ({ key: k, value: v }))
                : [{ key: '', value: '' }];
            reset({
                name: initialProduct.name,
                sku: initialProduct.sku,
                description: initialProduct.description,
                price: initialProduct.price,
                salePrice: initialProduct.salePrice ?? undefined,
                saleStartDate: initialProduct.saleStartDate ?? '',
                saleEndDate: initialProduct.saleEndDate ?? '',
                stockQuantity: initialProduct.stockQuantity,
                categoryId: initialProduct.categoryId,
                images: initialProduct.images || [],
                isFeatured: initialProduct.isFeatured,
                isActive: initialProduct.isActive,
                attributes: mappedAttributes
            });
            replaceAttr(mappedAttributes);
        } else if (isOpen && !initialProduct) {
            reset({
                name: '', sku: '', description: '', price: 0, stockQuantity: 0, categoryId: '',
                salePrice: '', saleStartDate: '', saleEndDate: '',
                images: [], isFeatured: false, isActive: true, attributes: [{ key: '', value: '' }]
            });
            replaceAttr([{ key: '', value: '' }]);
        }
    }, [initialProduct, isOpen, reset, categories]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (watchImages.length >= 5) return;

        setIsUploadingImage(true);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const folderName = watch('sku') || 'new-product';
        const uploadedUrl = await uploadImageToCloudinary(file, folderName, controller.signal);

        if (uploadedUrl) {
            setValue('images', [...watchImages, uploadedUrl], { shouldValidate: true });
        } else {
            if (!controller.signal.aborted)
                toast.error("Failed to upload image. Please try again." + (fileInputRef.current ? " (File size may be too large)" : ""));
        }

        setIsUploadingImage(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (index: number) => {
        const newImages = watchImages.filter((_, i) => i !== index);
        setValue('images', newImages, { shouldValidate: true });
    };

    const onSubmit = async (data: ProductFormValues) => {
        let response;

        if (initialProduct && initialProduct.id) {
            response = await updateProductAction(initialProduct.id, data);
        } else {
            response = await createProductAction(data);
        }

        if (response.success) {
            toast.success(initialProduct ? "Product updated successfully!" : "Product created successfully!");
            onSave(data as unknown as ProductData);
        } else {
            toast.error(response.error || (initialProduct ? "Failed to update product" : "Failed to create product"));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] mx-4 flex flex-col overflow-hidden">
                <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {initialProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8 flex-1 overflow-y-auto">
                    <section className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2">
                            Product Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name *</label>
                                    <input
                                        {...register('name')}
                                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 sm:text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">SKU *</label>
                                    <input
                                        {...register('sku')}
                                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 sm:text-sm ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description *</label>
                                    <textarea
                                        {...register('description')}
                                        rows={3}
                                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 sm:text-sm ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category *</label>
                                    <select
                                        {...register('categoryId')}
                                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-orange-500 sm:text-sm ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
                                </div>
                            </div>

                            {/* Right Column – Stock only here, pricing section follows */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Stock Quantity *</label>
                                    <input
                                        type="number"
                                        {...register('stockQuantity')}
                                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 sm:text-sm ${errors.stockQuantity ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.stockQuantity && <p className="text-red-500 text-xs mt-1">{errors.stockQuantity.message}</p>}
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2">
                            Pricing & Sale Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Price & Sale Price */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price (LKR) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register('price')}
                                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 sm:text-sm ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Sale Price (LKR) <span className="text-gray-400">(optional)</span></label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register('salePrice')}
                                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 sm:text-sm ${errors.salePrice ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Leave empty if no sale"
                                    />
                                    {errors.salePrice && <p className="text-red-500 text-xs mt-1">{errors.salePrice.message}</p>}
                                </div>
                            </div>

                            {/* Sale Start & End */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Sale Start</label>
                                        <input
                                            type="datetime-local"
                                            {...register('saleStartDate')}
                                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 sm:text-sm ${errors.saleStartDate ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.saleStartDate && <p className="text-red-500 text-xs mt-1">{errors.saleStartDate.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Sale End</label>
                                        <input
                                            type="datetime-local"
                                            {...register('saleEndDate')}
                                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 sm:text-sm ${errors.saleEndDate ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.saleEndDate && <p className="text-red-500 text-xs mt-1">{errors.saleEndDate.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2">
                            Product Images
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            {watchImages.map((img, index) => (
                                <div key={index} className="relative group w-24 h-24 rounded-md overflow-hidden border border-gray-200">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}

                            <label className={`w-24 h-24 border-2 border-dashed rounded-md flex items-center justify-center transition-colors 
                                ${watchImages.length >= 5 ? 'bg-gray-50 cursor-not-allowed border-gray-200 text-gray-300' : 'border-gray-300 text-gray-400 hover:border-orange-500 hover:text-orange-500 cursor-pointer'}`}>
                                {watchImages.length < 5 && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        disabled={isUploadingImage}
                                    />
                                )}
                                {isUploadingImage ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                                ) : (
                                    <PlusCircleIcon className="h-6 w-6" />
                                )}
                            </label>
                        </div>
                        {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images.message}</p>}
                    </section>
                    <section className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2">
                            Settings
                        </h4>
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Featured</label>
                                <Toggle checked={watchIsFeatured} onChange={(val) => setValue('isFeatured', val, { shouldValidate: true })} />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Active</label>
                                <Toggle checked={watchIsActive} onChange={(val) => setValue('isActive', val, { shouldValidate: true })} />
                            </div>
                        </div>
                    </section>
                    <section className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2">
                            Custom Attributes
                        </h4>
                        <div className="space-y-2">
                            {attrFields.map((field, idx) => (
                                <div key={field.id} className="flex items-start gap-2">
                                    <div className="flex-1">
                                        <input
                                            {...register(`attributes.${idx}.key` as const)}
                                            placeholder="Key (e.g., Weight)"
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 sm:text-sm ${errors.attributes?.[idx]?.key ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.attributes?.[idx]?.key && <p className="text-red-500 text-xs mt-1">{errors.attributes[idx]?.key?.message}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            {...register(`attributes.${idx}.value` as const)}
                                            placeholder="Value (e.g., 1kg)"
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 sm:text-sm ${errors.attributes?.[idx]?.value ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.attributes?.[idx]?.value && <p className="text-red-500 text-xs mt-1">{errors.attributes[idx]?.value?.message}</p>}
                                    </div>
                                    {attrFields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeAttr(idx)}
                                            className="text-gray-400 hover:text-red-500 mt-2.5"
                                        >
                                            <MinusCircleIcon className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {errors.attributes?.message && <p className="text-red-500 text-xs mt-1">{errors.attributes.message}</p>}
                        </div>
                        <button
                            type="button"
                            onClick={() => appendAttr({ key: '', value: '' })}
                            className="inline-flex items-center text-sm text-orange-500 hover:text-orange-600 mt-2"
                        >
                            <PlusCircleIcon className="h-4 w-4 mr-1" /> Add Attribute
                        </button>
                    </section>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isUploadingImage}
                            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md hover:bg-orange-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : (isUploadingImage ? 'Uploading...' : (initialProduct ? 'Update' : 'Create'))}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}