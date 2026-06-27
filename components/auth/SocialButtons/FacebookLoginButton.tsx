'use client';
import FacebookLogin from '@greatsumini/react-facebook-login';

interface FacebookButtonProps {
    onSuccess: (response: any) => void;
    onFail: (error: any) => void;
}

export const FacebookLoginButton = ({ onSuccess, onFail }: FacebookButtonProps) => {
    return (
        <FacebookLogin
            appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!}
            onSuccess={onSuccess}
            onFail={onFail}
            render={({ onClick }) => (
                <div className="w-full flex justify-center">
                    <button
                        type="button"
                        onClick={onClick}
                        className="w-full max-w-[340px] h-[40px] flex items-center justify-center gap-2 px-3 border border-transparent rounded-[4px] shadow-sm text-[14px] font-medium text-white bg-[#1877F2] hover:bg-[#155fc0] transition-colors"
                    >
                        <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                        <span className="truncate">Continue with Facebook</span>
                    </button>
                </div>
            )}
        />
    );
};