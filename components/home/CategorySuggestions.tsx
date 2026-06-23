'use client';

import {useEffect, useState} from 'react';
import {AnimatePresence} from "motion/react";
import {getAllPublicCategories} from "@/actions/category";
import CategoryProductRow from "@/components/product/CategoryProductRow";
import ProductModal from "@/components/product/ProductModal";

export default function CategorySuggestions() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [selectedSection, setSelectedSection] = useState<string>('default');

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            const result = await getAllPublicCategories();
            if (result.success && result.data) {
                setCategories(result.data);
            }
            setLoading(false);
        };

        fetchCategories();
    }, []);

    const handleProductClick = (product: any, sectionId: string) => {
        setSelectedProduct(product);
        setSelectedSection(sectionId);
    };

    return (
        <section className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-10 text-left">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">All Products</h2>
                    <p className="mt-2 text-gray-500">Browse our wide range of products by category</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
                    </div>
                ) : categories.length > 0 ? (
                    <div>
                        {categories.map((category) => (
                            <CategoryProductRow
                                key={category.id}
                                category={category}
                                onProductClick={handleProductClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
                        No categories found.
                    </div>
                )}

            </div>

            <AnimatePresence>
                {selectedProduct && (
                    <ProductModal
                        basicProduct={selectedProduct}
                        sectionId={selectedSection}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}