import { Metadata } from 'next';
import OtpVerificationForm from '@/components/auth/OtpVerificationForm';

export const metadata: Metadata = {
    title: 'Verify Your Email | PrimeBasket',
    description: 'Enter your 5-digit verification code to activate your PrimeBasket account.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function VerifyOtpPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <OtpVerificationForm />
        </div>
    );
}