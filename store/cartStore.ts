import { create } from 'zustand';
import {
    getCartAction,
    addToCartAction,
    updateCartQuantityAction,
    removeFromCartAction,
} from '@/actions/cart';

export type CartItemResponse = {
    id: number;
    productId: number;
    productName: string;
    sku: string;
    images: string[];
    unitPrice: number;
    quantity: number;
    subTotal: number;
    availableStock: number;
};

interface CartState {
    cartId: number | null;
    items: CartItemResponse[];
    totalPrice: number;
    totalItems: number;
    isLoading: boolean;

    fetchCart: () => Promise<void>;
    addToCart: (productId: number, quantity?: number) => Promise<boolean>;
    updateQuantity: (cartItemId: number, quantity: number) => Promise<boolean>;
    removeFromCart: (cartItemId: number) => Promise<boolean>;
    clearFrontendCart: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
    cartId: null,
    items: [],
    totalPrice: 0,
    totalItems: 0,
    isLoading: false,

    fetchCart: async () => {
        set({ isLoading: true });
        const res = await getCartAction();
        if (res.success && res.data) {
            set({
                cartId: res.data.cartId,
                items: res.data.items || [],
                totalPrice: res.data.totalPrice || 0,
                totalItems: res.data.totalItems || 0,
                isLoading: false
            });
        } else {
            set({ items: [], totalPrice: 0, totalItems: 0, isLoading: false });
        }
    },

    addToCart: async (productId, quantity = 1) => {
        set({ isLoading: true });
        const res = await addToCartAction(productId, quantity);
        if (res.success && res.data) {
            set({
                cartId: res.data.cartId,
                items: res.data.items || [],
                totalPrice: res.data.totalPrice || 0,
                totalItems: res.data.totalItems || 0,
                isLoading: false
            });
            return true;
        }
        set({ isLoading: false });
        return false;
    },

    updateQuantity: async (cartItemId, quantity) => {
        set({ isLoading: true });
        const res = await updateCartQuantityAction(cartItemId, quantity);
        if (res.success && res.data) {
            set({
                items: res.data.items || [],
                totalPrice: res.data.totalPrice || 0,
                totalItems: res.data.totalItems || 0,
                isLoading: false
            });
            return true;
        }
        set({ isLoading: false });
        return false;
    },

    removeFromCart: async (cartItemId) => {
        set({ isLoading: true });
        const res = await removeFromCartAction(cartItemId);
        if (res.success && res.data) {
            set({
                items: res.data.items || [],
                totalPrice: res.data.totalPrice || 0,
                totalItems: res.data.totalItems || 0,
                isLoading: false
            });
            return true;
        }
        set({ isLoading: false });
        return false;
    },

    clearFrontendCart: () => {
        set({ cartId: null, items: [], totalPrice: 0, totalItems: 0 });
    }
}));