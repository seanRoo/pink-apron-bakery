import { motion, useAnimation } from "framer-motion";
import { ShoppingCart, Search, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import CartDrawer from "@/components/CartDrawer";
import { useCartCount } from "@/store/cart";

export default function Header() {
  const count = useCartCount();
  const prevCount = useRef(count);
  const controls = useAnimation();
  // Animate cart icon when count increases
  useEffect(() => {
    if (count > prevCount.current) {
      controls.start({ scale: [1, 1.2], transition: { duration: 0.3, type: "spring" } });
      setTimeout(() => controls.start({ scale: 1 }), 300);
    }
    prevCount.current = count;
  }, [count, controls]);
  const [open, setOpen] = useState(false);

  // search sync with /products?q=
  const navigate = useNavigate();
  const location = useLocation();
  const [q, setQ] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQ(params.get("q") ?? "");
  }, [location.search]);
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  return (
    <>
      <header className="border-rose/15 bg-cream/85 supports-[backdrop-filter]:bg-cream/70 sticky top-0 z-50 border-b backdrop-blur">
        <div className="mx-auto max-w-7xl px-4">
          {/* ONE ROW: logo | center (nav + search) | cart */}
          <div className="flex items-center gap-4 py-3">
            {/* Left: logo */}
            <Link to="/" className="flex shrink-0 items-center" aria-label="Pink Apron Bakery home">
              <span className="border-rose bg-cream inline-flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-sm">
                <img
                  src="/img/logo.svg"
                  alt="Pink Apron Bakery logo"
                  width={56}
                  height={56}
                  className="h-10 w-10 object-contain"
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                />
              </span>
              <span className="sr-only">Pink Apron Bakery</span>
            </Link>

            {/* Middle: nav + search (share the space) */}
            <div className="flex min-w-0 flex-1 items-center justify-center gap-6">
              {/* nav */}
              <nav className="text-apron hidden flex-wrap items-center gap-6 font-medium sm:flex">
                <NavLink
                  end
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "text-rose underline underline-offset-4" : "hover:text-rose"
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    isActive ? "text-rose underline underline-offset-4" : "hover:text-rose"
                  }
                >
                  View all products
                </NavLink>
                <NavLink
                  to="/enquiry"
                  className={({ isActive }) =>
                    isActive ? "text-rose underline underline-offset-4" : "hover:text-rose"
                  }
                >
                  Cake enquiry
                </NavLink>
              </nav>

              {/* search (fixed width that shrinks gracefully) */}
              <form onSubmit={onSearch} className="max-w-[28rem] min-w-[8rem] flex-1">
                <div className="border-rose/30 relative overflow-hidden rounded-2xl border shadow-sm">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search cakes"
                    className="placeholder:text-warmgray w-full bg-white/80 px-4 py-2.5 pr-12 outline-none"
                    aria-label="Search cakes"
                  />
                  {q && (
                    <button
                      type="button"
                      className="text-apron hover:text-rose absolute inset-y-0 right-10 grid aspect-square place-items-center"
                      aria-label="Clear search"
                      onClick={() => {
                        setQ("");
                        navigate("/products");
                      }}
                      tabIndex={0}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-rose/90 hover:bg-rose absolute inset-y-0 right-0 grid aspect-square cursor-pointer place-items-center text-white"
                    aria-label="Search"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right: cart */}
            <button
              className="text-apron hover:text-rose relative shrink-0 cursor-pointer"
              onClick={() => setOpen(true)}
              aria-label="Open cart"
            >
              <motion.span animate={controls} className="inline-block">
                <ShoppingCart className="h-7 w-7" strokeWidth={2.1} />
              </motion.span>
              {count > 0 && (
                <span className="bg-apron absolute -top-2 -right-3 min-w-[18px] rounded-full px-1 text-center text-xs text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
