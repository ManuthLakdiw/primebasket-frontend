'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import ProductModal from '@/components/product/ProductModal';
import Pagination from '@/components/ui/Pagination';
import { MagnifyingGlassIcon, InboxIcon } from '@heroicons/react/24/outline';
import { searchAllProducts } from "@/actions/produts";
import { AnimatePresence } from 'motion/react';

function SearchContent() {
    const searchParams = useSearchParams();
    const urlQuery = searchParams?.get('q') || '';

    const [searchQuery, setSearchQuery] = useState(urlQuery);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    const pageSize = 12;

    useEffect(() => {
        setSearchQuery(urlQuery);
    }, [urlQuery]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!searchQuery.trim()) {
                setProducts([]);
                setTotalElements(0);
                setLoading(false);
                return;
            }

            setLoading(true);
            const prodResult = await searchAllProducts(searchQuery, currentPage - 1, pageSize);

            if (prodResult.success && prodResult.data) {
                setProducts(prodResult.data.content || []);
                setTotalPages(prodResult.data.totalPages || 1);
                setTotalElements(prodResult.data.totalElements || 0);
            } else {
                setProducts([]);
            }
            setLoading(false);
        };

        const delaySearch = setTimeout(fetchProducts, 500);
        return () => clearTimeout(delaySearch);
    }, [searchQuery, currentPage]);

    const formattedProducts = products.map(p => ({
        id: p.id.toString(),
        sku: p.sku,
        name: p.name,
        description: p.description,
        originalPrice: p.originalPrice,
        sellingPrice: p.sellingPrice,
        isOnSale: p.isOnSale,
        images: p.images,
        stockQuantity: p.stockQuantity,
        stockStatus: p.stockStatus,
        isFeatured: p.isFeatured,
        attributes: p.attributes
    }));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left relative">

            <div className="mb-8 text-left">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Search Results for "{searchQuery || urlQuery}"
                </h1>
                <p className="mt-2 text-sm font-medium text-orange-600 bg-orange-50 inline-block px-3 py-1 rounded-full">
                    {totalElements} items found
                </p>
                <div className="w-full h-[1px] bg-gray-200 mt-6"></div>
            </div>

            <div className="relative max-w-md mb-8">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search anything..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
            </div>

            <div className="relative min-h-[500px]">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
                    </div>
                )}

                {products.length === 0 && !loading ? (
                    <div className="flex flex-col items-start justify-center py-12 px-6 bg-gray-50 rounded-2xl border border-gray-100 border-dashed text-left">
                        <InboxIcon className="w-12 h-12 text-gray-300 mb-3" />
                        <h3 className="text-lg font-bold text-gray-700">No products found</h3>
                        <p className="text-sm text-gray-500 mt-1">Try checking your spelling or using different keywords.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {formattedProducts.map((product) => (
                            <ProductCard
                                onClick={(prod) => setSelectedProduct(prod)}
                                key={product.id}
                                product={product}
                                sectionId="global-search"
                            />
                        ))}
                    </div>
                )}
            </div>

            {!loading && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />
            )}

            <AnimatePresence>
                {selectedProduct && (
                    <ProductModal
                        basicProduct={selectedProduct}
                        sectionId="global-search"
                        onClose={() => setSelectedProduct(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[500px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}