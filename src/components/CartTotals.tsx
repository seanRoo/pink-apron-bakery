import { useState } from "react";

import { Spinner } from "@/components/ui/Spinner";
import { formatPrice } from "@/lib/format";
import { useStripeCheckout } from "@/lib/useStripeCheckout";
import { useCart, useCartTotals } from "@/store/cart";

export default function CartTotals() {
  const [subtotal, total] = useCartTotals();
  const fulfilment = useCart((s) => s.fulfilment);
  const setFulfilment = useCart((s) => s.setFulfilment);
  const deliveryFee = useCart((s) => s.deliveryFee);
  const items = useCart((s) => s.items);
  const hasItems = items.length > 0;
  const [loading, setLoading] = useState(false);
  const { handleCheckout } = useStripeCheckout();
  const onCheckout = async () => {
    setLoading(true);
    await handleCheckout();
    setLoading(false);
  };

  return (
    <div className="bg-cream/80 space-y-4 rounded-2xl p-6 shadow-lg">
      <div className="mb-2 flex gap-2">
        <button
          type="button"
          onClick={() => setFulfilment("pickup")}
          className={`flex-1 cursor-pointer rounded-xl border px-3 py-2 font-semibold transition-colors ${
            fulfilment === "pickup"
              ? "bg-apron border-apron text-white"
              : "border-rose/20 hover:bg-apron/10 bg-white"
          }`}
        >
          Pickup
        </button>
        <button
          type="button"
          onClick={() => setFulfilment("delivery")}
          className={`flex-1 cursor-pointer rounded-xl border px-3 py-2 font-semibold transition-colors ${
            fulfilment === "delivery"
              ? "bg-apron border-apron text-white"
              : "border-rose/20 hover:bg-apron/10 bg-white"
          }`}
        >
          Delivery
        </button>
      </div>

      <div className="text-warmgray mb-2 text-sm">
        {fulfilment === "pickup"
          ? "Choose pickup date/time at checkout (placeholder)."
          : "Delivery fee is a flat €6 within Kildare (placeholder)."}
      </div>

      <div className="border-rose/10 space-y-1 border-t pt-3 text-base">
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
        <div className="text-apron flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <button
        type="button"
        className={`flex w-full cursor-pointer items-center justify-center rounded-xl py-3 text-lg font-semibold shadow-md transition-colors ${
          hasItems
            ? "bg-apron hover:bg-rose text-white"
            : "cursor-not-allowed bg-gray-200 text-gray-400"
        }`}
        disabled={!hasItems || loading}
        onClick={onCheckout}
      >
        {loading ? <Spinner className="mr-2" /> : null}
        {loading ? "Processing..." : "Checkout"}
      </button>
    </div>
  );
}
