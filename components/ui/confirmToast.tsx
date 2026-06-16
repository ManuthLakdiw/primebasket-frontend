import toast from 'react-hot-toast';

type ConfirmOptions = {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
};

export const showConfirmToast = ({
                                     title = "Are you sure?",
                                     message = "This action cannot be undone.",
                                     confirmText = "Delete",
                                     cancelText = "Cancel",
                                     onConfirm
                                 }: ConfirmOptions) => {

    toast.dismiss('confirm-toast');

    toast((t) => (
        <div className="flex flex-col gap-3">
            <div>
                <p className="font-medium text-gray-900">{title}</p>
                <p className="text-sm text-gray-500 mt-1">{message}</p>
            </div>
            <div className="flex gap-2 justify-end mt-2">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                    {cancelText}
                </button>
                <button
                    onClick={() => {
                        toast.dismiss(t.id);
                        onConfirm();
                    }}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                >
                    {confirmText}
                </button>
            </div>
        </div>
    ), {
        id: 'confirm-toast',
        duration: Infinity,
        position: 'top-center',
    });
};