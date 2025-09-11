import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  console.log("[checkout] Incoming body:", req.body);
  const { items, success_url, cancel_url } = req.body;

  if (!items || !Array.isArray(items)) {
    res.status(400).json({ error: "Invalid items" });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items,
      mode: "payment",
      success_url: success_url || "https://yourdomain.com/success",
      cancel_url: cancel_url || "https://yourdomain.com/cancel",
    });
    console.log("[checkout] Stripe session:", session);
    res.status(200).json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error("[checkout] Error:", err);
    res.status(500).json({ error: err.message });
  }
}
