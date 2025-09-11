import ResponsiveProductImage from "@/components/ResponsiveProductImage";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/store/cart";
import type { Product } from "@/types/product";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const add = useCart((s) => s.add);

  return (
    <div className="bg-cream hover:border-rose/20 flex h-full flex-col rounded-xl border border-transparent p-3 shadow-sm transition-all hover:shadow-lg">
      <div className="mb-2 aspect-square overflow-hidden rounded-2xl">
        <ResponsiveProductImage
          src={product.images?.[0] || "/img/placeholder.jpg"}
          alt={product.name}
          className="h-full w-full rounded-2xl object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </div>

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
      <h3 className="mb-1 text-lg leading-tight font-semibold">{product.name}</h3>
      <div className="text-rose mb-2 text-base font-bold">{formatPrice(product.price_eur)}</div>

      {/* spacer → pins button to bottom */}
      <div className="mt-auto" />

      <button
        type="button"
        onClick={() =>
          add({
            productId: product.id,
            name: product.name,
            slug: product.slug,
            unitPrice: product.price_eur,
            qty: 1,
            image: product.images[0],
          })
        }
        className="bg-apron hover:bg-rose mt-3 w-full cursor-pointer rounded-xl py-2 text-white active:opacity-90"
      >
        Add to cart
      </button>
    </div>
  );
}
