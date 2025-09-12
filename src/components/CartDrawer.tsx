import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { CartEmptyState } from "@/components/CartEmptyState";
import CartLineItem from "@/components/CartLineItem";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/Spinner";
import { formatPrice } from "@/lib/format";
import { useStripeCheckout } from "@/lib/useStripeCheckout";
import { useCart, useCartTotals } from "@/store/cart";

type Props = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
};

export default function CartDrawer({ open, onOpenChange }: Props) {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const [subtotal, total] = useCartTotals();
  const fulfilment = useCart((s) => s.fulfilment);
  const setFulfilment = useCart((s) => s.setFulfilment);
  const deliveryFee = useCart((s) => s.deliveryFee);

  const hasItems = items.length > 0;

  // Stripe Checkout handler (shared)
  const [loading, setLoading] = useState(false);
  const { handleCheckout } = useStripeCheckout();
  const onCheckout = async () => {
    setLoading(true);
    await handleCheckout();
    setLoading(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="text-ink flex w-full flex-col bg-white p-0 sm:max-w-md">
        <div className="p-4 pb-2">
          <SheetHeader className="pt-2 pb-3">
            <div className="flex flex-col gap-1 items-start">
              <SheetTitle className="text-rose mb-0.5 font-sans text-2xl font-bold tracking-wide text-left">
                Your cart
              </SheetTitle>
              <div className="bg-rose/20 mb-1 h-1 w-12 rounded-full" />
              <span className="text-warmgray text-xs">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>
          </SheetHeader>
        </div>

        <div className="bg-cream/40 flex-1 overflow-auto p-4">
          {!hasItems && (
            <CartEmptyState buttonHref="/products" onCloseDrawer={() => onOpenChange(false)} />
          )}
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {items.map((i) => (
                <motion.div
                  key={`${i.productId}-${i.slug}-${i.qty}-${i.selected?.size ?? ""}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  transition={{ duration: 0.28, type: "spring", stiffness: 60 }}
                  layout
                >
                  <CartLineItem item={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <Separator />

        <div className="space-y-4 p-4">
          <div className="mb-1 flex gap-2">
            <Button
              variant={fulfilment === "pickup" ? "default" : "outline"}
              className={fulfilment === "pickup" ? "bg-apron hover:bg-rose shadow" : ""}
              onClick={() => setFulfilment("pickup")}
            >
              Pickup
            </Button>
            <Button
              variant={fulfilment === "delivery" ? "default" : "outline"}
              className={fulfilment === "delivery" ? "bg-apron hover:bg-rose shadow" : ""}
              onClick={() => setFulfilment("delivery")}
            >
              Delivery
            </Button>
          </div>

          <div className="text-warmgray mb-2 text-xs">
            {fulfilment === "delivery"
              ? "Flat delivery fee €6 within Kildare (placeholder)."
              : "Pick a date/time at checkout (placeholder)."}
          </div>

          <div className="bg-cream/60 space-y-1 rounded-xl p-3 text-sm shadow-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {fulfilment === "delivery" && (
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
            )}
            <div className="text-apron flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              className="flex-1 rounded-xl shadow-sm"
              disabled={!hasItems}
              onClick={clear}
              title="Remove all items"
            >
              Clear
            </Button>
            <Button
              className="bg-apron hover:bg-rose flex-1 rounded-xl font-semibold shadow-md"
              disabled={!hasItems || loading}
              onClick={onCheckout}
            >
              {loading ? <Spinner className="mr-2" /> : null}
              {loading ? "Processing..." : "Checkout"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
