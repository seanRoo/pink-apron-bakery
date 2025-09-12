import * as React from "react";

import ResponsiveProductImage from "@/components/ResponsiveProductImage";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/store/cart";
import type { Product } from "@/types/product";

interface ProductDetailSheetProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailSheet({ product, open, onOpenChange }: ProductDetailSheetProps) {
  const add = useCart((s) => s.add);
  const [flavour, setFlavour] = React.useState("");
  const [size, setSize] = React.useState("");

  React.useEffect(() => {
    if (product) {
      setFlavour(product.options_flavour[0] || "");
      setSize(product.options_size_servings[0]?.size || "");
    }
  }, [product]);

  if (!product) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>{product.name}</SheetTitle>
        </SheetHeader>
        <div className="mb-4">
          <ResponsiveProductImage
            src={product.images?.[0] || "/img/placeholder.jpg"}
            alt={product.name}
            className="mb-2 h-48 w-full rounded-xl object-cover"
          />
          <div className="text-rose mb-1 text-lg font-bold">{formatPrice(product.price_eur)}</div>
          <div className="text-warmgray mb-2 text-sm">{product.description}</div>
          <div className="mb-2">
            <label className="mb-1 block text-xs font-medium">Flavour</label>
            <select
              className="w-full rounded border px-2 py-1"
              value={flavour}
              onChange={(e) => setFlavour(e.target.value)}
            >
              {product.options_flavour.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium">Serving Size</label>
            <select
              className="w-full rounded border px-2 py-1"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              {product.options_size_servings.map((s) => (
                <option key={s.size} value={s.size}>
                  {s.size} ({s.serves} serves)
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="bg-apron hover:bg-rose mt-2 w-full rounded-xl py-2 font-semibold text-white"
            onClick={() => {
              add({
                productId: product.id,
                name: product.name,
                slug: product.slug,
                unitPrice: product.price_eur,
                qty: 1,
                image: product.images[0],
                selected: { flavour, size },
              });
              onOpenChange(false);
            }}
          >
            Add to cart
          </button>
        </div>
        <SheetClose className="absolute top-4 right-4" />
      </SheetContent>
    </Sheet>
  );
}
