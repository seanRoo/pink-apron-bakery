import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  eventDate: z.string().min(1, "Event date required"),
  category: z.enum(["Kids party cakes", "Wedding cakes", "Birthday cakes", "Cupcakes"]).optional(),
  servings: z.string().optional(),
  flavour: z.string().optional(),
  fulfilment: z.enum(["pickup", "delivery"]),
  address: z.string().optional(),
  eircode: z.string().optional(),
  message: z.string().min(5, "Please add a brief description"),
  budget: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Enquiry() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fulfilment: "pickup" },
  });

  const fulfilment = watch("fulfilment");

  const onSubmit = async (data: FormValues) => {
    console.log("Enquiry submitted", data);
    alert("Thanks! We'll be in touch shortly.");
    reset({ fulfilment: data.fulfilment });
  };

  return (
    <motion.section
      className="mx-auto max-w-2xl px-2 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-2xl bg-white p-6 shadow-lg md:p-10">
        <h1
          className="text-rose font-script mb-2 text-4xl tracking-wide drop-shadow-sm md:text-5xl"
          style={{ textShadow: "0 2px 8px rgba(255, 192, 203, 0.15)" }}
        >
          Custom cake enquiry
        </h1>
        <p className="text-warmgray mb-2 text-base">
          Tell us about your occasion and we’ll get back to you within 1 business day.
        </p>
        <div className="bg-rose/30 mb-6 h-1 w-16 rounded-full" />

        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          {/* Contact */}
          <div>
            <h2 className="text-apron mb-2 font-serif text-lg">Contact details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm">Name</label>
                <input
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                  {...register("name")}
                />
                {errors.name && <p className="text-rose mt-1 text-xs">{errors.name.message}</p>}
              </div>
              <div>
                <label className="text-sm">Email</label>
                <input
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                  {...register("email")}
                />
                {errors.email && <p className="text-rose mt-1 text-xs">{errors.email.message}</p>}
              </div>
              <div>
                <label className="text-sm">Phone (optional)</label>
                <span className="text-warmgray block text-xs">
                  Optional, for urgent queries or delivery.
                </span>
                <input
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                  {...register("phone")}
                />
              </div>
              <div>
                <label className="text-sm">Event date</label>
                <span className="text-warmgray block text-xs">When do you need your cake?</span>
                <input
                  type="date"
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                  {...register("eventDate")}
                />
                {errors.eventDate && (
                  <p className="text-rose mt-1 text-xs">{errors.eventDate.message}</p>
                )}
              </div>
            </div>

            {/* Cake details */}
            <h2 className="text-apron mt-6 mb-2 font-serif text-lg">Cake details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm">Category</label>
                <select
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                  {...register("category")}
                >
                  <option value="">Select</option>
                  <option>Kids party cakes</option>
                  <option>Wedding cakes</option>
                  <option>Birthday cakes</option>
                  <option>Cupcakes</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Servings / Size (approx)</label>
                <input
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                  placeholder="e.g. 8–10"
                  {...register("servings")}
                />
              </div>
              <div>
                <label className="text-sm">Allergies or dietary requirements</label>
                <input
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                  placeholder="e.g. nuts, gluten-free, dairy-free"
                  // Not in schema, so not required
                  name="allergies"
                  autoComplete="off"
                />
                <span className="text-warmgray block text-xs">
                  Let us know about any allergies or dietary needs.
                </span>
              </div>
              <div>
                <label className="text-sm">Preferred flavour</label>
                <input
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                  placeholder="e.g. vanilla, chocolate…"
                  {...register("flavour")}
                />
              </div>
              <div>
                <label className="text-sm">Budget (optional)</label>
                <input
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                  placeholder="e.g. €80–€120"
                  {...register("budget")}
                />
              </div>
            </div>
          </div>

          {/* Fulfilment (accessible radio group, no duplicate handlers) */}
          <fieldset className="mt-6 space-y-2">
            <legend className="text-apron font-serif text-sm">Fulfilment</legend>
            <div role="radiogroup" className="flex gap-2">
              <label className="flex-1">
                <input
                  type="radio"
                  value="pickup"
                  {...register("fulfilment")}
                  className="peer sr-only"
                />
                <span
                  className={`peer-checked:bg-apron peer-checked:border-apron block rounded-xl border px-3 py-2 text-center transition peer-checked:text-white`}
                >
                  Pickup
                </span>
              </label>

              <label className="flex-1">
                <input
                  type="radio"
                  value="delivery"
                  {...register("fulfilment")}
                  className="peer sr-only"
                />
                <span
                  className={`peer-checked:bg-apron peer-checked:border-apron block rounded-xl border px-3 py-2 text-center transition peer-checked:text-white`}
                >
                  Delivery
                </span>
              </label>
            </div>
            {errors.fulfilment && (
              <p className="text-rose mt-1 text-xs">{errors.fulfilment.message}</p>
            )}
            <p className="text-warmgray text-xs">
              {fulfilment === "delivery"
                ? "Flat delivery fee €6 within Kildare (placeholder)."
                : "Choose pickup date/time above (placeholder)."}
            </p>
          </fieldset>

          {/* Delivery details conditional */}
          {fulfilment === "delivery" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm">Delivery address (Kildare area)</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  {...register("address")}
                />
              </div>
              <div>
                <label className="text-sm">Eircode</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  {...register("eircode")}
                />
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="text-sm">Message / theme / colours</label>
            <textarea
              rows={4}
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
              {...register("message")}
            />
            <span className="text-warmgray mb-1 block text-xs">
              Describe your ideal cake, theme, colours, or any inspiration.
            </span>
            {errors.message && <p className="text-rose mt-1 text-xs">{errors.message.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-apron hover:bg-rose rounded-xl px-5 py-2.5 font-semibold text-white shadow-md transition"
            >
              {isSubmitting ? "Sending…" : "Send enquiry"}
            </button>
            <button
              type="button"
              className="hover:border-rose/40 rounded-xl border px-5 py-2.5 font-semibold shadow-sm"
              onClick={() => reset()}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </motion.section>
  );
}
