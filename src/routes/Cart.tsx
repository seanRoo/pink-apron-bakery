import { CartEmptyState } from "@/components/CartEmptyState";
import CartLineItem from "@/components/CartLineItem";
import CartTotals from "@/components/CartTotals";
import { Button } from "@/components/ui/button";
// import { Spinner } from "@/components/ui/Spinner";
// import { useStripeCheckout } from "@/lib/useStripeCheckout";
import { useCart } from "@/store/cart";

export default function Cart() {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const hasItems = items.length > 0;
  // Remove loading and checkout logic from here, move to CartTotals

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">Your Cart</h2>

          {!items.length && <CartEmptyState />}

          <div className="mt-4">
            {items.map((i) => (
              <CartLineItem
                key={`${i.productId}-${i.slug}-${i.qty}-${i.selected?.size ?? ""}`}
                item={i}
              />
            ))}
          </div>

          {items.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                className="border-rose text-rose hover:bg-rose/10 focus:ring-rose/40 rounded-full border-2 px-12 py-3 text-lg font-semibold shadow transition-colors focus:ring-2"
                disabled={!hasItems}
                onClick={clear}
                title="Remove all items"
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        <aside className="w-full lg:w-80 lg:flex-shrink-0">
          <CartTotals />
        </aside>
      </div>
    </section>
  );
}
