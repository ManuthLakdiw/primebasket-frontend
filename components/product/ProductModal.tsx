'use client';

import { useState } from "react";
import {AnimatePresence, motion } from "motion/react";
import { XMarkIcon, ShoppingCartIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import {useAuthStore} from "@/store/authStore";
import {useCartStore} from "@/store/cartStore";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {CheckCircleIcon} from "@heroicons/react/24/solid";

const ImageSlider = ({ images }: { images: string[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400 rounded-lg">No image</div>;
    if (images.length === 1) return (
        <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
            <Image src={images[0]} alt="Product" fill unoptimized={true} className="object-contain p-4" sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
    );

    return (
        <div className="relative w-full aspect-square group bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
            <Image src={images[currentIndex]} alt="Product" fill unoptimized={true} className="object-contain p-4 transition-opacity duration-300" sizes="(max-width: 768px) 100vw, 50vw" />
            <button onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-sm text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><ChevronLeftIcon className="h-5 w-5" /></button>
            <button onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-sm text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><ChevronRightIcon className="h-5 w-5" /></button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, idx) => <div key={idx} className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-orange-500' : 'bg-gray-300'}`} />)}
            </div>
        </div>
    );
};

export default function ProductModal({
                                         basicProduct,
                                         sectionId = 'default',
                                         onClose
                                     }: {
    basicProduct: any,
    sectionId?: string,
    onClose: () => void
}) {
    const displayProduct = basicProduct;
    const outOfStock = displayProduct.stockQuantity <= 0;
    const isLowStock = displayProduct.stockStatus === "LOW_STOCK";
    const { user } = useAuthStore();
    const { items, addToCart } = useCartStore();
    const router = useRouter();


    const cardLayoutId = `product-card-${sectionId}-${basicProduct.id}`;
    const imageLayoutId = `product-image-${sectionId}-${basicProduct.id}`;
    const titleLayoutId = `product-title-${sectionId}-${basicProduct.id}`;

    const isInCart = items.some(item => item.productId === Number(displayProduct.id));


    const handleAddToCart = async () => {
        if (!user) {
            toast.error("Please login to add items to cart");
            setTimeout(() => router.push('/login'), 1000);
            return;
        }

        const success = await addToCart(Number(displayProduct.id), 1);
        if (success) {
            toast.success("Added to cart!");
        } else {
            toast.error("Failed to add to cart");
        }
    };

    const handleViewCart = () => {
        onClose();
        router.push('/cart');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" />

            <motion.div
                layoutId={cardLayoutId}
                className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors z-20">
                    <XMarkIcon className="h-5 w-5" />
                </button>

                <div className="overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                        <motion.div layoutId={imageLayoutId} className="w-full">
                            <ImageSlider images={displayProduct.images} />
                        </motion.div>

                        <div className="flex flex-col gap-6">
                            <div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {displayProduct.isOnSale && <span className="bg-red-500 text-white text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Sale</span>}
                                    {displayProduct.isFeatured && <span className="bg-yellow-400 text-black text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Featured</span>}

                                    {outOfStock ? (
                                        <span className="bg-gray-200 text-gray-700 text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Out of Stock</span>
                                    ) : isLowStock ? (
                                        <span className="bg-orange-500 text-white text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Low Stock</span>
                                    ) : (
                                        <span className="bg-green-100 text-green-700 text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">In Stock</span>
                                    )}
                                </div>

                                <motion.h2 layoutId={titleLayoutId} className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                    {displayProduct.name}
                                </motion.h2>
                                <p className="text-sm text-gray-500">SKU: {displayProduct.sku}</p>
                            </div>

                            <div className="flex items-end gap-3 border-b border-gray-100 pb-6">
                                {displayProduct.isOnSale && displayProduct.sellingPrice != null ? (
                                    <>
                                        <span className="text-3xl font-bold text-orange-500">Rs. {displayProduct.sellingPrice.toFixed(2)}</span>
                                        <span className="text-lg line-through text-gray-400">Rs. {(displayProduct.originalPrice || 0).toFixed(2)}</span>
                                    </>
                                ) : (
                                    <span className="text-3xl font-bold text-orange-500">Rs. {(displayProduct.originalPrice || 0).toFixed(2)}</span>
                                )}
                            </div>

                            <p className="text-gray-600 leading-relaxed">
                                {displayProduct.description || "No description available for this product."}
                            </p>

                            {displayProduct.attributes && Object.keys(displayProduct.attributes).length > 0 && (
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <h4 className="font-semibold text-gray-900 mb-3">Specifications</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                                        {Object.entries(displayProduct.attributes).map(([key, val]) => (
                                            <div key={key} className="flex justify-between border-b border-gray-200 pb-1 last:border-0">
                                                <span className="text-gray-500">{key}:</span>
                                                <span className="font-medium text-gray-900">{val as string}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto pt-4 relative overflow-hidden min-h-[60px]">
                                <AnimatePresence mode="wait">
                                    {isInCart ? (
                                        <motion.button
                                            key="view-cart"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -20, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            onClick={handleViewCart}
                                            className="w-full py-3.5 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-all bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                                        >
                                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                            View Cart
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            key="add-to-cart"
                                            initial={{ y: -20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: 20, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            onClick={handleAddToCart}
                                            disabled={outOfStock}
                                            className={`w-full py-3.5 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-all ${
                                                outOfStock
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200'
                                            }`}
                                        >
                                            <ShoppingCartIcon className="h-5 w-5" />
                                            {outOfStock ? 'Currently Unavailable' : 'Add to Cart'}
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}