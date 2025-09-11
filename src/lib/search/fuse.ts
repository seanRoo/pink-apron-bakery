import Fuse, { type IFuseOptions } from "fuse.js";

import type { Product } from "@/types/product";

const options: IFuseOptions<Product> = {
  keys: [
    { name: "name", weight: 0.7 },
    { name: "category", weight: 0.3 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
};

export const makeProductSearch = (products: Product[]) => new Fuse(products, options);

export const runSearch = (fuse: Fuse<Product> | null, query: string): Product[] => {
  if (!fuse) return [];
  if (!query.trim()) return [];
  return fuse.search(query).map((r) => r.item);
};
