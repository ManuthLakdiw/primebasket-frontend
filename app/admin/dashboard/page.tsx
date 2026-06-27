'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    CurrencyDollarIcon,
    UsersIcon,
    Squares2X2Icon,
    ClockIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

import { getDashboardSummaryAction } from '@/actions/dashbaord';

const lowStockItems = [
    { id: 1, name: 'Organic Tomatoes', stock: 4, threshold: 10 },
    { id: 2, name: 'Whole Wheat Bread', stock: 3, threshold: 15 },
    { id: 3, name: 'Avocados (Pack of 3)', stock: 7, threshold: 10 },
    { id: 4, name: 'Butter Cookies Box', stock: 2, threshold: 20 },
];

const recentActivities = [
    'New order #1089 placed by Jane D.',
    'Product “Red Velvet Slice” added by admin',
    'Inventory updated for “Fresh Carrots”',
    'Order #1088 marked as shipped',
    'New user “alex.m” registered',
];

export default function AdminDashboardPage() {
    const [summary, setSummary] = useState({
        totalSales: 0,
        activeUsers: 0,
        totalProducts: 0,
        pendingOrders: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchSummary = async () => {
        try {
            const res = await getDashboardSummaryAction();
            if (res.success && res.data) {
                setSummary(res.data);
            } else {
                toast.error("Failed to load dashboard summary");
            }
        } catch (error) {
            console.error("Dashboard Summary Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    const stats = [
        {
            name: 'Total Sales',
            value: `Rs. ${summary.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: 'Live Auto-update',
            changeType: 'positive',
            icon: CurrencyDollarIcon,
        },
        {
            name: 'Active Users',
            value: summary.activeUsers.toLocaleString(),
            change: 'Verified customers',
            changeType: 'positive',
            icon: UsersIcon,
        },
        {
            name: 'Total Products',
            value: summary.totalProducts.toLocaleString(),
            change: 'Available in store',
            changeType: 'positive',
            icon: Squares2X2Icon,
        },
        {
            name: 'Pending Orders',
            value: summary.pendingOrders.toLocaleString(),
            change: summary.pendingOrders > 0 ? 'Needs attention' : 'All caught up',
            changeType: summary.pendingOrders > 0 ? 'negative' : 'positive',
            icon: ClockIcon,
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Welcome back, Admin. Here’s what’s happening today.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200 relative overflow-hidden"
                    >
                        {loading && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className="p-2 bg-orange-50 rounded-full">
                                <stat.icon className="h-6 w-6 text-orange-500" />
                            </div>
                        </div>
                        <p
                            className={`mt-3 text-xs font-medium ${
                                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-500'
                            }`}
                        >
                            {stat.change}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <ExclamationCircleIcon className="h-5 w-5 text-orange-500" />
                        Low Stock Alerts
                    </h3>
                    <ul className="divide-y divide-gray-100">
                        {lowStockItems.map((item) => (
                            <li key={item.id} className="py-3 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                    <p className="text-xs text-gray-500">Threshold: {item.threshold}</p>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                                    {item.stock} left
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                    <ul className="space-y-3">
                        {recentActivities.map((activity, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <span className="inline-block h-2 w-2 mt-2 rounded-full bg-orange-400 flex-shrink-0" />
                                <p className="text-sm text-gray-600">{activity}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}