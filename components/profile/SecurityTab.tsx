'use client';

import {useEffect, useState} from 'react';
import { KeyIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from "motion/react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/store/authStore";
import {useForm} from "react-hook-form";
import {updatePasswordSchema, UpdatePasswordValues} from "@/util/validations";
import {zodResolver} from "@hookform/resolvers/zod";
import {updatePasswordAction} from "@/actions/user";
import {deletePasskeyAction, getRegisterOptionsAction, verifyRegistrationAction} from "@/actions/passkey";
import {startRegistration} from "@simplewebauthn/browser";
import {showConfirmToast} from "@/components/ui/ConfirmToast";

export function SecurityTab({ user }: { user: any }) {
    const [passkeys, setPasskeys] = useState<any[]>(user.passkeys || []);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const loadUser = useAuthStore((state) => state.loadUser);
    const [isAdding, setIsAdding] = useState(false);

    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        if (user && user.passkeys) {
            setPasskeys(user.passkeys);
        }
    }, [user.passkeys]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<UpdatePasswordValues>({
        resolver: zodResolver(updatePasswordSchema),
        mode: 'onTouched'
    });

    const onPasswordSubmit = async (data: UpdatePasswordValues) => {
        const res = await updatePasswordAction(data.currentPassword, data.newPassword);

        if (res.success) {
            toast.success("Security update! You are being logged out. Please re-login and verify OTP.", { duration: 5000 });
            reset();
            setShowChangePassword(false);

            await logout();
            router.push('/login');
        } else {
            toast.error(res.error || "Incorrect current password");
        }
    };

    const handleRegisterPasskey = async () => {
        if (isAdding) return;

        setIsAdding(true);
        try {
            const toastId = toast.loading("Connecting to authenticator...");

            const optionsRes = await getRegisterOptionsAction();
            if (!optionsRes.success || !optionsRes.data) {
                toast.error("Could not start registration", { id: toastId });
                return;
            }

            const passkeyOptions = optionsRes.data.data;

            console.log("Passing to startRegistration:", passkeyOptions);

            let attResp;
            try {
                attResp = await startRegistration(passkeyOptions);
            } catch (err: any) {
                if (err.name === 'NotAllowedError') {
                    toast.error("Registration cancelled", { id: toastId });
                } else {
                    toast.error("Hardware error or cancelled", { id: toastId });
                }
                return;
            }

            toast.loading("Verifying...", { id: toastId });

            const deviceName = prompt("Give this device a name:", "My Passkey");

            const verifyRes = await verifyRegistrationAction(attResp, deviceName || "New Device");

            if (verifyRes.success) {
                toast.success("Passkey added successfully!", { id: toastId });
                await loadUser();
            } else {
                toast.error(verifyRes.error || "Verification failed", { id: toastId });
            }

        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error(error);
        }finally {
            setIsAdding(false);
        }
    };
    const handleRemovePasskey = (id: string) => {
        showConfirmToast({
            title: "Remove Passkey?",
            message: "Are you sure you want to remove this device? You will need to re-register it to use it again.",
            confirmText: "Remove",
            onConfirm: async () => {
                const toastId = toast.loading("Removing passkey...");

                const res = await deletePasskeyAction(id);

                if (res.success) {
                    toast.success("Passkey removed", { id: toastId });
                    await loadUser();
                } else {
                    toast.error(res.error || "Failed to remove", { id: toastId });
                }
            }
        });
    }

    return (
        <div className="space-y-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Sign-in Method</h3>
                {user.authProvider === 'GOOGLE' && (

                    <div className="flex items-center gap-3">

                        <img src="/google-icon.svg" alt="Google" className="h-6 w-6" />

                        <span className="text-sm text-gray-700">You are signed in securely via your Google account ({user.email}).</span>

                    </div>

                )}

                {user.authProvider === 'FACEBOOK' && (

                    <div className="flex items-center gap-3">

                        <img src="/facebook-icon.svg" alt="Facebook" className="h-6 w-6" />

                        <span className="text-sm text-gray-700">You are signed in securely via your Facebook account ({user.email}).</span>

                    </div>

                )}
                {user.authProvider === 'LOCAL' && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="text-sm text-gray-700">
                            <p>You sign in using your email and password.</p>
                            <p className="font-medium mt-1">{user.email}</p>
                        </div>
                        <button
                            onClick={() => {
                                setShowChangePassword(!showChangePassword);
                                reset();
                            }}
                            className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors whitespace-nowrap"
                        >
                            {showChangePassword ? 'Cancel' : 'Change Password'}
                        </button>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {user.authProvider === 'LOCAL' && showChangePassword && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleSubmit(onPasswordSubmit)} className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
                            <h4 className="text-sm font-semibold text-gray-800">Update Password</h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <input
                                        type="password"
                                        placeholder="Current password"
                                        {...register("currentPassword")}
                                        className={`px-3 py-2 w-full border rounded-md focus:outline-none focus:ring-orange-500 sm:text-sm ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.currentPassword && <p className="mt-1 text-xs text-red-600">{errors.currentPassword.message}</p>}
                                </div>

                                {/* New Password */}
                                <div>
                                    <input
                                        type="password"
                                        placeholder="New password"
                                        {...register("newPassword")}
                                        className={`px-3 py-2 w-full border rounded-md focus:outline-none focus:ring-orange-500 sm:text-sm ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.newPassword && <p className="mt-1 text-xs text-red-600">{errors.newPassword.message}</p>}
                                </div>

                                <div>
                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        {...register("confirmNewPassword")}
                                        className={`px-3 py-2 w-full border rounded-md focus:outline-none focus:ring-orange-500 sm:text-sm ${errors.confirmNewPassword ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.confirmNewPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmNewPassword.message}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-md transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="border-t border-gray-200 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <KeyIcon className="h-5 w-5 text-orange-500" />
                            Passkeys
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Login instantly without passwords using your fingerprint, FaceID, or screen lock.
                        </p>
                    </div>
                    <button
                        onClick={handleRegisterPasskey}
                        disabled={isAdding}
                        className="inline-flex items-center justify-center px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-md hover:bg-orange-600 transition-colors whitespace-nowrap shadow-sm"
                    >
                        <PlusIcon className="h-4 w-4 mr-1.5" />
                        Add Passkey
                    </button>
                </div>

                {passkeys.length > 0 ? (
                    <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                        {passkeys.map((pk) => (
                            <li key={pk.id} className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                                        <KeyIcon className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{pk.deviceName || 'Unknown Device'}</p>
                                        <p className="text-xs text-gray-500">
                                            Added on {new Date(pk.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => handleRemovePasskey(pk.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Remove passkey">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                        <p className="text-sm text-gray-500">No passkeys added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}