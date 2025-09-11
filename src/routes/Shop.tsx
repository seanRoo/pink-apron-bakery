import { useEffect, useState } from "react";

import { fetchProducts } from "@/lib/csv/parseProducts";
import type { Product } from "@/types/product";

export default function Shop() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  if (error) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-2xl font-semibold">Shop</h2>
        <p className="text-red-600">Error: {error}</p>
      </section>
    );
  }

  if (!products) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-2xl font-semibold">Shop</h2>
        <p className="text-warmgray">Loading products…</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-2xl font-semibold">Shop</h2>
      <p className="mb-4 text-warmgray">{products.length} items</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <div key={p.id} className="rounded-xl bg-cream p-3">
            <div className="aspect-square overflow-hidden rounded-lg">
              {/* placeholder; will be a proper component later */}
              <img
                src={p.images[0] ?? "/img/placeholder.jpg"}
                alt={p.name}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="mt-2 text-sm text-warmgray">{p.category}</div>
            <div className="font-medium">{p.name}</div>
            <div className="text-ink/80">€ {p.price_eur.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
