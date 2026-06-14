import RegisterForm from '@/components/auth/RegisterForm';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Create an Account | PrimeBasket',
    description: 'Join PrimeBasket today to shop for fresh vegetables, fruits, cakes, and more.',
};

export default function RegisterPage() {
    return (
        <div className="w-full max-w-md">
            <RegisterForm />
        </div>
    );
}