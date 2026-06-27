import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions | PrimeBasket',
    description: 'Terms and Conditions for using PrimeBasket.',
};

export default function TermsConditionsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>

            <div className="prose prose-orange max-w-none text-gray-600 space-y-6">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Acceptance of Terms</h2>
                    <p>By accessing and using PrimeBasket, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use our service.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2. User Accounts</h2>
                    <p>To use certain features of the site (e.g., placing an order), you must register for an account. You can register manually or use third-party authentication (Google/Facebook). You are responsible for maintaining the confidentiality of your account information and password.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3. Products and Pricing</h2>
                    <p>All products listed on PrimeBasket are subject to availability. We reserve the right to modify prices, products, and services without prior notice. We make every effort to display the colors and images of our products accurately, but we cannot guarantee your device's display will be accurate.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Payments and Refunds</h2>
                    <p>Payments are securely processed through authorized third-party payment gateways (e.g., PayHere). In the event of a cancellation or a product issue, refunds will be processed according to our standard return policy. Please contact customer support for specific order disputes.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5. Contact Information</h2>
                    <p>Questions about the Terms & Conditions should be sent to us at support@primebasket.com.</p>
                </section>
            </div>
        </div>
    );
}