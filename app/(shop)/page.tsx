import FeaturedDeals from '@/components/home/FeaturedDeals';
import CategorySuggestions from '@/components/home/CategorySuggestions';
import OnSaleDeals from '@/components/home/OnSaleDeals';

export default function Home() {
    return (
        <div>
            <FeaturedDeals />
            <OnSaleDeals />
            <CategorySuggestions />
        </div>
    );
}