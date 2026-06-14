'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formAnimationVariant } from "@/util/animations";
import { verifyOtpSchema, VerifyOtpValues } from "@/util/validations";
import { resendOtpAction, verifyOtpAction } from "@/actions/auth";

export default function OtpVerificationForm() {
    const router = useRouter();
    const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
    const [expiryTime, setExpiryTime] = useState<number | null>(() => {
        if (typeof window !== 'undefined') {
            const savedExpiry = sessionStorage.getItem('otpExpiry');
            return savedExpiry ? parseInt(savedExpiry) : null;
        }
        return null;
    });
    const [timeLeft, setTimeLeft] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedExpiry = sessionStorage.getItem('otpExpiry');
            if (savedExpiry) {
                const remaining = Math.max(0, parseInt(savedExpiry) - Date.now());
                return Math.floor(remaining / 1000);
            }
        }
        return 0;
    });
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(4).fill(null));

    const { handleSubmit, setValue, formState: { isSubmitting, errors } } = useForm<VerifyOtpValues>({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: {
            email: typeof window !== 'undefined' ? sessionStorage.getItem('verifyEmail') || '' : '',
            otp: ''
        }
    });

    useEffect(() => {
        const savedExpiry = sessionStorage.getItem('otpExpiry');
        if (savedExpiry) {
            const expiry = parseInt(savedExpiry);
            if (expiry > Date.now()) setExpiryTime(expiry);
        }
    }, []);

    useEffect(() => {
        if (!expiryTime) {
            setTimeLeft(0);
            return;
        }

        const interval = setInterval(() => {
            const remaining = Math.max(0, expiryTime - Date.now());
            setTimeLeft(Math.floor(remaining / 1000));
            if (remaining <= 0) {
                clearInterval(interval);
                setTimeLeft(0);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [expiryTime]);

    const formattedTime = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return;
        if (isNaN(Number(value)) && value !== '') return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setValue("otp", newOtp.join(''), { shouldValidate: true });

        if (value !== '' && index < 3) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').slice(0, 4); // 5 වෙනුවට 4
        if (/^\d+$/.test(pasted)) {
            const digits = pasted.split('');
            setOtp(digits);
            setValue("otp", pasted, { shouldValidate: true });
        }
    };

    const handleResend = async () => {
        const email = sessionStorage.getItem('verifyEmail') || '';
        const res = await resendOtpAction({ email });

        if (res.success) {
            const seconds = res.data?.cooldownSeconds || 120;
            const newExpiry = Date.now() + (seconds * 1000);
            setExpiryTime(newExpiry);
            sessionStorage.setItem('otpExpiry', newExpiry.toString());
            toast.success("New OTP sent!");
        } else {
            toast.error(res.data?.message || "Failed to resend", { id: 'otp-error' });
        }
    };

    const onSubmit = async (data: VerifyOtpValues) => {
        const loading = toast.loading("Verifying...");
        const res = await verifyOtpAction(data);
        toast.dismiss(loading);

        if (res.success) {
            toast.success("Verified!");
            sessionStorage.removeItem('otpExpiry');
            router.push('/login');
        } else {
            toast.error(res.message, { id: 'otp-error' });
        }
    };

    return (
        <motion.div
            variants={formAnimationVariant}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 text-center">Verify Your Email</h2>
            <p className="text-sm text-gray-500 text-center">We sent a 4‑digit code. Enter it below.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex justify-center gap-3" onPaste={handlePaste}>
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={(el) => { inputRefs.current[idx] = el; }}
                            type="text"
                            maxLength={1}
                            inputMode="numeric"
                            value={digit}
                            onChange={(e) => handleChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            className={`w-12 h-12 text-center text-xl font-semibold border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                                errors.otp ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                    ))}
                </div>

                {errors.otp && <p className="text-sm text-red-500 text-center">{errors.otp.message}</p>}

                <div className="flex justify-center items-center gap-2">
                    {timeLeft > 0 ? (
                        <span className="text-sm text-gray-500" suppressHydrationWarning={true}>
                            Resend code in <span className="text-orange-500 font-semibold">{formattedTime}</span>
                        </span>
                    ) : (
                        <button type="button" onClick={handleResend} className="text-sm font-medium text-orange-500 underline">
                            Resend OTP
                        </button>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 bg-orange-500 text-white rounded-md shadow-sm hover:bg-orange-600 disabled:bg-orange-300 transition"
                >
                    {isSubmitting ? "Verifying..." : "Verify"}
                </button>
            </form>
        </motion.div>
    );
}