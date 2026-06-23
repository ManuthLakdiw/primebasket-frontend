'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import Pagination from '@/components/ui/Pagination';
import { getProductsByCategoryId } from '@/actions/produts';

type Props = {
    category: any;
    onProductClick: (product: any, sectionId: string) => void;
};

export default function CategoryProductRow({ category, onProductClick }: Props) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const pageSize = 4;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const result = await getProductsByCategoryId(category.id, '', currentPage - 1, pageSize);

            if (result.success && result.data) {
                setProducts(result.data.content || []);
                setTotalPages(result.data.totalPages || 1);
            }
            setLoading(false);
        };

        fetchProducts();
    }, [category.id, currentPage]);

    if (!loading && products.length === 0) return null;

    return (
        <div className="mb-14">
            <h3 className="text-xl font-bold text-orange-500 mb-6 pb-2 border-b border-gray-100">
                {category.name}
            </h3>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-72 bg-gray-100 animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                sectionId={`category-${category.id}`}
                                onClick={onProductClick}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-6 border-t border-gray-50 pt-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}