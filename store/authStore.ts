import { create } from 'zustand';
import {getMyDetailsAction, logoutAction} from "@/actions/user";
import {Address} from "@/components/profile/AddressModal";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    addresses?: Address[];
    orders?: any[];
    telephone?: string;
    authProvider: string;
    passkeys?: any[];
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    loadUser: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    (set) => (
        {
            user: null,
            isLoading: true,
            loadUser: async () => {
                set({ isLoading: true });
                const response = await getMyDetailsAction();

                if (response.success && response.data) {
                    set({ user: response.data, isLoading: false });
                } else {
                    set({ user: null, isLoading: false });
                }
            },
            logout: async () => {
                set({ isLoading: true });
                await logoutAction();
                set({ user: null, isLoading: false });
            }
        }

    )
);