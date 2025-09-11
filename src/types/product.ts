export type Category =
  | "Cupcakes"
  | "Kids party cakes"
  | "Wedding cakes"
  | "Birthday cakes";

export type DietaryTag =
  | "vegan"
  | "gluten-free"
  | "nut-free"
  | `contains-${string}`;

export type Allergen = "gluten" | "eggs" | "dairy" | "nuts" | string;

export type SizeServing = {
  size: string; // e.g., "6in" or "8in"
  serves: string; // e.g., "8-10"
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: Category;
  price_eur: number;
  description: string;
  dietary_tags: DietaryTag[];
  allergens: Allergen[];
  images: string[]; // resolved to /img/<filename>
  featured: boolean;
  options_size_servings: SizeServing[];
  options_flavour: string[];
  add_ons: string[];
  lead_time_days: number;
};
