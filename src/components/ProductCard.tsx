import { ShoppingBag } from "lucide-react";

import ResponsiveProductImage from "@/components/ResponsiveProductImage";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
  hidePrice?: boolean;
  hideTags?: boolean;
};

export default function ProductCard({ product, hidePrice, hideTags }: Props) {
  // Use the product's image directly (spotlight cakes already have correct paths)
  const imageSrc = product.images[0] || "/img/placeholder.png";

  return (
    <div className="group bg-cream hover:border-rose/20 flex h-full cursor-pointer flex-col rounded-xl border border-transparent p-3 shadow-sm transition-all hover:scale-[1.025] hover:shadow-lg">
      <div className="relative mb-2 aspect-[3/4] overflow-hidden rounded-2xl">
        <ResponsiveProductImage
          src={imageSrc}
          alt={product.name}
          className="h-full w-full rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-black/0 transition-all duration-300 group-hover:bg-black/20">
          <div className="translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="bg-white/90 rounded-full p-3 shadow-lg">
              <ShoppingBag className="text-apron h-6 w-6" strokeWidth={1.5} />
            </div>
          </div>
          <span className="translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 text-white text-sm font-semibold drop-shadow">
            Enquire to order
          </span>
        </div>
      </div>

      {!hideTags && (
        <div className="mt-1 mb-1 flex items-center gap-2">
          <span className="bg-apron/10 text-apron rounded-full px-2 py-0.5 text-xs font-medium">
            {product.category}
          </span>
          {product.featured && (
            <span className="bg-rose rounded-full px-2 py-0.5 text-xs font-semibold text-white">
              Featured
            </span>
          )}
        </div>
      )}
      <h3 className="mb-1 text-lg leading-tight font-semibold">{product.name}</h3>
      {!hidePrice && (
        <div className="text-rose mb-2 text-base font-bold">{formatPrice(product.price_eur)}</div>
      )}

      {/* spacer → pins button to bottom */}
      <div className="mt-auto" />
    </div>
  );
}
