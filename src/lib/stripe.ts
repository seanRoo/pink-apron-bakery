import { loadStripe } from "@stripe/stripe-js";

const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
console.log("[stripe] VITE_STRIPE_PUBLISHABLE_KEY:", key);
export const stripePromise = loadStripe(key!);
stripePromise.then((stripe) => {
  if (stripe) {
    console.log("[stripe] Stripe loaded successfully");
  } else {
    console.error("[stripe] Stripe failed to load");
  }
});
