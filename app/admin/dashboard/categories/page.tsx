'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import CategoryModal from '@/components/admin/CategoryModal';
import Pagination from '@/components/ui/Pagination';
import {
    createCategoryAction,
    deleteCategoryAction,
    getAllCategoriesAction,
    updateCategoryAction,
} from "@/actions/category";
import { showConfirmToast } from "@/components/ui/confirmToast";

type Category = {
    id: number;
    name: string;
    description?: string;
    productCount: number;
};

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const loadData = useCallback(async () => {
        setLoading(true);
        const response = await getAllCategoriesAction(currentPage, 9);
        if (response.success) {
            setCategories(response.data.content);
            setTotalPages(response.data.totalPages);
        } else {
            toast.error(response.error || "Failed to load");
        }
        setLoading(false);
    }, [currentPage]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleAdd = useCallback(() => {
        setEditingCategory(null);
        setModalOpen(true);
    }, []);

    const handleEdit = useCallback((cat: Category) => {
        setEditingCategory(cat);
        setModalOpen(true);
    }, []);

    const executeDelete = useCallback(async (id: number) => {
        const loadingToast = toast.loading('Deleting category...');

        const response = await deleteCategoryAction(id);

        if (response.success) {
            toast.success('Category deleted', { id: loadingToast });
            loadData();
        } else {
            toast.error(response.error || 'Failed to delete', { id: loadingToast, duration: 500 });
        }
    }, [loadData]);

    const handleDelete = useCallback((id: number) => {
        console.log("Deleting category with ID:", id);
        showConfirmToast({
            title: "Delete Category",
            message: "Do you really want to delete this category? This cannot be undone.",
            onConfirm: () => executeDelete(id),
        });
    }, [executeDelete]);

    const handleSave = useCallback(async (data: { name: string; description?: string }) => {
        const response = editingCategory
            ? await updateCategoryAction(editingCategory.id, data)
            : await createCategoryAction(data);

        if (response.success) {
            toast.success(editingCategory ? 'Updated!' : 'Created!');
            setModalOpen(false);
            loadData();
        } else {
            toast.error(response.error || 'Operation failed');
        }
    }, [editingCategory, loadData]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
                    <p className="text-sm text-gray-500">Manage your product categories</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="inline-flex items-center px-4 py-2.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add New Category
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500 text-center py-20">Loading categories...</p>
            ) : categories.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500">No categories found. Please add a new category.</p>
                </div>
            ) :(
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                                        {cat.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2">
                                        {cat.description}
                                    </p>
                                    <p className="mt-3 text-xs font-medium text-orange-500">
                                        {cat.productCount === 0 ? 'No products yet' : `${cat.productCount} Products`}
                                    </p>
                                </div>
                                <div className="mt-4 flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleEdit(cat)}
                                        className="p-1.5 text-gray-400 hover:text-orange-500 transition-colors rounded-md hover:bg-orange-50"
                                        title="Edit"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
                                        title="Delete"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage + 1}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page - 1)}
                    />
                </>
            )}

            <CategoryModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                initialData={editingCategory ? { name: editingCategory.name, description: editingCategory.description } : { name: '', description: '' }}
            />
        </div>
    );
}