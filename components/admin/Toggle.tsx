'use client';

type Props = {
    checked: boolean;
    onChange: (checked: boolean) => void;
};

export default function Toggle({ checked, onChange }: Props) {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <div
                className={`w-9 h-5 rounded-full transition-colors duration-200 ${
                    checked ? 'bg-orange-500' : 'bg-gray-300'
                }`}
            />
            <div
                className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                    checked ? 'translate-x-4' : 'translate-x-0'
                }`}
            />
        </label>
    );
}