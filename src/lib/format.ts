import { CURRENCY } from "@/config/app";

export const formatPrice = (n: number) => CURRENCY.format(n);
