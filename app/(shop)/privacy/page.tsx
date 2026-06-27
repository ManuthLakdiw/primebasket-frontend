import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | PrimeBasket',
    description: 'Privacy Policy for PrimeBasket E-Commerce platform.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

            <div className="prose prose-orange max-w-none text-gray-600 space-y-6">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Introduction</h2>
                    <p>Welcome to PrimeBasket. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Data We Collect</h2>
                    <p>When you register or log in using social authentication (such as Google or Facebook), we collect the following information:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li><strong>Identity Data:</strong> First name, last name, and profile picture.</li>
                        <li><strong>Contact Data:</strong> Email address.</li>
                    </ul>
                    <p className="mt-2">When you place an order, we may also collect your delivery address and phone number to fulfill your purchase.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3. How We Use Your Data</h2>
                    <p>We use your data strictly for the following purposes:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>To create and manage your account.</li>
                        <li>To authenticate you securely using Google or Facebook OAuth.</li>
                        <li>To process and deliver your orders.</li>
                        <li>To communicate with you regarding your orders or customer support.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Data Sharing and Security</h2>
                    <p>We do not sell, trade, or otherwise transfer your Personally Identifiable Information to outside parties. Your data is stored securely in our databases, and sensitive information (such as passwords and payment details) is encrypted. Payments are processed securely via third-party gateways (e.g., PayHere) and we do not store your credit card information on our servers.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5. Data Deletion</h2>
                    <p>You have the right to request the deletion of your personal data. If you wish to delete your PrimeBasket account and associated data, please contact us at support@primebasket.com. Alternatively, if you connected via Facebook, you can remove our app from your Facebook settings to revoke access.</p>
                </section>
            </div>
        </div>
    );
}