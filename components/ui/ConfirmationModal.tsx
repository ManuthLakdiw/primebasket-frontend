'use client';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type Props = {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning';
};

export default function ConfirmationModal({
                                              isOpen,
                                              title,
                                              message,
                                              confirmLabel,
                                              onConfirm,
                                              onCancel,
                                              variant = 'danger',
                                          }: Props) {
    if (!isOpen) return null;

    const confirmColors =
        variant === 'danger'
            ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
            : 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50" onClick={onCancel} />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 transform transition-all">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmColors}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}