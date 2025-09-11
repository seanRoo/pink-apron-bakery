import Papa from "papaparse";

import type { Product, SizeServing } from "@/types/product";

/** Config */
const DATA_URL = "/data/products.csv";
const IMG_PREFIX = "/img/";

/** Helpers */
const toBool = (v: string | boolean | null | undefined): boolean =>
  String(v).trim().toUpperCase() === "TRUE";

const toNumber = (v: string | number | null | undefined, fallback = 0): number => {
  const n = typeof v === "number" ? v : Number(String(v ?? "").trim());
  return Number.isFinite(n) ? n : fallback;
};

const splitMulti = (v: string | null | undefined): string[] => {
  const raw = String(v ?? "").trim();
  if (!raw) return [];
  // Split on both | and ,
  return raw
    .split(/\||,/)
    .map((s) => s.trim())
    .filter(Boolean);
};

const mapImages = (v: string | null | undefined): string[] =>
  splitMulti(v).map((name) => (name.startsWith("/") ? name : IMG_PREFIX + name));

const mapSizeServings = (v: string | null | undefined): SizeServing[] =>
  splitMulti(v).map((pair) => {
    const [size, serves] = pair.split(":").map((s) => s.trim());
    return { size: size || "", serves: serves || "" };
  });

/** CSV row (raw) */
type CsvRow = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price_eur: string;
  description: string;
  dietary_tags: string;
  allergens: string;
  images: string;
  featured: string;
  options_size_servings: string;
  options_flavour: string;
  add_ons: string;
  lead_time_days: string;
};

const mapRowToProduct = (r: CsvRow): Product => ({
  id: r.id.trim(),
  name: r.name.trim(),
  slug: r.slug.trim(),
  category: r.category.trim() as Product["category"],
  price_eur: toNumber(r.price_eur),
  description: (r.description || "").trim(),
  dietary_tags: splitMulti(r.dietary_tags) as Product["dietary_tags"],
  allergens: splitMulti(r.allergens),
  images: mapImages(r.images),
  featured: toBool(r.featured),
  options_size_servings: mapSizeServings(r.options_size_servings),
  options_flavour: splitMulti(r.options_flavour),
  add_ons: splitMulti(r.add_ons),
  lead_time_days: Math.max(0, Math.trunc(toNumber(r.lead_time_days, 2))),
});

/**
 * Fetch and parse products.csv at runtime.
 * - Robust to empty cells.
 * - Ensures consistent types for the UI.
 */
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(DATA_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load products CSV: ${res.status}`);

  const csvText = await res.text();

  return new Promise<Product[]>((resolve, reject) => {
    Papa.parse<CsvRow>(csvText, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: ({ data, errors }) => {
        if (errors?.length) {
          console.warn("CSV parse warnings:", errors.slice(0, 3));
        }
        try {
          const products = data.filter((r) => r && r.id && r.name).map(mapRowToProduct);
          resolve(products);
        } catch (e) {
          reject(e);
        }
      },
      error: (err: unknown) => reject(err),
    });
  });
}
