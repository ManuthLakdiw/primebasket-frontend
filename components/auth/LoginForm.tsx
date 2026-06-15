'use client';

import { motion } from "motion/react";
import Link from 'next/link';
import {formAnimationVariant} from "@/util/animations";
import {LoginFormValues, loginSchema} from "@/util/validations";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {googleLoginAction, loginUserAction} from "@/actions/auth";
import {processOtpResend} from "@/util/authHelpers";
import {useAuthStore} from "@/store/authStore";
import {GoogleLogin} from "@react-oauth/google";

export default function LoginForm() {
    const loadUser = useAuthStore((state) => state.loadUser);

    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched"
    });

    const onSubmit = async (data: LoginFormValues) => {
        const loadingToast = toast.loading("Signing in...");

        const response = await loginUserAction(data);

        if (response.success) {
            toast.success("Welcome back!", { id: loadingToast, duration: 2000 });
            await loadUser();
            router.replace('/');
        } else {
            if (response.error?.toLowerCase().includes("locked")) {
                toast((t) => (
                    <div className="flex flex-col gap-3">
                        <p className="text-sm text-gray-700 font-medium">
                            Your account is not verified. Please verify your email to continue.
                        </p>
                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={async () => {
                                    toast.loading("Sending verification code...", { id: t.id });

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
                    duration: 10000,
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
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
                Welcome Back
            </h1>
            <div className="space-y-3">
                <GoogleLogin
                    theme="filled_blue"
                    shape="rectangular"
                    size="large"
                    text="continue_with"
                    width="100%"

                    onSuccess={async (credentialResponse) => {
                        const loadingId = toast.loading("Verifying with Google...");

                        const idToken = credentialResponse.credential;

                        if (idToken) {
                            const res = await googleLoginAction(idToken);

                            if (res.success) {
                                toast.success("Successfully logged in!", { id: loadingId });
                                await loadUser();
                                router.replace('/');
                            } else {
                                toast.error(res.error, { id: loadingId });
                            }
                        }
                    }}
                    onError={() => {
                        toast.error("Google Login popup was closed or failed.");
                    }}
                />

                {/* Facebook */}
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1877F2] hover:bg-[#166fe5] transition-colors"
                >
                    <svg className="h-5 w-5" fill="white" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Continue with Facebook
                </button>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR CONTINUE WITH EMAIL</span>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        type="password"
                        {...register("password")}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 sm:text-sm ${
                            errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-orange-500'
                        }`}
                        placeholder="••••••••"
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
                >
                    {isSubmitting ? "Signing In..." : "Sign In"}
                </button>
            </form>

            <p className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-medium text-orange-500 hover:text-orange-600">
                    Sign Up
                </Link>
            </p>
        </motion.div>
    );
}