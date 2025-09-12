export type SelectedOptions = {
  size?: string;
  flavour?: string;
  addOns?: string[];
  cakeName?: string;
  topperNumber?: string;
};

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  unitPrice: number;
  qty: number;
  image?: string;
  selected?: SelectedOptions;
  note?: string;
};

export type Fulfilment = "pickup" | "delivery";

export type CartState = {
  items: CartItem[];
  fulfilment: Fulfilment;
  deliveryFee: number;
  note?: string;
};
