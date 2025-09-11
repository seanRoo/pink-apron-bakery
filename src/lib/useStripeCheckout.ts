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
      // Use absolute URLs for Stripe success/cancel (best practice for serverless)
      const baseUrl = import.meta.env.VITE_SITE_URL || "https://pink-apron-bakery.vercel.app";
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: line_items,
          success_url: baseUrl + "/success",
          cancel_url: baseUrl + "/cart",
        }),
      });
      const data = await res.json();
      if (data.id) {
        // Use Stripe's redirectToCheckout for best practice
        const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
        if (error) {
          alert("Stripe redirect failed: " + error.message);
        }
      } else {
        alert("There was a problem redirecting to payment.");
      }
    } catch {
      alert("Checkout failed. Please try again.");
    }
  };

  return { handleCheckout };
}
