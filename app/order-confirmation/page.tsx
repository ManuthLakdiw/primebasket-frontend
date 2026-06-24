'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    CheckCircleIcon,
    DocumentArrowDownIcon,
    ShoppingBagIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
} from '@heroicons/react/24/outline';

export default function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('orderNumber') || 'Your Order';

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircleIcon className="w-10 h-10 text-green-500 animate-[bounce_1s_ease-in-out_2]" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Thank You for Your Order!
                </h1>
                <p className="text-gray-500 mb-6">
                    A confirmation email has been sent. Your order is being processed.
                </p>

                <div className="inline-block bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 mb-8">
                    <span className="text-sm text-gray-600">Order Number:</span>
                    <span className="ml-1 font-mono font-bold text-orange-500 text-lg">
            {orderNumber}
          </span>
                </div>

                <div className="space-y-3">
                    <Link
                        href="/public"
                        className="flex items-center justify-center w-full py-3 px-4 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
                    >
                        <ShoppingBagIcon className="w-5 h-5 mr-2" />
                        Continue Shopping
                        <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </Link>

                    <Link
                        href="/profile/orders"
                        className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        View Order History
                    </Link>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            onClick={() => alert('Download receipt – coming soon')}
                            className="flex items-center justify-center py-2 px-3 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <DocumentArrowDownIcon className="w-4 h-4 mr-1.5" />
                            Download Receipt
                        </button>
                        <Link
                            href="/cart"
                            className="flex items-center justify-center py-2 px-3 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-1.5" />
                            Back to Cart
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}