import { useMemo } from "react";

import ResponsiveProductImage from "@/components/ResponsiveProductImage";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/store/cart";
import type { CartItem } from "@/types/cart";

type Props = { item: CartItem };

const selectedKey = (i: CartItem) => {
  const size = i.selected?.size ?? "";
  const flavour = i.selected?.flavour ?? "";
  const addOns = (i.selected?.addOns ?? []).join(",");
  return `${i.productId}|${size}|${flavour}|${addOns}`;
};

export default function CartLineItem({ item }: Props) {
  const remove = useCart((s) => s.remove);
  const updateQty = useCart((s) => s.updateQty);

  const key = useMemo(() => selectedKey(item), [item]);

  return (
    <div className="border-rose/10 mb-4 flex gap-3 rounded-2xl border bg-white/80 px-4 py-4 shadow-sm transition hover:shadow-md">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-white">
        <ResponsiveProductImage
          src="/img/placeholder.png"
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1">
        <div className="font-medium">{item.name}</div>
        {item.selected?.size && (
          <div className="text-warmgray text-xs">Size: {item.selected.size}</div>
        )}
        {item.selected?.flavour && (
          <div className="text-warmgray text-xs">Flavour: {item.selected.flavour}</div>
        )}
        {!!item.selected?.addOns?.length && (
          <div className="text-warmgray text-xs">Add-ons: {item.selected.addOns?.join(", ")}</div>
        )}

        <div className="mt-2 flex items-center gap-2">
          <div className="border-rose/20 inline-flex items-center overflow-hidden rounded-xl border">
            <button
              className="hover:bg-cream cursor-pointer px-3 py-1"
              onClick={() => updateQty(item.productId, item.qty - 1, key)}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <div className="px-3 py-1 select-none">{item.qty}</div>
            <button
              className="hover:bg-cream cursor-pointer px-3 py-1"
              onClick={() => updateQty(item.productId, item.qty + 1, key)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            className="text-rose cursor-pointer text-sm hover:underline"
            onClick={() => remove(item.productId, key)}
          >
            Remove
          </button>

          <div className="ml-auto font-medium">{formatPrice(item.unitPrice * item.qty)}</div>
        </div>
      </div>
    </div>
  );
}
