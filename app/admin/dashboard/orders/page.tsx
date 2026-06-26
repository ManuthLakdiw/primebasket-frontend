'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { ClockIcon, ArrowPathIcon, TruckIcon, HomeIcon, XCircleIcon, CheckCircleIcon, InboxIcon } from '@heroicons/react/24/solid';
import { EyeIcon } from "@heroicons/react/24/outline";

import CancellationReasonModal from '@/components/admin/CancellationReasonModal';
import ViewOrderModal from "@/components/admin/ViewOrderModal";
import Pagination from '@/components/ui/Pagination';

import {getOrdersAction, updateOrderStatusAction} from "@/actions/order";
import toast from "react-hot-toast";

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'PROCEED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
    PENDING:  { label: 'Pending',  color: 'text-yellow-700', bg: 'bg-yellow-100',  icon: ClockIcon },
    PROCESSING: { label: 'Processing', color: 'text-blue-700', bg: 'bg-blue-100', icon: ArrowPathIcon },
    PROCEED: { label: 'Proceed', color: 'text-indigo-700', bg: 'bg-indigo-100', icon: ArrowPathIcon },
    SHIPPED:  { label: 'Shipped',  color: 'text-purple-700', bg: 'bg-purple-100', icon: TruckIcon },
    DELIVERED: { label: 'Delivered', color: 'text-green-700', bg: 'bg-green-100', icon: HomeIcon },
    CANCELLED: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-100', icon: XCircleIcon },
};

const tabs: OrderStatus[] = ['PENDING', 'PROCESSING', 'PROCEED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const getAvailableStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
    if (currentStatus === 'CANCELLED' || currentStatus === 'DELIVERED') return [];
    const flow: OrderStatus[] = ['PENDING', 'PROCESSING', 'PROCEED', 'SHIPPED', 'DELIVERED'];
    const currentIndex = flow.indexOf(currentStatus);
    const available = flow.filter((s, index) => index > currentIndex && s !== 'PENDING' && s !== 'PROCESSING');
    available.push('CANCELLED');
    return available;
};

export default function OrdersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const activeTab = (searchParams?.get('status') as OrderStatus) || 'PENDING';
    const currentPage = parseInt(searchParams?.get('page') || '1', 10);

    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
    const [viewOrder, setViewOrder] = useState<any | null>(null);
    const [cancelModal, setCancelModal] = useState<{ isOpen: boolean; order: any | null }>({ isOpen: false, order: null });

    const pageSize = 4;

    const loadOrders = useCallback(async (status: OrderStatus, page: number) => {
        setLoading(true);
        const res = await getOrdersAction(status, page - 1, pageSize);
        if (res.success) {
            setOrders(res.data.content || []);
            setTotalPages(res.data.totalPages || 1);
            setTotalElements(res.data.totalElements || 0);
        } else {
            toast.error(res.error || "Failed to load orders");
            setOrders([]);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadOrders(activeTab, currentPage);
    }, [activeTab, currentPage, loadOrders]);

    const handleNavigation = (status: OrderStatus, page: number) => {
        router.push(`?status=${status}&page=${page}`, { scroll: false });
    };

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus, reason?: string) => {
        const toastId = toast.loading('Updating status...');
        setUpdatingOrderId(orderId);

        try {
            const result = await updateOrderStatusAction(orderId, newStatus, reason);

            if (result.success) {
                toast.success(`Order status updated to ${statusConfig[newStatus].label}`, { id: toastId });
                loadOrders(activeTab, currentPage);
            } else {
                toast.error(result.error || 'Status update failed', { id: toastId });
            }
        } catch (error) {
            toast.error('Network error. Please try again.', { id: toastId });
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const onStatusDropdownChange = (order: any, newStatus: OrderStatus) => {
        if (newStatus === order.status) return;
        if (newStatus === 'CANCELLED') {
            setCancelModal({ isOpen: true, order });
        } else {
            handleStatusChange(order.id, newStatus);
        }
    };

    const confirmCancellation = (reason: string) => {
        if (cancelModal.order) {
            handleStatusChange(cancelModal.order.id, 'CANCELLED', reason);
        }
        setCancelModal({ isOpen: false, order: null });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
                <p className="text-sm text-gray-500">Manage customer orders and update status</p>
            </div>

            <div className="border-b border-gray-200">
                <nav className="flex -mb-px space-x-2 sm:space-x-4 overflow-x-auto pb-1 scrollbar-hide">
                    {tabs.map((tab) => {
                        const config = statusConfig[tab];
                        const isActive = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => handleNavigation(tab, 1)}
                                className={`relative flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap pb-3 focus:outline-none ${
                                    isActive ? 'text-orange-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <config.icon className="h-4 w-4" />
                                {config.label}
                                {isActive && (
                                    <span className={`ml-1 text-[10px] rounded-full px-2 py-0.5 ${config.bg} ${config.color}`}>
                                        {totalElements}
                                    </span>
                                )}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabUnderline"
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-500 z-10"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <InboxIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No {statusConfig[activeTab].label.toLowerCase()} orders found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const status = statusConfig[order.status as OrderStatus];
                        const StatusIcon = status.icon;
                        const isUpdating = updatingOrderId === order.id;

                        const availableStatuses = getAvailableStatuses(order.status as OrderStatus);
                        const isLocked = availableStatuses.length === 0;

                        const formattedDate = new Date(order.orderDate).toLocaleString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        });

                        return (
                            <div
                                key={order.id}
                                className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all ${
                                    isLocked ? 'opacity-80 bg-gray-50/50' : ''
                                }`}
                            >
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-gray-900">{order.orderNumber}</h3>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${status.bg} ${status.color}`}>
                                            <StatusIcon className="h-3.5 w-3.5" />
                                            {status.label}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500 font-medium">{formattedDate}</span>
                                    <div className="text-sm font-semibold text-gray-700 mt-1">{order.customerName}</div>
                                </div>

                                <div className="flex flex-col md:items-end gap-3 mt-2 md:mt-0">
                                    <div className="text-xl font-bold text-gray-900">
                                        Rs. {order.total.toFixed(2)}
                                    </div>

                                    <div className="flex items-center gap-2 w-full md:w-auto">
                                        {!isLocked ? (
                                            <div className="relative flex-1 md:w-44">
                                                <select
                                                    value={order.status}
                                                    disabled={isUpdating}
                                                    onChange={(e) => onStatusDropdownChange(order, e.target.value as OrderStatus)}
                                                    className="appearance-none block w-full pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50"
                                                >
                                                    <option value={order.status} disabled>{status.label} (Current)</option>
                                                    {availableStatuses.map((s) => (
                                                        <option key={s} value={s}>
                                                            Mark as {statusConfig[s].label}
                                                        </option>
                                                    ))}
                                                </select>
                                                {isUpdating && (
                                                    <div className="absolute inset-y-0 right-2 flex items-center">
                                                        <div className="animate-spin h-3 w-3 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs font-bold text-gray-400 flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200">
                                                {order.status === 'DELIVERED' ? <CheckCircleIcon className="h-4 w-4 text-green-500" /> : <XCircleIcon className="h-4 w-4 text-red-500" />}
                                                {order.status === 'DELIVERED' ? 'Completed' : 'Locked'}
                                            </span>
                                        )}

                                        <button
                                            onClick={() => setViewOrder(order)}
                                            className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 transition-all"
                                            title="View Details"
                                        >
                                            <EyeIcon className="h-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => handleNavigation(activeTab, page)}
                />
            )}

            <CancellationReasonModal
                isOpen={cancelModal.isOpen}
                onClose={() => setCancelModal({ isOpen: false, order: null })}
                onSubmit={confirmCancellation}
                orderNumber={cancelModal.order?.orderNumber}
            />

            <ViewOrderModal
                isOpen={!!viewOrder}
                order={viewOrder}
                onClose={() => setViewOrder(null)}
            />
        </div>
    );
}