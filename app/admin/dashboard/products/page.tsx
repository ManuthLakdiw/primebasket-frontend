'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';
import ProductModal, { ProductData } from '@/components/admin/ProductModal';
import Toggle from '@/components/admin/Toggle';
import Pagination from '@/components/ui/Pagination';
import {
    deleteProductAction,
    getAllProductsAction,
    toggleProductActiveAction,
    toggleProductFeaturedAction
} from '@/actions/produts';
import {ImageSlider} from "@/components/ui/ImageSlider";
import {ViewProductModal} from "@/components/admin/ViewProductModal";
import {showConfirmToast} from "@/components/ui/ConfirmToast";


export type Category = {
    id: number;
    name: string;
};

export type Product = {
    id: number;
    sku: string;
    name: string;
    description: string;
    originalPrice: number;
    sellingPrice: number;
    isOnSale: boolean;
    stockQuantity: number;
    stockStatus: string;
    images: string[];
    attributes: Record<string, string>;
    isFeatured: boolean;
    isActive: boolean;
    category: Category;
};

const ITEMS_PER_PAGE = 4;

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [viewingProductId, setViewingProductId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadProducts = useCallback(async (page: number) => {
        setLoading(true);
        const res = await getAllProductsAction(page - 1, ITEMS_PER_PAGE);
        if (res.success && res.data) {
            setProducts(res.data.data.content);
            setTotalPages(Math.max(1, res.data.data.totalPages));
        } else {
            toast.error(res.error || 'Failed to load products');
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadProducts(currentPage);
    }, [currentPage, loadProducts]);


    const handleAdd = useCallback(() => {
        setEditingProduct(null);
        setModalOpen(true);
    }, []);

    const handleEdit = useCallback((product: Product) => {
        setEditingProduct(product);
        setModalOpen(true);
    }, []);

    const handleView = useCallback((id: number) => {
        setViewingProductId(id);
    }, []);

    const executeDelete = useCallback(async (id: number) => {
        const loadingToast = toast.loading('Deleting product...');

        const response = await deleteProductAction(id);

        if (response.success) {
            toast.success('Product deleted successfully', { id: loadingToast });
            await loadProducts(currentPage);
        } else {
            toast.error(response.error || 'Failed to delete product', { id: loadingToast, duration: 500 });
        }
    }, [loadProducts, currentPage]);


    const handleDelete = useCallback((id: number) => {
        showConfirmToast({
            title: "Delete Product",
            message: "Do you really want to delete this product? This cannot be undone.",
            onConfirm: () => executeDelete(id),
        });
    }, [executeDelete]);

    const handleSave = async (formData: ProductData) => {
        setCurrentPage(currentPage);
        await loadProducts(currentPage);
        setModalOpen(false);
    };

    const handleToggleFeatured = async (product: Product) => {
        const newStatus = !product.isFeatured;

        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isFeatured: newStatus } : p));

        const res = await toggleProductFeaturedAction(product.id, newStatus);

        if (res.success) {
            toast.success(newStatus ? "Product marked as Featured" : "Product removed from Featured");
        } else {
            setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isFeatured: product.isFeatured } : p));
            toast.error(res.error || "Failed to update featured status");
        }
    };

    const handleToggleActive = async (product: Product) => {
        const newStatus = !product.isActive;

        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isActive: newStatus } : p));

        const res = await toggleProductActiveAction(product.id, newStatus);

        if (res.success) {
            toast.success(newStatus ? "Product marked as Active" : "Product marked as Inactive");
        } else {
            setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isActive: product.isActive } : p));
            toast.error(res.error || "Failed to update active status");
        }
    };

    const stockConfig: Record<string, { label: string; color: string }> = {
        IN_STOCK: { label: 'In Stock', color: 'bg-green-100 text-green-800' },
        LOW_STOCK: { label: 'Low Stock', color: 'bg-orange-100 text-orange-800' },
        OUT_OF_STOCK: { label: 'Out of Stock', color: 'bg-red-100 text-red-800' }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                    <p className="text-sm text-gray-500">Manage your product catalogue</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="inline-flex items-center px-4 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-orange-600 transition-colors"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add New Product
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>
            ) : products.length === 0 ? (
                <p className="text-center py-20 text-gray-500">No products found. Add a new product to get started.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">

                                <div className="relative w-full aspect-square bg-gray-50 border-b border-gray-100">
                                    <ImageSlider images={product.images} />

                                    {product.isOnSale && (
                                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm z-10">
                                            SALE
                                        </span>
                                    )}
                                    {(() => {
                                        const stockBadge = stockConfig[product.stockStatus] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
                                        return (
                                            <span className={`absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shadow-sm z-10 ${stockBadge.color}`}>
                            {stockBadge.label}
                        </span>
                                        );
                                    })()}
                                </div>

                                <div className="p-4 flex-1 flex flex-col">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1" title={product.name}>
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1 truncate">{product.sku}</p>
                                        <p className="text-xs text-orange-500 font-medium mt-0.5">{product.category.name}</p>

                                        <div className="mt-3 flex items-baseline gap-2">
                                            <span className="text-xl font-bold text-gray-900">Rs. {product.sellingPrice.toFixed(2)}</span>
                                            {product.isOnSale && (
                                                <span className="text-sm line-through text-gray-400">Rs. {product.originalPrice.toFixed(2)}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4">
                                        {/* Toggles */}
                                        <div className="flex items-center justify-between gap-2 text-sm bg-gray-50 px-2 py-1.5 rounded-md border border-gray-100 mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-gray-600 text-xs">Featured</span>
                                                <Toggle checked={product.isFeatured} onChange={() => handleToggleFeatured(product)} />
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-gray-600 text-xs">Active</span>
                                                <Toggle checked={product.isActive} onChange={() => handleToggleActive(product)} />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                                            <button onClick={() => handleView(product.id)} className="flex items-center text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors">
                                                <EyeIcon className="h-4 w-4 mr-1" /> View Details
                                            </button>
                                            <div className="flex gap-1">
                                                <button onClick={() => handleEdit(product)} className="p-1.5 text-gray-400 hover:text-orange-500 rounded-md hover:bg-orange-50 transition-colors" title="Edit">
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors" title="Delete">
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            )}
            <ProductModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                initialProduct={editingProduct ? {
                    id: editingProduct.id,
                    sku: editingProduct.sku,
                    name: editingProduct.name,
                    description: editingProduct.description,
                    price: editingProduct.originalPrice,
                    salePrice: editingProduct.isOnSale ? editingProduct.sellingPrice : undefined,
                    stockQuantity: editingProduct.stockQuantity,
                    images: editingProduct.images,
                    isFeatured: editingProduct.isFeatured,
                    isActive: editingProduct.isActive,
                    attributes: editingProduct.attributes,
                    categoryId: editingProduct.category.id.toString(),
                } : null}
            />

            {viewingProductId && (
                <ViewProductModal
                    productId={viewingProductId}
                    onClose={() => setViewingProductId(null)}
                />
            )}
        </div>
    );
}