'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    EyeIcon,
    ShieldCheckIcon,
    ShieldExclamationIcon,
    InboxIcon
} from '@heroicons/react/24/outline';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import ViewUserModal from '@/components/admin/ViewUserModal';
import Pagination from '@/components/ui/Pagination';
import { getAllCustomersAction, toggleUserActivationAction } from "@/actions/user";
import toast from "react-hot-toast";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        user: any | null;
    }>({ isOpen: false, user: null });

    const [viewUserId, setViewUserId] = useState<string | null>(null);

    const loadUsers = useCallback(async (page: number) => {
        setLoading(true);
        const res = await getAllCustomersAction(page - 1, 10);
        if (res.success) {
            setUsers(res.data.content);
            setTotalPages(res.data.totalPages);
        } else {
            toast.error(res.error || "Failed to load users");
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadUsers(currentPage);
    }, [currentPage, loadUsers]);

    useEffect(() => {
        loadUsers(currentPage);
    }, [currentPage, loadUsers]);

    const handleToggleStatus = (user: any) => {
        if (user.isActivated) {
            setConfirmModal({ isOpen: true, user });
        } else {
            performStatusChange(user);
        }
    };

    const performStatusChange = async (user: any) => {
        const toastId = toast.loading('Updating status...');
        try {
            const res = await toggleUserActivationAction(user.id);
            if (res.success) {
                toast.success('User status updated successfully', { id: toastId });
                setUsers((prevUsers) =>
                    prevUsers.map((u) =>
                        u.id === user.id ? { ...u, isActivated: !user.isActivated } : u
                    )
                );
            } else {
                toast.error(res.error || "Failed to update status", { id: toastId });
            }
        } catch {
            toast.error('Operation failed', { id: toastId });
        }
    };
    const confirmSuspend = () => {
        if (confirmModal.user) {
            performStatusChange(confirmModal.user);
        }
        setConfirmModal({ isOpen: false, user: null });
    };
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Users</h2>
                    <p className="text-sm text-gray-500">
                        Manage customer accounts (standard users)
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>
            ) : users.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <InboxIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    No users found.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">
                                    {user.initials}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-base font-semibold text-gray-800 truncate">
                                        {user.firstName} {user.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>

                            <div className="space-y-1 mb-4 flex-1">
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                    <span className="font-medium">Tel:</span>
                                    {user.telephone ? (
                                        user.telephone
                                    ) : (
                                        <span className="text-gray-400 italic text-xs">Not added yet</span>
                                    )}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        user.isActivated
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {user.isActivated ? 'Active' : 'Inactive'}
                                </span>
                                <span className="text-xs text-gray-400 uppercase">USER</span>
                            </div>

                            <div className="flex gap-2">
                                {user.isActivated ? (
                                    <button
                                        onClick={() => handleToggleStatus(user)}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                    >
                                        <ShieldExclamationIcon className="h-4 w-4 mr-1" />
                                        Suspend
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleToggleStatus(user)}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                    >
                                        <ShieldCheckIcon className="h-4 w-4 mr-1" />
                                        Activate
                                    </button>
                                )}
                                <button
                                    onClick={() => setViewUserId(user.id)}
                                    className="flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                                >
                                    <EyeIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            )}

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                title="Suspend Account"
                message={`Are you sure you want to suspend ${confirmModal.user?.firstName} ${confirmModal.user?.lastName}?`}
                confirmLabel="Suspend"
                onConfirm={confirmSuspend}
                onCancel={() => setConfirmModal({ isOpen: false, user: null })}
                variant="danger"
            />

            <ViewUserModal
                userId={viewUserId}
                onClose={() => setViewUserId(null)}
            />
        </div>
    );
}