import {ExclamationCircleIcon} from "@heroicons/react/24/outline";

export function ErrorModal({
                        isOpen,
                        onClose,
                        errorMessage,
                    }: {
    isOpen: boolean;
    onClose: () => void;
    errorMessage?: string;
}) {
    if (!isOpen || !errorMessage) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
                    Email Error Detail
                </h3>
                <p className="text-sm text-gray-600">{errorMessage}</p>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}