'use client';

import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { motion } from "motion/react";
import Image from "next/image";

type Product = {
    id: string;
    sku: string;
    name: string;
    description: string;
    originalPrice: number;
    sellingPrice?: number;
    isOnSale: boolean;
    images: string[];
    stockQuantity: number;
    stockStatus: string;
    isFeatured: boolean;
    attributes: Record<string, string>;
};

type Props = {
    product: Product;
    onClick: (product: Product, sectionId: string) => void;
    sectionId?: string;
};

export default function ProductCard({ product, onClick, sectionId = 'default' }: Props) {
    const outOfStock = product.stockQuantity <= 0;
    const isLowStock = product.stockStatus === "LOW_STOCK";

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        alert('Added to cart!');
    };

    const cardLayoutId = `product-card-${sectionId}-${product.id}`;
    const imageLayoutId = `product-image-${sectionId}-${product.id}`;
    const titleLayoutId = `product-title-${sectionId}-${product.id}`;


    return (
        <motion.div
            layoutId={cardLayoutId}
            whileHover={{ y: -5 }}
            className="h-full flex group cursor-pointer"
            onClick={() => onClick(product, sectionId)}
        >
            <div className="flex flex-col w-full bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-orange-100 transition-all duration-300">

                <motion.div layoutId={imageLayoutId} className="aspect-square bg-gray-50 relative overflow-hidden">
                    <Image
                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.net/default.svg'}
                        alt={product.name}
                        fill
                        unoptimized={true}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 items-start">
                        {product.isOnSale && (
                            <span className="bg-red-500 text-white text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">Sale</span>
                        )}
                        {product.isFeatured && (
                            <span className="bg-yellow-400 text-black text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">Featured</span>
                        )}
                        {isLowStock && !outOfStock && (
                            <span className="bg-orange-500 text-white text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">Low Stock</span>
                        )}
                    </div>

                    {outOfStock && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px] z-20">
                            <span className="bg-gray-900 text-white text-xs px-4 py-1.5 rounded-full font-semibold shadow-md uppercase tracking-widest">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </motion.div>

                <div className="p-4 flex-grow flex flex-col bg-white">
                    <motion.h3 layoutId={titleLayoutId} className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight mb-3 group-hover:text-orange-600 transition-colors flex-grow">                        {product.name}
                    </motion.h3>

                    <div className="flex items-center flex-wrap gap-2 mt-auto">
                        {product.isOnSale && product.sellingPrice != null ? (
                            <>
                                <span className="text-lg font-bold text-orange-500">
                                    Rs. {product.sellingPrice.toFixed(2)}
                                </span>
                                <span className="text-xs line-through text-gray-400">
                                    Rs. {(product.originalPrice || 0).toFixed(2)}
                                </span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-orange-500">
                                Rs. {(product.originalPrice || 0).toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>

                <div className="px-4 pb-4 bg-white">
                    <button
                        onClick={handleAddToCart}
                        disabled={outOfStock}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                            outOfStock
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                : 'bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white border border-orange-100 hover:border-orange-500 shadow-sm'
                        }`}
                    >
                        <ShoppingCartIcon className="h-4 w-4" />
                        {outOfStock ? 'Unavailable' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}