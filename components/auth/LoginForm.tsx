'use client';

import { motion } from "motion/react";
import Link from 'next/link';
import { formAnimationVariant } from "@/util/animations";
import { LoginFormValues, loginSchema } from "@/util/validations";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { KeyIcon } from '@heroicons/react/24/outline';

import { loginUserAction } from "@/actions/auth";
import { processOtpResend } from "@/util/authHelpers";
import { useAuthStore } from "@/store/authStore";
import { getLoginOptionsAction, verifyPasskeyLoginAction } from "@/actions/passkey";
import { startAuthentication } from "@simplewebauthn/browser";

import { GoogleLoginButton } from "@/components/auth/SocialButtons/GoogleLoginButton";
import { FacebookLoginButton } from "@/components/auth/SocialButtons/FacebookLoginButton";
import { useSocialLogin } from "@/hooks/useSocialLogin";

export default function LoginForm() {
    const loadUser = useAuthStore((state) => state.loadUser);
    const router = useRouter();

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched"
    });
    const { handleGoogleSuccess, handleFacebookSuccess } = useSocialLogin();

    const emailValue = watch("email");

    const onSubmit = async (data: LoginFormValues) => {
        const loadingToast = toast.loading("Signing in...");

        const response = await loginUserAction(data);

        if (response.success) {
            await loadUser();
            router.replace('/');
            router.refresh();

            toast((t) => (
                <div className="flex flex-col gap-2 p-1">
                    <p className="text-sm text-gray-800 font-semibold">
                        Welcome back! 🎉
                    </p>
                    <p className="text-sm text-gray-600">
                        For faster and secure logins, please visit your profile and setup a Passkey.
                    </p>
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                router.push('/profile');
                            }}
                            className="bg-orange-500 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-orange-600 transition"
                        >
                            Visit Profile
                        </button>
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                            }}
                            className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-200 transition"
                        >
                            OK
                        </button>
                    </div>
                </div>
            ), {
                id: loadingToast,
                duration: 8000
            });
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

    const handlePasskeyLogin = async () => {
        if (!emailValue) {
            toast.error("Please enter your email address first.");
            return;
        }

        const toastId = toast.loading("Verifying your passkey...");

        try {
            const optionsRes = await getLoginOptionsAction(emailValue);

            if (!optionsRes.success || !optionsRes.data) {
                toast.error(optionsRes.error || "No passkeys found for this email", { id: toastId });
                return;
            }

            let passkeyOptions = optionsRes.data.data || optionsRes.data;
            if (passkeyOptions.publicKey) {
                passkeyOptions = passkeyOptions.publicKey;
            }

            let authResp;
            try {
                authResp = await startAuthentication(passkeyOptions);
            } catch (err: any) {
                toast.error("Login cancelled or failed", { id: toastId });
                return;
            }

            toast.loading("Authenticating...", { id: toastId });

            const verifyRes = await verifyPasskeyLoginAction(authResp);

            if (verifyRes.success) {
                toast.success("Welcome back!", { id: toastId });
                await loadUser();
                router.replace('/');
            } else {
                toast.error("Passkey verification failed", { id: toastId });
            }

        } catch (error) {
            toast.error("An unexpected error occurred", { id: toastId });
            console.error(error);
        }
    };
    // --------------------------------------------------

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

                <div className="pt-2 space-y-3">
                    {/* Normal Sign In Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
                    >
                        {isSubmitting ? "Signing In..." : "Sign In"}
                    </button>

                    <button
                        type="button"
                        onClick={handlePasskeyLogin}
                        className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                        <KeyIcon className="h-5 w-5 mr-2 text-orange-500" />
                        Sign in with Passkey
                    </button>
                </div>
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