import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
// Common allergens for filtering
const ALLERGENS = ["gluten", "eggs", "dairy", "nuts"];
import { useLocation } from "react-router-dom";

import CategoryPills from "@/components/CategoryPills";
import ProductCard from "@/components/ProductCard";
import { Spinner } from "@/components/ui/Spinner";
import { type CategoryFilter } from "@/config/app";
import { fetchProducts } from "@/lib/csv/parseProducts";
import { makeProductSearch, runSearch } from "@/lib/search/fuse";
import type { Product } from "@/types/product";

export default function Products() {
  const [all, setAll] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [allergyFilters, setAllergyFilters] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then(setAll)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  // Sync query with ?q= in URL (set by header search)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("q") ?? "");
  }, [location.search]);

  const filtered = useMemo(() => {
    let items = all;
    if (category === "Featured") {
      items = items.filter((p) => p.featured);
    } else if (category !== "All") {
      items = items.filter((p) => p.category === category);
    }
    if (allergyFilters.length > 0) {
      items = items.filter(
        (p) => !p.allergens?.some((a) => allergyFilters.includes(a.toLowerCase())),
      );
    }
    if (query.trim()) {
      const f = makeProductSearch(items);
      return runSearch(f, query);
    }
    return items;
  }, [all, category, query, allergyFilters]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1
          className="text-rose font-script text-4xl tracking-wide drop-shadow-sm md:text-5xl"
          style={{ textShadow: "0 2px 8px rgba(255, 192, 203, 0.15)" }}
        >
          All cakes
        </h1>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <CategoryPills value={category} onChange={setCategory} />
        {/* Allergy filter pills */}
        <span className="text-warmgray mr-1 ml-4 text-xs font-medium">
          Exclude cakes containing:
        </span>
        {ALLERGENS.map((allergen) => (
          <button
            key={allergen}
            type="button"
            className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              allergyFilters.includes(allergen)
                ? "bg-rose border-rose text-white"
                : "text-apron border-apron/20 hover:bg-apron/10 bg-white"
            }`}
            onClick={() =>
              setAllergyFilters((prev) =>
                prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen],
              )
            }
            aria-pressed={allergyFilters.includes(allergen)}
            title={`Exclude cakes containing ${allergen}`}
          >
            {allergyFilters.includes(allergen)
              ? `✕ ${allergen.charAt(0).toUpperCase() + allergen.slice(1)}`
              : allergen.charAt(0).toUpperCase() + allergen.slice(1)}
          </button>
        ))}
      </div>

      {error && <p className="mt-3 text-red-600">Error: {error}</p>}

      <p className="text-warmgray mt-3 text-sm">
        {filtered.length} {filtered.length === 1 ? "item" : "items"}
        {category !== "All" ? ` in ${category}` : ""}
        {query ? ` matching “${query}”` : ""}
      </p>

      <div className="mt-4 grid min-h-[180px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <Spinner className="text-apron mb-4 h-10 w-10" />
            <div className="text-warmgray text-sm">Loading products…</div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                className="col-span-full flex flex-col items-center justify-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layout
              >
                <img
                  src="/img/placeholder.jpg"
                  alt="No products found"
                  className="border-apron/10 mb-4 h-24 w-24 rounded-full border object-contain opacity-80 drop-shadow-sm"
                  draggable="false"
                />
                <div className="text-apron mb-1 font-sans text-lg font-medium tracking-tight">
                  No products found
                </div>
                <p className="text-warmgray max-w-xs text-center text-sm">
                  Try adjusting your filters or search to find something delicious.
                </p>
              </motion.div>
            ) : (
              filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  transition={{ delay: i * 0.04, duration: 0.32, type: "spring", stiffness: 60 }}
                  layout
                >
                  <ProductCard product={{ ...p, images: ["/img/placeholder.jpg"] }} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
