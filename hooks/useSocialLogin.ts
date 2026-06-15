'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { googleLoginAction, facebookLoginAction } from '@/actions/auth';
import { useAuthStore } from '@/store/authStore';

export const useSocialLogin = () => {
    const router = useRouter();
    const loadUser = useAuthStore((state) => state.loadUser);

    const handleGoogleSuccess = async (credentialResponse: any) => {
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
    };

    const handleFacebookSuccess = async (response: any) => {
        const loadingId = toast.loading("Verifying with Facebook...");
        const fbToken = response.accessToken;

        if (fbToken) {
            const res = await facebookLoginAction(fbToken);
            if (res.success) {
                toast.success("Successfully logged in!", { id: loadingId });
                await loadUser();
                router.replace('/');
            } else {
                toast.error(res.error, { id: loadingId });
            }
        }
    };

    return { handleGoogleSuccess, handleFacebookSuccess };
};