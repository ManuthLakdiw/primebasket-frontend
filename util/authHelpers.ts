import toast from "react-hot-toast";
import { resendOtpAction } from "@/actions/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function processOtpResend(email: string, toastId: string, router: AppRouterInstance) {
    toast.loading("Sending verification code...", { id: toastId });

    const resendRes = await resendOtpAction({ email });

    if (resendRes.success) {
        sessionStorage.setItem('verifyEmail', email);

        const seconds = resendRes.data?.cooldownSeconds || 120;
        const newExpiry = Date.now() + (seconds * 1000);
        sessionStorage.setItem('otpExpiry', newExpiry.toString());

        toast.success("Verification code sent to " + email, { id: toastId });
        router.replace('/verify-otp');
    } else {
        toast.error(resendRes.error || "Failed to send OTP", { id: toastId });
    }
}