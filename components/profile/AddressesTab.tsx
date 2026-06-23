'use client';

import { MapPinIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Address } from './AddressModal';
import {PencilSquareIcon} from "@heroicons/react/16/solid";

type Props = {
    addresses: Address[];
    onEdit: (addr: Address) => void;
    onDelete: (addr: Address) => void;
    onAdd: () => void;
    maxReached: boolean;
};

export function AddressesTab({ addresses, onEdit, onDelete, onAdd, maxReached }: Props) {
    if (addresses.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                <MapPinIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 font-medium">No saved addresses.</p>
                <button
                    onClick={onAdd}
                    className="mt-3 text-orange-500 text-sm font-medium hover:text-orange-600 transition-colors"
                >
                    + Add New Address
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
                <div key={addr.addressType} className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm hover:border-orange-300 transition-colors relative group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <MapPinIcon className="h-5 w-5 text-orange-500" />
                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{addr.addressType}</span>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onEdit(addr)} className="text-gray-400 hover:text-orange-500 transition-colors">
                                <PencilSquareIcon className="h-5 w-5" />
                            </button>
                            <button onClick={() => onDelete(addr)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {addr.street}<br />
                        {addr.city}, {addr.district}<br />
                        {addr.postalCode}
                    </p>
                </div>
            ))}
        </div>
    );
}