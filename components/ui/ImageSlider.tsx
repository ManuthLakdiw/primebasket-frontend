import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export const ImageSlider = ({ images }: { images: string[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">No image</div>;
    }

    if (images.length === 1) {
        return (
            <div className="relative w-full h-full bg-gray-50">
                <Image
                    src={images[0]}
                    alt="Product"
                    fill
                    unoptimized={true}
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
        );
    }

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="relative w-full h-full group bg-gray-50">
            <Image
                src={images[currentIndex]}
                alt="Product"
                fill
                unoptimized={true}
                className="object-contain p-2 transition-opacity duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <ChevronLeftIcon className="h-4 w-4" />
            </button>

            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <ChevronRightIcon className="h-4 w-4" />
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {images.map((_, idx) => (
                    <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === currentIndex ? 'bg-orange-500' : 'bg-gray-300'}`} />
                ))}
            </div>
        </div>
    );
};