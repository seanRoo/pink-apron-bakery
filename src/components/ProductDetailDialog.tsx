import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { toast } from "sonner";

import ResponsiveProductImage from "@/components/ResponsiveProductImage";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/store/cart";
import type { Product } from "@/types/product";

interface ProductDetailDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailDialog({ product, open, onOpenChange }: ProductDetailDialogProps) {
  const add = useCart((s) => s.add);
  const [flavour, setFlavour] = React.useState("");
  const [size, setSize] = React.useState("");
  const [cakeName, setCakeName] = React.useState("");
  const [topperNumber, setTopperNumber] = React.useState("");
  const [errors, setErrors] = React.useState<{ cakeName?: string; topperNumber?: string }>({});

  React.useEffect(() => {
    if (product) {
      setFlavour(product.options_flavour[0] || "");
      setSize(product.options_size_servings[0]?.size || "");
    }
  }, [product]);

  if (!product) return null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 h-[90vh] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-0 shadow-xl focus:outline-none">
          <DialogPrimitive.Title className="sr-only">{product.name}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {product.description}
          </DialogPrimitive.Description>
          <DialogPrimitive.Close className="absolute top-4 right-4 rounded p-1 text-gray-400 hover:text-gray-700 focus:outline-none">
            <span className="sr-only">Close</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </DialogPrimitive.Close>
          <div className="flex h-full flex-col md:flex-row">
            <div className="flex w-full items-center justify-center rounded-l-2xl bg-gray-50 p-10 md:w-1/2">
              <ResponsiveProductImage
                src="/img/placeholder.png"
                alt={product.name}
                className="h-64 max-h-[45vh] w-full rounded-xl object-cover sm:h-[28rem] sm:max-h-[60vh] md:h-[32rem] md:max-h-[75vh]"
              />
            </div>
            <div className="flex w-full flex-col justify-center p-8 md:w-1/2">
              <div className="text-rose mb-2 text-2xl font-bold">
                {formatPrice(product.price_eur)}
              </div>
              <div className="mb-3 text-lg font-semibold">{product.name}</div>
              <div className="text-warmgray mb-4 text-sm">{product.description}</div>
              <div className="mb-3">
                <label className="mb-1 block text-xs font-medium">Flavour</label>
                <select
                  className="w-full rounded border px-2 py-1"
                  value={flavour}
                  onChange={(e) => setFlavour(e.target.value)}
                >
                  {product.options_flavour.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium">Serving Size</label>
                <select
                  className="w-full rounded border px-2 py-1"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                >
                  {product.options_size_servings.map((s) => (
                    <option key={s.size} value={s.size}>
                      {s.size} ({s.serves} serves)
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-xs font-medium">
                  Name for Front of Cake <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full rounded border px-2 py-1 ${errors.cakeName ? "border-red-500" : ""}`}
                  value={cakeName}
                  onChange={(e) => setCakeName(e.target.value)}
                  placeholder="e.g. Sarah"
                  required
                />
                {errors.cakeName && (
                  <div className="mt-1 text-xs text-red-500">{errors.cakeName}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium">
                  Number for the Topper <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full rounded border px-2 py-1 ${errors.topperNumber ? "border-red-500" : ""}`}
                  value={topperNumber}
                  onChange={(e) => setTopperNumber(e.target.value)}
                  placeholder="e.g. 5"
                  required
                />
                {errors.topperNumber && (
                  <div className="mt-1 text-xs text-red-500">{errors.topperNumber}</div>
                )}
              </div>
              <button
                type="button"
                className="bg-apron hover:bg-rose mt-2 w-full rounded-xl py-2 font-semibold text-white"
                onClick={() => {
                  const newErrors: { cakeName?: string; topperNumber?: string } = {};
                  if (!cakeName.trim()) newErrors.cakeName = "Name is required";
                  if (!topperNumber.trim()) newErrors.topperNumber = "Number is required";
                  setErrors(newErrors);
                  if (Object.keys(newErrors).length > 0) return;
                  add({
                    productId: product.id,
                    name: product.name,
                    slug: product.slug,
                    unitPrice: product.price_eur,
                    qty: 1,
                    image: product.images[0],
                    selected: { flavour, size, cakeName, topperNumber },
                  });
                  toast.success("Added to cart!");
                  onOpenChange(false);
                }}
              >
                Add to cart
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
