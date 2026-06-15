'use client';
import { GoogleLogin } from '@react-oauth/google';

interface GoogleButtonProps {
    onSuccess: (credentialResponse: any) => void;
    onError: () => void;
}

export const GoogleLoginButton = ({ onSuccess, onError }: GoogleButtonProps) => {
    return (
        <GoogleLogin
            theme="filled_blue"
            shape="rectangular"
            size="large"
            text="continue_with"
            onSuccess={onSuccess}
            onError={onError}
        />
    );
};