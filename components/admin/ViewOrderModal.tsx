'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, CreditCardIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { getOrderDetailsAction } from "@/actions/order";
import toast from 'react-hot-toast';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    order: any | null;
};

export default function ViewOrderModal({ isOpen, onClose, order }: Props) {
    const [fullDetails, setFullDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && order?.id) {
            setLoading(true);
            getOrderDetailsAction(order.id)
                .then((res) => {
                    if (res.success) {
                        setFullDetails(res.data);
                    } else {
                        toast.error(res.error || "Failed to load order items");
                    }
                })
                .catch(() => toast.error("Network error while loading order details"))
                .finally(() => setLoading(false));
        } else {
            setFullDetails(null);
        }
    }, [isOpen, order]);

    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-[2px]" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col transform transition-all">

                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Order Details - {order.orderNumber}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Manage details and customer invoice structure</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors">
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
                        </div>
                    ) : fullDetails ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Information</h4>
                                    <div className="text-sm font-medium text-gray-800 flex items-center gap-2"><UserIcon className="w-4 h-4 text-gray-400"/> {fullDetails.customerName}</div>
                                    <div className="text-sm text-gray-600 flex items-center gap-2"><EnvelopeIcon className="w-4 h-4 text-gray-400"/> {fullDetails.customerEmail}</div>
                                    <div className="text-sm text-gray-600 flex items-center gap-2">
                                        <PhoneIcon className="w-4 h-4 text-gray-400"/>
                                        {fullDetails.customerPhone || <span className="text-gray-400 italic">Not added yet</span>}
                                    </div>
                                </div>
                                <div className="space-y-2 border-t md:border-t-0 md:border-l border-gray-200 pt-2 md:pt-0 md:pl-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery Address</h4>
                                    <div className="text-sm text-gray-700 flex items-start gap-2">
                                        <MapPinIcon className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0"/>
                                        <div>
                                            <p className="font-semibold text-xs text-orange-600 uppercase mb-0.5">{fullDetails.shippingAddress?.addressType || 'SHIPPING'}</p>
                                            <p className="text-gray-600">{fullDetails.shippingAddress?.street}, {fullDetails.shippingAddress?.city}, {fullDetails.shippingAddress?.district}, {fullDetails.shippingAddress?.postalCode}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Purchased Items</h4>
                                <div className="space-y-2.5">
                                    {fullDetails.items?.map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-4 bg-white border border-gray-100 p-3 rounded-xl hover:border-gray-200 transition-colors">
                                            <img src={item.imageUrl || '/placeholder.png'} alt={item.productName} className="h-12 w-12 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-gray-800 truncate">{item.productName}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Rs. {item.unitPrice.toFixed(2)} × {item.quantity}</p>
                                            </div>
                                            <div className="text-sm font-bold text-gray-900">
                                                Rs. {item.lineTotal.toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row justify-between gap-4 items-start">
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-xs font-medium text-gray-600">
                                    <CreditCardIcon className="w-4 h-4 text-gray-400"/>
                                    <span>Payment: <strong className="text-gray-800 uppercase">{fullDetails.paymentStatus}</strong></span>
                                </div>
                                <div className="w-full sm:w-72 space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-500"><span>Subtotal</span><span className="font-medium text-gray-800">Rs. {fullDetails.itemsTotal?.toFixed(2)}</span></div>
                                    <div className="flex justify-between text-gray-500"><span>Delivery Fee</span><span className="font-medium text-gray-800">Rs. {fullDetails.deliveryFee?.toFixed(2)}</span></div>
                                    <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                                        <span>Total Amount</span><span className="text-orange-600">Rs. {fullDetails.finalTotal?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-sm text-gray-400 py-6">Could not load structured details for this order.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function UserIcon({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
}