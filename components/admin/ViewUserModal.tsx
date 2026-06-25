'use client';

import { useState, useEffect } from 'react';
import {
    XMarkIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    ShieldCheckIcon,
    UserIcon,
    CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { getUserFullDetailsAction } from "@/actions/user";

const statusColor = (active: boolean) =>
    active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

type Props = {
    userId: string | null;
    onClose: () => void;
};

export default function ViewUserModal({ userId, onClose }: Props) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userId) {
            setLoading(true);
            getUserFullDetailsAction(userId).then(res => {
                if (res.success) {
                    setUser(res.data);
                } else {
                    toast.error(res.error || "Failed to load user details");
                }
                setLoading(false);
            });
        } else {
            setUser(null);
        }
    }, [userId]);

    if (!userId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto mx-4">

                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        {loading ? (
                            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                        ) : user && (
                            <>
                                <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                                    {user.initials}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </>
                        )}
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        </div>
                    ) : user ? (
                        <>
                            <section>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-200 pb-1">
                                    Personal Information
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm text-gray-600">{user.firstName} {user.lastName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm text-gray-600">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            {user.telephone || <span className="text-gray-400 italic">Not added</span>}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700">Status:</span>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(user.isActivated)}`}>
                                            {user.isActivated ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700">Role:</span>
                                        <span className="text-sm text-gray-600">{user.role}</span>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-200 pb-1">
                                    Account &amp; Security
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            Auth Method:{' '}
                                            <span className="font-medium">{user.authProvider === 'LOCAL' ? 'Email / Password' : user.authProvider}</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            Last Login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never logged in'}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-200 pb-1">
                                    Saved Addresses ({user.addresses ? user.addresses.length : 0})
                                </h4>
                                {!user.addresses || user.addresses.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">No saved addresses.</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {user.addresses.map((addr: any) => (
                                            <div key={addr.id} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <MapPinIcon className="h-4 w-4 text-orange-500" />
                                                    <span className="text-xs font-semibold text-gray-700 uppercase">
                                                        {addr.type}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {addr.street}, {addr.city}, {addr.state} {addr.zip}, {addr.country}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-200 pb-1">
                                    Order Summary
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="border border-gray-200 rounded-md p-4 bg-gray-50 flex flex-col items-center justify-center">
                                        <span className="text-sm text-gray-500">Total Orders</span>
                                        <span className="text-2xl font-bold text-gray-900">{user.totalOrders}</span>
                                    </div>
                                    <div className="border border-gray-200 rounded-md p-4 bg-gray-50 flex flex-col items-center justify-center">
                                        <span className="text-sm text-gray-500">Total Spent</span>
                                        <span className="text-2xl font-bold text-orange-600">Rs. {user.totalSpent?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </section>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}