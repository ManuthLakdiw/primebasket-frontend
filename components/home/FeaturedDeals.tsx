'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'motion/react';
import ProductCard from '../product/ProductCard';
import ProductModal from '../product/ProductModal';
import { getTopFeaturedProducts } from '@/actions/produts';

export default function FeaturedDeals() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    useEffect(() => {
        const fetchFeatured = async () => {
            setLoading(true);
            const result = await getTopFeaturedProducts(4);
            if (result.success && result.data) {
                setProducts(result.data);
            }
            setLoading(false);
        };
        fetchFeatured();
    }, []);

    return (
        <section className="bg-white py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Deals</h2>

                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-72 bg-gray-100 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={(prod) => setSelectedProduct(prod)}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-10 text-center">
                    <Link
                        href="/featured"
                        className="inline-block border border-orange-500 text-orange-500 px-6 py-2.5 rounded-md font-medium hover:bg-orange-50 transition-colors"
                    >
                        Show More
                    </Link>
                </div>
            </div>

            <AnimatePresence>
                {selectedProduct && (
                    <ProductModal
                        basicProduct={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}