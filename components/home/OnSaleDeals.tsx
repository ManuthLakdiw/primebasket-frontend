'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'motion/react';
import ProductCard from '@/components/product/ProductCard';
import ProductModal from '@/components/product/ProductModal';
import { getTopOnSaleProducts } from '@/actions/produts';

export default function OnSaleDeals() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    useEffect(() => {
        const fetchOnSale = async () => {
            setLoading(true);
            const result = await getTopOnSaleProducts(4);
            if (result.success && result.data) {
                setProducts(result.data);
            }
            setLoading(false);
        };
        fetchOnSale();
    }, []);

    return (
        <section className="bg-white py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">On Sale</h2>
                    <Link
                        href="/onsale"
                        className="text-orange-500 hover:text-orange-600 font-medium text-sm transition-colors"
                    >
                        Show More &rarr;
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-72 bg-gray-100 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                sectionId="onsale"
                                product={product}
                                onClick={(prod) => setSelectedProduct(prod)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                        No products on sale currently.
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedProduct && (
                    <ProductModal
                        sectionId="onsale"
                        basicProduct={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}