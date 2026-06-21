import { useEffect, useState } from "react";
import { getProductById } from "@/actions/produts";
import toast from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ImageSlider } from "@/components/ui/ImageSlider";
import { Product } from "@/app/admin/dashboard/products/page";

const stockConfig: Record<string, { label: string; color: string }> = {
    IN_STOCK: { label: 'In Stock', color: 'bg-green-100 text-green-800' },
    LOW_STOCK: { label: 'Low Stock', color: 'bg-orange-100 text-orange-800' },
    OUT_OF_STOCK: { label: 'Out of Stock', color: 'bg-red-100 text-red-800' }
};

export const ViewProductModal = ({ productId, onClose }: { productId: number; onClose: () => void }) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            const res = await getProductById(productId);
            if (res.success && res.data) {
                setProduct(res.data);
            } else {
                toast.error("Failed to load product details");
            }
            setLoading(false);
        };
        fetchDetails();
    }, [productId]);

    if (!productId) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900 bg-opacity-60" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800">Product Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        </div>
                    ) : product ? (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Slider Section */}
                                <div className="relative w-full md:w-1/2 flex-shrink-0 aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                                    <ImageSlider images={product.images} />
                                </div>

                                {/* Details Section */}
                                <div className="w-full md:w-1/2 space-y-4">
                                    <div>
                                        <div className="text-sm text-orange-500 font-semibold mb-1">{product.category.name}</div>
                                        <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                                        <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
                                    </div>

                                    {/* Pricing */}
                                    <div className="flex items-end gap-3">
                                        <span className="text-3xl font-bold text-gray-900">Rs. {product.sellingPrice.toFixed(2)}</span>
                                        {product.isOnSale && (
                                            <span className="text-lg text-gray-400 line-through mb-1">Rs. {product.originalPrice.toFixed(2)}</span>
                                        )}
                                    </div>

                                    {/* Stock Status Badge */}
                                    <div>
                                        {(() => {
                                            // 2. අදාළ Status එකට ගැළපෙන Config එක ගන්නවා
                                            const stockBadge = stockConfig[product.stockStatus] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
                                            return (
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${stockBadge.color}`}>
                                                    {stockBadge.label} <span className="ml-1 opacity-75">({product.stockQuantity} items)</span>
                                                </span>
                                            );
                                        })()}
                                    </div>

                                    <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                                </div>
                            </div>

                            {/* Attributes Table */}
                            {Object.keys(product.attributes || {}).length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-semibold text-gray-900 mb-3 border-b pb-2">Specifications</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                        {Object.entries(product.attributes).map(([key, value]) => (
                                            <div key={key} className="flex justify-between border-b border-gray-50 py-2">
                                                <span className="text-gray-500 text-sm">{key}</span>
                                                <span className="text-gray-900 text-sm font-medium">{value as string}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-center text-red-500">Product not found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};