'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    CheckCircleIcon,
    DocumentArrowDownIcon,
    ShoppingBagIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {getOrderDetailsAction, getOrderDetailsByNumberAction} from "@/actions/order";

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('orderNumber') || searchParams.get('order_id');


    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadReceipt = async () => {
        if (!orderNumber) {
            toast.error("Order Number is missing. Cannot download receipt.");
            return;
        }

        const toastId = toast.loading("Preparing your receipt...");
        setIsDownloading(true);

        try {
            const res = await getOrderDetailsByNumberAction(orderNumber);

            if (!res.success || !res.data) {
                toast.error(res.error || "Failed to fetch order details.", { id: toastId });
                setIsDownloading(false);
                return;
            }

            const order = res.data;

            const doc = new jsPDF();

            doc.setFontSize(22);
            doc.setTextColor(249, 115, 22);
            doc.text("PrimeBasket", 14, 20);

            doc.setFontSize(16);
            doc.setTextColor(40);
            doc.text("Order Receipt", 14, 30);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Order Number: ${order.orderNumber}`, 14, 40);
            const orderDate = new Date(order.orderDate || Date.now()).toLocaleString();
            doc.text(`Date: ${orderDate}`, 14, 45);
            doc.text(`Payment Status: ${order.paymentStatus}`, 14, 50);

            doc.setFontSize(12);
            doc.setTextColor(40);
            doc.text("Bill To:", 14, 60);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(order.customerName || 'N/A', 14, 65);
            doc.text(order.customerEmail || 'N/A', 14, 70);
            if (order.customerPhone) {
                doc.text(order.customerPhone, 14, 75);
            }

            doc.setFontSize(12);
            doc.setTextColor(40);
            doc.text("Ship To:", 100, 60);

            doc.setFontSize(10);
            doc.setTextColor(100);
            const address = order.shippingAddress;
            if (address) {
                doc.text(`${address.street}, ${address.city}`, 100, 65);
                doc.text(`${address.district}, ${address.postalCode}`, 100, 70);
            }

            const tableHead = [['Item Description', 'Qty', 'Unit Price (Rs.)', 'Total (Rs.)']];
            const tableBody = order.items.map((item: any) => [
                item.productName,
                item.quantity.toString(),
                item.unitPrice.toFixed(2),
                item.lineTotal.toFixed(2)
            ]);

            autoTable(doc, {
                startY: 85,
                head: tableHead,
                body: tableBody,
                theme: 'grid',
                headStyles: { fillColor: [249, 115, 22], textColor: [255, 255, 255] },
                alternateRowStyles: { fillColor: [249, 250, 251] },
                styles: { fontSize: 10 },
            });

            const finalY = (doc as any).lastAutoTable.finalY || 85;

            doc.setFontSize(10);
            doc.setTextColor(40);
            doc.text(`Subtotal: Rs. ${order.itemsTotal?.toFixed(2)}`, 130, finalY + 10);
            doc.text(`Delivery Fee: Rs. ${order.deliveryFee?.toFixed(2)}`, 130, finalY + 16);

            doc.setFontSize(12);
            doc.setTextColor(249, 115, 22);
            doc.setFont("helvetica", "bold");
            doc.text(`Final Total: Rs. ${order.finalTotal?.toFixed(2)}`, 130, finalY + 24);

            const fileName = `Receipt_${order.orderNumber}.pdf`;
            doc.save(fileName);

            toast.success("Receipt downloaded successfully!", { id: toastId });

        } catch (error) {
            console.error("PDF Generation Error:", error);
            toast.error("Failed to generate receipt.", { id: toastId });
        } finally {
            setIsDownloading(false);
        }
    };

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
                        href="/"
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
                        {/* 🌟 මෙතන තමයි Button එක Update කළේ */}
                        <button
                            onClick={handleDownloadReceipt}
                            disabled={isDownloading}
                            className="flex items-center justify-center py-2 px-3 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            {isDownloading ? (
                                <div className="w-4 h-4 mr-1.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <DocumentArrowDownIcon className="w-4 h-4 mr-1.5" />
                            )}
                            {isDownloading ? 'Preparing...' : 'Download Receipt'}
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

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    );
}