'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShoppingBagIcon, CalendarIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { getMyOrdersAction, cancelMyOrderAction } from '@/actions/order';
import Pagination from '@/components/ui/Pagination';
import ViewOrderModal from '@/components/admin/ViewOrderModal';

export function OrderHistoryTab() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    const pageSize = 5;

    const loadOrders = useCallback(async (page: number) => {
        setLoading(true);
        const res = await getMyOrdersAction(page - 1, pageSize);
        if (res.success && res.data) {
            setOrders(res.data.content || []);
            setTotalPages(res.data.totalPages || 1);
        } else {
            toast.error(res.error || "Failed to load orders");
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadOrders(currentPage);
    }, [currentPage, loadOrders]);

    const handleCancelOrder = async (orderId: string) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
        if (confirmCancel) {
            const toastId = toast.loading("Cancelling order...");
            const res = await cancelMyOrderAction(orderId);

            if (res.success) {
                toast.success("Order cancelled successfully!", { id: toastId });
                loadOrders(currentPage);
            } else {
                toast.error(res.error || "Failed to cancel order", { id: toastId });
            }
        }
    };

    const statusBadge = (status: string) => {
        const colors: Record<string, string> = {
            DELIVERED: 'bg-green-100 text-green-800 border-green-200',
            PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
            SHIPPED: 'bg-purple-100 text-purple-800 border-purple-200',
            CANCELLED: 'bg-red-100 text-red-800 border-red-200',
        };
        return `inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-300 rounded-xl shadow-sm">
                <ShoppingBagIcon className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 font-medium">No orders yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {orders.map((order: any) => (
                    <div key={order.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-row items-center justify-between gap-4">

                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <h3 className="text-sm font-bold text-gray-900 truncate">
                                    {order.orderNumber}
                                </h3>
                                <span className={statusBadge(order.status)}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                                <span className="truncate">Placed on {formatDate(order.createdAt)}</span>
                            </div>
                        </div>

                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Total</p>
                            <p className="text-sm font-bold text-orange-500">
                                Rs. {order.total ? order.total.toFixed(2) : '0.00'}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 pl-2 sm:pl-4 sm:border-l border-gray-100 flex-shrink-0">
                            <button
                                onClick={() => setSelectedOrder(order)}
                                title="View Details"
                                className="p-2 text-gray-500 bg-gray-50 hover:bg-orange-50 hover:text-orange-500 border border-transparent hover:border-orange-200 rounded-lg transition-colors"
                            >
                                <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>

                            {(order.status === 'PENDING' || order.status === 'PROCESSING' || order.status === 'PROCEED') && (
                                <button
                                    onClick={() => handleCancelOrder(order.id)}
                                    title="Cancel Order"
                                    className="p-2 text-red-500 bg-red-50 hover:bg-red-100 border border-transparent hover:border-red-200 rounded-lg transition-colors"
                                >
                                    <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            )}

            <ViewOrderModal
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                order={selectedOrder}
            />
        </div>
    );
}