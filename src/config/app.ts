export const CATEGORIES = [
  "All",
  "Featured",
  "Cupcakes",
  "Kids party cakes",
  "Wedding cakes",
  "Birthday cakes",
] as const;

export type CategoryFilter = (typeof CATEGORIES)[number];

export const CURRENCY = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});
