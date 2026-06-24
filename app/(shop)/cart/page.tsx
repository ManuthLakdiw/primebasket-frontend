'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ShoppingBagIcon,
    TrashIcon,
    MinusIcon,
    PlusIcon,
    ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, totalPrice, totalItems, isLoading, fetchCart } = useCartStore();
    const { user, isLoading: isAuthLoading } = useAuthStore();
    const router = useRouter();
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const shippingFee = Number(process.env.NEXT_PUBLIC_SHIPPING_FEE || 400);

    useEffect(() => {
        if (!isAuthLoading) {
            if (!user) {
                router.push('/login');
            } else {
                fetchCart().finally(() => setIsPageLoading(false));
            }
        }
    }, [user, isAuthLoading, router, fetchCart]);

    useEffect(() => {
        if (items.length > 0 && selectedItems.length === 0) {
            setSelectedItems(items.map(item => item.id));
        } else if (items.length === 0) {
            setSelectedItems([]);
        }
    }, [items.length]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedItems(items.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id: number) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleRemoveItem = async (id: number) => {
        await removeFromCart(id);
        setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    };

    const selectedSubtotal = items
        .filter(item => selectedItems.includes(item.id))
        .reduce((total, item) => total + item.subTotal, 0);

    const selectedTotalItems = items
        .filter(item => selectedItems.includes(item.id))
        .reduce((count, item) => count + item.quantity, 0);

    const isAllSelected = items.length > 0 && selectedItems.length === items.length;

    const finalTotal = selectedItems.length > 0 ? selectedSubtotal + shippingFee : 0;

    if (isAuthLoading || isPageLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center max-w-md w-full">
                    <div className="mx-auto w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                        <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven&apos;t added any products yet.</p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-medium rounded-xl shadow-sm hover:bg-orange-600 transition-colors"
                    >
                        Continue Shopping
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative">

            {isLoading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-2xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
            )}

            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({totalItems})</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            className="w-5 h-5 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                        />
                        <span className="font-semibold text-gray-700">Select All Items</span>
                    </div>
                    <AnimatePresence>
                        {items.map((item) => {
                            const { id, productName, images, unitPrice, quantity, subTotal, availableStock } = item;
                            const maxReached = quantity >= availableStock;

                            const isSelected = selectedItems.includes(id);

                            return (
                                <motion.div
                                    key={id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                                    className={`bg-white rounded-2xl shadow-sm border p-4 sm:p-5 flex gap-4 items-center transition-colors ${
                                        isSelected ? 'border-orange-200 bg-orange-50/30' : 'border-gray-100'
                                    }`}
                                >

                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleSelectItem(id)}
                                        className="w-5 h-5 flex-shrink-0 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                                    />

                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden">
                                        {images && images.length > 0 ? (
                                            <Image
                                                src={images[0]}
                                                alt={productName}
                                                width={112}
                                                height={112}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <ShoppingBagIcon className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2 mb-1">
                                            {productName}
                                        </h3>

                                        <div className="flex items-baseline gap-2 mb-3">
                                            <span className="text-lg font-bold text-orange-500">
                                                Rs. {unitPrice.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 mt-2">
                                            <div className="flex items-center">
                                                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white">

                                                    <button
                                                        onClick={() => updateQuantity(id, quantity - 1)}
                                                        disabled={quantity <= 1 || isLoading}
                                                        className="p-1.5 sm:p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <MinusIcon className="w-4 h-4" />
                                                    </button>

                                                    <span className="px-3 sm:px-4 text-sm font-medium text-gray-800 min-w-[2.5rem] text-center select-none border-x border-gray-100">
                                                        {quantity}
                                                    </span>

                                                    <button
                                                        onClick={() => updateQuantity(id, quantity + 1)}
                                                        disabled={maxReached || isLoading}
                                                        className="p-1.5 sm:p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <PlusIcon className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {maxReached && (
                                                    <span className="ml-3 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full uppercase tracking-wider">
                                                        Max Stock
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-semibold text-gray-900 hidden sm:block">
                                                    Rs. {subTotal.toFixed(2)}
                                                </span>
                                                <button
                                                    onClick={() => handleRemoveItem(id)}
                                                    disabled={isLoading}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    aria-label={`Remove ${productName}`}
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* 🌟 මෙතැන් සිට වෙනස් කර ඇත (Order Summary) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal ({selectedTotalItems} items)</span>
                                <span className="font-medium text-gray-900">Rs. {selectedSubtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping (Island-wide)</span>
                                <span className="font-medium text-gray-900">
                                    Rs. {selectedItems.length > 0 ? shippingFee.toFixed(2) : "0.00"}
                                </span>
                            </div>

                            <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                                <span className="text-base font-semibold text-gray-800">Total</span>
                                <span className="text-2xl font-bold text-orange-500">Rs. {finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                sessionStorage.setItem('cart-selected-items', JSON.stringify(selectedItems));
                                router.push('/checkout');
                            }}
                            disabled={isLoading || selectedItems.length === 0}
                            className="mt-8 w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Proceed to Checkout {selectedItems.length > 0 ? `(${selectedItems.length})` : ''}
                            <ArrowRightIcon className="w-4 h-4" />
                        </button>

                        <p className="mt-4 text-xs text-gray-400 text-center">
                            Secure checkout powered by PrimeBasket
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}