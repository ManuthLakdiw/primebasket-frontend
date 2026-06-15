'use client';

import { motion } from "motion/react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {formAnimationVariant} from "@/util/animations";
import {RegisterFormValues, registerSchema} from "@/util/validations";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {facebookLoginAction, googleLoginAction, registerUserAction, resendOtpAction} from "@/actions/auth";
import {processOtpResend} from "@/util/authHelpers";
import {GoogleLogin} from "@react-oauth/google";
import {useAuthStore} from "@/store/authStore";
import FacebookLogin from "@greatsumini/react-facebook-login";
import {GoogleLoginButton} from "@/components/auth/SocialButtons/GoogleLoginButton";
import {FacebookLoginButton} from "@/components/auth/SocialButtons/FacebookLoginButton";
import {useSocialLogin} from "@/hooks/useSocialLogin";


export default function RegisterForm() {
    const router = useRouter();
    const { handleGoogleSuccess, handleFacebookSuccess } = useSocialLogin();
    const {register, handleSubmit, formState: { errors, isSubmitting }} = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: "onTouched"
    });

    const onSubmit = async (data: RegisterFormValues) => {
        const loadingToast = toast.loading("Processing your request...");

        const response = await registerUserAction(data);

        if (response.success) {
            sessionStorage.setItem('verifyEmail', data.email);
            toast.success("Verification code sent to " + data.email, { id: loadingToast });
            router.replace('/verify-otp');
        } else {
            if (response.error?.includes("not verified")) {
                toast((t) => (
                    <div className="flex flex-col gap-3">
                        <p className="text-sm text-gray-700 font-medium">
                            {response.error}
                        </p>
                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={async () => {
                                    toast.loading("Sending new code...", { id: t.id });
                                    await processOtpResend(data.email, t.id, router);
                                }}
                                className="bg-orange-500 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-orange-600 transition"
                            >
                                Verify Now
                            </button>
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ), {
                    id: loadingToast,
                    duration: 8000,
                    icon: '⚠️'
                });

            } else {
                toast.error(response.error, { id: loadingToast });
            }
        }
    };

    return (
        <motion.div
            variants={formAnimationVariant}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6">
            {/* Social signups */}
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
                Create an Account
            </h1>
            <div className="space-y-3">
                <GoogleLoginButton
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google Login failed")}
                />

                <FacebookLoginButton
                    onSuccess={handleFacebookSuccess}
                    onFail={() => toast.error("Facebook Login failed")}
                />
            </div>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR REGISTER WITH EMAIL</span>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First name</label>
                        <input
                            id="firstName"
                            type="text"
                            {...register("firstName")}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 sm:text-sm ${
                                errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                            }`}
                            placeholder="John"
                        />
                        {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last name</label>
                        <input
                            id="lastName"
                            type="text"
                            {...register("lastName")}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 sm:text-sm ${
                                errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                            }`}
                            placeholder="Doe"
                        />
                        {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                    <input
                        id="email"
                        type="email"
                        {...register("email")}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 sm:text-sm ${
                            errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                        }`}
                        placeholder="you@example.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        {...register("password")}
                        autoComplete="new-password"
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 sm:text-sm ${
                            errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                        }`}
                        placeholder="At least 6 characters"
                    />
                    {errors.password && (
                        <p className="mt-1 text-xs text-red-500 font-medium">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword")}
                        autoComplete="new-password"
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 sm:text-sm ${
                            errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                        }`}
                        placeholder="Re-enter your password"
                    />
                    {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500 font-medium">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 transition-colors"
                >
                    {isSubmitting ? "Creating..." : "Create Account"}
                </button>
            </form>

            <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-orange-500 hover:text-orange-600">
                    Sign In
                </Link>
            </p>
        </motion.div>
    );
}