import { stripePromise } from "@/lib/stripe";
import { useCart } from "@/store/cart";

export function useStripeCheckout() {
  const items = useCart((s) => s.items);

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) return;
      const line_items = items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.unitPrice * 100),
        },
        quantity: item.qty,
      }));
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: line_items,
          success_url: window.location.origin + "/success",
          cancel_url: window.location.origin + "/cart",
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("There was a problem redirecting to payment.");
      }
    } catch (e) {
      console.log(e);
      alert("Checkout failed. Please try again.");
    }
  };

  return { handleCheckout };
}
