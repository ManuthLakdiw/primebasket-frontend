'use client';

import { useState, FormEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
    orderNumber?: string;
};

export default function CancellationReasonModal({ isOpen, onClose, onSubmit, orderNumber }: Props) {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) return;
        onSubmit(reason.trim());
        setReason('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Order {orderNumber}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700">
                            Reason for cancellation *
                        </label>
                        <textarea
                            id="cancel-reason"
                            rows={3}
                            required
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Customer requested refund"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Confirm Cancellation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}