'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
    MapPinIcon,
    PhoneIcon,
    ShoppingBagIcon,
    EnvelopeIcon,
    ArrowLeftIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as SolidCheckCircle } from '@heroicons/react/24/solid';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import {Address} from "@/components/profile/AddressModal";
import {updateMyDetailsAction} from "@/actions/user";
import {createOrderAction} from "@/actions/order";


export default function CheckoutPage() {
    const router = useRouter();
    const { items, fetchCart, isLoading: isCartLoading } = useCartStore();

    const [selectedItemsIds, setSelectedItemsIds] = useState<number[]>([]);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
    const [phone, setPhone] = useState('');
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const { user, loadUser, isLoading: isAuthLoading } = useAuthStore();
    const [isSavingPhone, setIsSavingPhone] = useState(false);
    const [phoneError, setPhoneError] = useState('');

    const shippingFee = Number(process.env.NEXT_PUBLIC_SHIPPING_FEE || 400);

    useEffect(() => {
        if (!isAuthLoading) {
            if (!user) {
                router.push('/login');
                return;
            }
            if (user.telephone) {
                setPhone(user.telephone);
            }

            const savedSelections = sessionStorage.getItem('cart-selected-items');
            if (savedSelections) {
                setSelectedItemsIds(JSON.parse(savedSelections));
            } else {
                router.push('/cart');
            }

            fetchCart().finally(() => setIsPageLoading(false));
        }
    }, [user, isAuthLoading, router, fetchCart]);

    const cartItems = useMemo(() =>
            items.filter((item) => selectedItemsIds.includes(item.id)),
        [items, selectedItemsIds]);

    const subtotal = useMemo(() =>
            cartItems.reduce((sum, item) => sum + item.subTotal, 0),
        [cartItems]);

    const totalQuantity = useMemo(() =>
            cartItems.reduce((sum, item) => sum + item.quantity, 0),
        [cartItems]);

    const total = cartItems.length > 0 ? subtotal + shippingFee : 0;
    const addresses: Address[] = user?.addresses || [];

    const handleSavePhone = async () => {
        const phoneRegex = /^\+94\s?\d{2}\s?\d{3}\s?\d{4}$/;

        if (!phoneRegex.test(phone.trim())) {
            setPhoneError("Phone number must be in +94 format (e.g. +94 77 123 4567)");
            return;
        }

        setPhoneError('');
        if (!user) return;

        setIsSavingPhone(true);
        try {
            const response = await updateMyDetailsAction(
                user.firstName || '',
                user.lastName || '',
                phone
            );

            if (response.success) {
                toast.success("Phone number saved!");
                await loadUser();
                setIsEditingPhone(false);
            } else {
                toast.error(response.error || "Failed to update phone number");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSavingPhone(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (addresses.length === 0) {
            toast.error('Please add a delivery address in your profile.');
            return;
        }

        if (!user?.telephone || isEditingPhone) {
            toast.error('Please save your contact phone number.');
            return;
        }

        const deliveryAddress = addresses[selectedAddressIndex];

        const payload = {
            cartItemIds: selectedItemsIds,
            shippingAddress: deliveryAddress
        };

        try {
            const res = await createOrderAction(payload);
            if (res.success) {
                toast.success('Order placed successfully!');
                sessionStorage.removeItem('cart-selected-items');
                router.replace(`/order-confirmation?orderNumber=${res.data}`);
            } else {
                toast.error(res.error || 'Order failed');
            }
        } catch (error) {
            toast.error('Network error, please try again.');
        }
    };

    if (isAuthLoading || isPageLoading || isCartLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <ShoppingBagIcon className="h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700">No items selected for checkout</h2>
                <button onClick={() => router.push('/cart')} className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-xl shadow hover:bg-orange-600 transition">
                    Return to Cart
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 bg-gray-50/50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Secure Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

               <div className="lg:col-span-7 space-y-6">

                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <span className="bg-orange-100 text-orange-500 p-2 rounded-lg">1</span>
                            Contact Information
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                                <EnvelopeIcon className="h-6 w-6 text-gray-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</p>
                                    <p className="text-gray-900 font-medium truncate">{user?.email}</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                                <PhoneIcon className="h-6 w-6 text-gray-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Mobile Number</p>
                                    {!user?.telephone || isEditingPhone ? (
                                        <div className="flex flex-col gap-2">
                                            {/* 🌟 Mobile Responsive Flex Row */}
                                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => {
                                                        setPhone(e.target.value);
                                                        if (phoneError) setPhoneError('');
                                                    }}
                                                    placeholder="+94 XX XXX XXXX"
                                                    disabled={isSavingPhone}
                                                    className={`w-full sm:flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm transition-colors ${
                                                        phoneError ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                />
                                                <button
                                                    onClick={handleSavePhone}
                                                    disabled={isSavingPhone}
                                                    className="w-full sm:w-auto px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                                                >
                                                    {isSavingPhone ? 'Saving...' : 'Save'}
                                                </button>
                                            </div>
                                            {phoneError && (
                                                <p className="text-xs text-red-500">{phoneError}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                                            <p className="text-gray-900 font-medium truncate">{phone}</p>
                                            <button onClick={() => setIsEditingPhone(true)} className="self-start sm:self-auto text-sm font-semibold text-orange-500 hover:text-orange-600 whitespace-nowrap">
                                                Change
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                <span className="bg-orange-100 text-orange-500 p-2 rounded-lg">2</span>
                                Delivery Address
                            </h2>
                            {addresses.length > 0 && (
                                <button onClick={() => router.push('/profile/addresses')} className="text-sm font-semibold text-orange-500 hover:text-orange-600">
                                    Manage Addresses
                                </button>
                            )}
                        </div>

                        {addresses.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {addresses.map((addr, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedAddressIndex(idx)}
                                        className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                                            selectedAddressIndex === idx
                                                ? 'border-orange-500 bg-orange-50/30 shadow-md shadow-orange-100'
                                                : 'border-gray-200 hover:border-orange-300 bg-white'
                                        }`}
                                    >
                                        {selectedAddressIndex === idx && (
                                            <SolidCheckCircle className="absolute top-4 right-4 h-6 w-6 text-orange-500" />
                                        )}
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPinIcon className="h-5 w-5 text-gray-500" />
                                            <p className="font-bold text-gray-900 uppercase tracking-wide text-sm">{addr.addressType}</p>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed mt-2 pr-6">
                                            {addr.street},<br/>
                                            {addr.city}, {addr.district},<br/>
                                            {addr.postalCode}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <MapPinIcon className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                                <h3 className="text-gray-800 font-medium mb-1">No Delivery Address</h3>
                                <p className="text-sm text-gray-500 mb-5">Please add an address to continue with your order.</p>
                                <button
                                    onClick={() => router.push('/profile/addresses')}
                                    className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition shadow-sm"
                                >
                                    Add New Address
                                </button>
                            </div>
                        )}
                    </section>
                </div>

                <div className="lg:col-span-5">
                    <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100 p-6 sm:p-8 sticky top-28">

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <ShoppingBagIcon className="h-6 w-6 text-orange-500" />
                                Order Summary
                            </h2>
                            <Link href="/cart" className="text-sm font-semibold text-gray-500 hover:text-orange-500 flex items-center gap-1 transition">
                                <ArrowLeftIcon className="h-4 w-4" />
                                Edit Cart
                            </Link>
                        </div>

                        <p className="text-sm font-medium text-gray-500 mb-4 pb-4 border-b border-gray-100">
                            {cartItems.length} Product Types • {totalQuantity} Total Items
                        </p>

                        <ul className="divide-y divide-gray-100 mb-6 max-h-[35vh] overflow-y-auto custom-scrollbar pr-2">
                            {cartItems.map((item) => (
                                <li key={item.id} className="py-4 flex gap-4 items-center">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 border border-gray-100 relative overflow-hidden flex-shrink-0">
                                        {item.images?.[0] ? (
                                            <Image src={item.images[0]} alt={item.productName} fill className="object-cover p-1" />
                                        ) : (
                                            <ShoppingBagIcon className="w-8 h-8 m-auto text-gray-300 mt-4" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 leading-snug mb-1">
                                            {item.productName}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500 font-medium">
                                            {item.quantity} x Rs. {item.unitPrice.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-sm sm:text-base font-bold text-gray-900 flex-shrink-0">
                                        Rs. {item.subTotal.toFixed(2)}
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="space-y-3 border-t border-gray-100 pt-5 bg-gray-50/50 p-4 rounded-xl mb-6">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-semibold text-gray-900">Rs. {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Shipping Fee (Island-wide)</span>
                                <span className="font-semibold text-gray-900">Rs. {shippingFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-end border-t border-gray-200 pt-3 mt-2">
                                <span className="text-base font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-black text-orange-500">Rs. {total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={addresses.length === 0 || !user?.telephone || isEditingPhone}
                            className="w-full py-4 bg-orange-500 text-white text-lg font-bold rounded-xl hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                        >
                            Place Order
                        </button>

                        <p className="mt-4 text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                            <CheckCircleIcon className="h-4 w-4" />
                            Secure checkout powered by PrimeBasket
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}