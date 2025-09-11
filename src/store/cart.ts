import { persist } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import type { CartItem, CartState, Fulfilment } from "@/types/cart";

type Actions = {
  add: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  remove: (productId: string, selectedKey?: string) => void;
  updateQty: (productId: string, qty: number, selectedKey?: string) => void;
  clear: () => void;
  setFulfilment: (f: Fulfilment) => void;
  setDeliveryFee: (fee: number) => void;
  setNote: (note?: string) => void;
};

type Store = CartState & Actions;

const keyOf = (item: CartItem): string => {
  const size = item.selected?.size ?? "";
  const flavour = item.selected?.flavour ?? "";
  const addOns = (item.selected?.addOns ?? []).join(",");
  return `${item.productId}|${size}|${flavour}|${addOns}`;
};

export const useCart = createWithEqualityFn<Store>()(
  persist(
    (set) => ({
      items: [],
      fulfilment: "pickup",
      deliveryFee: 0,
      note: "",

      add: (item: Omit<CartItem, "qty"> & { qty?: number }) =>
        set((state: Store) => {
          const newItem: CartItem = { ...item, qty: item.qty ?? 1 };
          const k = keyOf(newItem);
          const idx = state.items.findIndex((i: CartItem) => keyOf(i) === k);
          if (idx >= 0) {
            const copy = [...state.items];
            copy[idx] = { ...copy[idx], qty: copy[idx].qty + (newItem.qty ?? 1) };
            return { items: copy };
          }
          return { items: [...state.items, newItem] };
        }),

      remove: (productId: string, selectedKey?: string) =>
        set((state: Store) => ({
          items: state.items.filter((i: CartItem) =>
            selectedKey ? keyOf(i) !== selectedKey : i.productId !== productId,
          ),
        })),

      updateQty: (productId: string, qty: number, selectedKey?: string) =>
        set((state: Store) => ({
          items: state.items.map((i: CartItem) => {
            const match = selectedKey ? keyOf(i) === selectedKey : i.productId === productId;
            return match ? { ...i, qty: Math.max(1, qty) } : i;
          }),
        })),

      clear: () => set({ items: [] }),

      // also handle default delivery fee here so UI doesn’t set state during render
      setFulfilment: (f: Fulfilment) =>
        set((state: Store) => {
          if (f === "delivery" && state.deliveryFee === 0) {
            return { fulfilment: f, deliveryFee: 6 };
          }
          return { fulfilment: f };
        }),

      setDeliveryFee: (fee: number) => set({ deliveryFee: Math.max(0, fee) }),
      setNote: (note?: string) => set({ note: note ?? "" }),
    }),
    { name: "pab_cart_v1" },
  ),
);

// selectors
export const useCartCount = () =>
  useCart((s: Store) => s.items.reduce((sum: number, i: CartItem) => sum + i.qty, 0));

export const useCartTotals = () =>
  useCart((s: Store) => {
    const subtotal = s.items.reduce((sum: number, i: CartItem) => sum + i.unitPrice * i.qty, 0);
    const total = subtotal + (s.fulfilment === "delivery" ? s.deliveryFee : 0);
    return [subtotal, total] as const;
  }, shallow);
