import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ResponsiveProductImage from "@/components/ResponsiveProductImage";
import { makeProductSearch, runSearch } from "@/lib/search/fuse";
import type { Product } from "@/types/product";

interface SearchSuggestionDropdownProps {
  query: string;
  products: Product[];
  onClose: () => void;
}

export default function SearchSuggestionDropdown({
  query,
  products,
  onClose,
}: SearchSuggestionDropdownProps) {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const fuseRef = useRef<ReturnType<typeof makeProductSearch> | null>(null);

  useEffect(() => {
    fuseRef.current = makeProductSearch(products);
  }, [products]);

  useEffect(() => {
    if (fuseRef.current && query.trim()) {
      setSuggestions(runSearch(fuseRef.current, query).slice(0, 5));
    } else {
      setSuggestions([]);
    }
    setActive(0);
  }, [query, products]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      setActive((a) => (a + 1) % suggestions.length);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setActive((a) => (a - 1 + suggestions.length) % suggestions.length);
      e.preventDefault();
    } else if (e.key === "Enter") {
      navigate(`/products?q=${encodeURIComponent(suggestions[active].name)}`);
      onClose();
    }
  };

  if (!query.trim() || !suggestions.length) return null;

  return (
    <div
      className="border-rose/20 bg-cream absolute top-full right-0 left-0 z-40 mt-1 rounded-2xl border shadow-lg"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="text-rose/80 px-4 pt-3 pb-1 text-xs font-bold tracking-widest">PRODUCTS</div>
      {suggestions.map((product, i) => (
        <button
          key={product.id}
          type="button"
          className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left transition-colors ${
            i === active ? "bg-rose/10" : "hover:bg-rose/5"
          }`}
          onClick={() => {
            navigate(`/products?q=${encodeURIComponent(product.name)}`);
            setTimeout(onClose, 100);
          }}
        >
          <ResponsiveProductImage
            src={"/img/cupcakes.png"}
            alt={product.name}
            className="border-rose/10 h-12 w-12 rounded border bg-white object-cover"
            loading="lazy"
          />
          <span className="text-apron text-base font-semibold">{product.name}</span>
        </button>
      ))}
      <button
        className="text-rose hover:bg-rose/10 flex w-full items-center justify-between px-4 py-3 text-left text-base font-medium"
        onClick={() => {
          navigate(`/products?q=${encodeURIComponent(query)}`);
          onClose();
        }}
      >
        Search for “{query}”<span className="ml-2">→</span>
      </button>
    </div>
  );
}
