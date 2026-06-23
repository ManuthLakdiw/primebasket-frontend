'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import ProductModal from '@/components/product/ProductModal';
import Pagination from '@/components/ui/Pagination';
import { MagnifyingGlassIcon, InboxIcon } from '@heroicons/react/24/outline';
import { getAllPublicCategories } from "@/actions/category";
import { getProductsByCategoryId } from "@/actions/produts";
import { AnimatePresence } from 'motion/react';

const createSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');

export default function CategoryPage() {
    const params = useParams();
    const categorySlug = params?.name as string;

    const [category, setCategory] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    const pageSize = 12;

    useEffect(() => {
        const fetchCategory = async () => {
            if (!categorySlug) return;
            const catResult = await getAllPublicCategories();

            if (catResult.success && catResult.data) {
                const found = catResult.data.find(
                    (cat: any) => createSlug(cat.name) === categorySlug.toLowerCase()
                );
                setCategory(found || null);
                if (!found) setLoading(false);
            }
        };
        fetchCategory();
    }, [categorySlug]);


    useEffect(() => {
        if (!category) return;

        const fetchProducts = async () => {
            setLoading(true);
            const prodResult = await getProductsByCategoryId(category.id, searchQuery, currentPage - 1, pageSize);

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
    }, [category, currentPage, searchQuery]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedProduct(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

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

    if (loading && !category) return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>
                <p className="mt-4 text-gray-500 font-medium">Loading products...</p>
            </div>
        </div>
    );

    if (!loading && !category) return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-gray-500">
            <MagnifyingGlassIcon className="w-12 h-12 mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-700">Category Not Found</h2>
            <p className="mt-2 text-sm">We couldn't find the category you are looking for.</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left relative">

            <div className="mb-8 text-left">
                <h1 className="text-3xl font-bold text-gray-900 capitalize tracking-tight">{category?.name}</h1>
                <p className="mt-2 text-gray-600 max-w-2xl">{category?.description}</p>
                <p className="mt-2 text-sm font-medium text-orange-600 bg-orange-50 inline-block px-3 py-1 rounded-full">
                    {totalElements} items available
                </p>
                <div className="w-full h-[1px] bg-gray-200 mt-6"></div>
            </div>

            {totalElements > 0 || searchQuery !== '' ? (
                <div className="relative max-w-md mb-8">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder={`Search in ${category?.name}...`}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    />
                </div>
            ) : null}

            <div className="relative min-h-[500px]">
                {loading &&  (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center min-h-[400px]">
                        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>
                    </div>
                )}

                {products.length === 0 && !loading ? (
                    <div className="flex flex-col items-start justify-center py-12 px-6 bg-gray-50 rounded-2xl border border-gray-100 border-dashed text-left">
                        <InboxIcon className="w-12 h-12 text-gray-300 mb-3" />
                        <h3 className="text-lg font-bold text-gray-700">No products found</h3>
                        <button onClick={() => { setSearchQuery(''); setCurrentPage(1); }} className="mt-4 text-orange-600 text-sm font-medium hover:underline">Clear search</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {formattedProducts.map((product) => (
                            <ProductCard
                                onClick={(prod) => setSelectedProduct(prod)}
                                key={product.id}
                                product={product}
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
                    <ProductModal basicProduct={selectedProduct} onClose={() => setSelectedProduct(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}