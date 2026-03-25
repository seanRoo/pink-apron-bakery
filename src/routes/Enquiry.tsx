import { zodResolver } from "@hookform/resolvers/zod";
import { ToggleButton, ToggleButtonGroup, styled } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useFormPersistence } from "@/hooks/useFormPersistence";
import { sendCakeEnquiry, sendCupcakeEnquiry } from "@/lib/emailjs";

// --- Schemas ---

const cakeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  occasion: z.string().min(1, "Occasion is required"),
  date: z.string().min(1, "Date of collection is required"),
  size: z.string().min(1, "Size is required"),
  flavours: z.string().min(1, "Flavours are required"),
  theme: z.string().optional(),
  nameAndAge: z.string().optional(),
  notes: z.string().optional(),
});

const cupcakeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  date: z.string().min(1, "Date of collection is required"),
  occasion: z.string().min(1, "Occasion/theme is required"),
  quantity: z.string().min(1, "Quantity is required"),
  flavours: z.string().min(1, "Flavours are required"),
  colourScheme: z.string().optional(),
  notes: z.string().optional(),
});

type CakeFormValues = z.infer<typeof cakeSchema>;
type CupcakeFormValues = z.infer<typeof cupcakeSchema>;

// --- Styles ---

const PinkToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(0.5),
    border: "1px solid rgba(230, 132, 173, 0.3) !important",
    "&.Mui-disabled": {
      border: 0,
    },
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

const PinkToggleButton = styled(ToggleButton)({
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "white",
    backgroundColor: "#e684ad !important", // same as bg-apron
  },
  "&:hover": {
    backgroundColor: "rgba(230, 132, 173, 0.15)",
  },
  color: "#e684ad",
  textTransform: "none",
  fontWeight: 600,
  padding: "6px 16px",
  borderColor: "rgba(230, 132, 173, 0.3) !important",
});

// --- Components ---

function CakeForm() {
  const form = useForm<CakeFormValues>({
    resolver: zodResolver(cakeSchema),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  // Persist form data to localStorage
  useFormPersistence(form, 'cake-enquiry-form');

  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: CakeFormValues) => {
    try {
      setSubmitError(null);

      // Send email via EmailJS
      await sendCakeEnquiry({
        name: data.name,
        email: data.email,
        occasion: data.occasion,
        date: data.date,
        size: data.size,
        flavours: data.flavours,
        ...(data.phone && { phone: data.phone }),
        ...(data.theme && { theme: data.theme }),
        ...(data.nameAndAge && { nameAndAge: data.nameAndAge }),
        ...(data.notes && { notes: data.notes }),
        imageUrls: [],
      });

      setSubmitted(true);
      reset();
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to send enquiry. Please try again.');
    }
  };

  if (submitted) {
    return <SuccessMessage />;
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <h2 className="text-apron mb-2 font-body text-base font-semibold">Contact details</h2>
        <div className="grid gap-3 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="enquiry-name" className="text-xs font-medium text-warmgray">
              Name <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              id="enquiry-name"
              type="text"
              autoComplete="name"
              className="mt-0.5 w-full rounded-lg border bg-white px-3 py-1.5 text-sm"
              aria-required="true"
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "enquiry-name-error" : undefined}
              {...register("name")}
            />
            {errors.name && (
              <p id="enquiry-name-error" className="text-rose mt-0.5 text-[10px]" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="enquiry-email" className="text-xs font-medium text-warmgray">
              Email <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              id="enquiry-email"
              type="email"
              autoComplete="email"
              className="mt-0.5 w-full rounded-lg border bg-white px-3 py-1.5 text-sm"
              aria-required="true"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "enquiry-email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p id="enquiry-email-error" className="text-rose mt-0.5 text-[10px]" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="enquiry-phone" className="text-xs font-medium text-warmgray">
              Phone (optional)
            </label>
            <input
              id="enquiry-phone"
              type="tel"
              autoComplete="tel"
              className="mt-0.5 w-full rounded-lg border bg-white px-3 py-1.5 text-sm"
              {...register("phone")}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="enquiry-date" className="text-xs font-medium text-warmgray">
              Date <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              id="enquiry-date"
              type="date"
              className="mt-0.5 w-full rounded-lg border bg-white px-3 py-1.5 text-sm"
              autoComplete="off"
              aria-required="true"
              aria-invalid={errors.date ? "true" : "false"}
              aria-describedby={errors.date ? "enquiry-date-error" : undefined}
              {...register("date")}
            />
            {errors.date && (
              <p id="enquiry-date-error" className="text-rose mt-0.5 text-[10px]" role="alert">
                {errors.date.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="enquiry-occasion" className="text-xs font-medium text-warmgray">
              Occasion <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              id="enquiry-occasion"
              type="text"
              className="mt-0.5 w-full rounded-lg border bg-white px-3 py-1.5 text-sm"
              autoComplete="off"
              aria-required="true"
              aria-invalid={errors.occasion ? "true" : "false"}
              aria-describedby={errors.occasion ? "enquiry-occasion-error" : undefined}
              {...register("occasion")}
            />
            {errors.occasion && (
              <p id="enquiry-occasion-error" className="text-rose mt-0.5 text-[10px]" role="alert">
                {errors.occasion.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-apron mb-2 font-body text-base font-semibold">Cake details</h2>
        <div className="grid gap-3 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <label htmlFor="enquiry-size" className="text-xs font-medium text-warmgray">
              Size <span className="text-red-500" aria-label="required">*</span>
            </label>
            <select
              id="enquiry-size"
              className="mt-0.5 w-full rounded-lg border bg-white px-3 py-1.5 text-sm"
              autoComplete="off"
              aria-required="true"
              aria-invalid={errors.size ? "true" : "false"}
              aria-describedby={errors.size ? "enquiry-size-error" : undefined}
              {...register("size")}
            >
              <option value="">Select size</option>
              <option value="6&quot;">6&quot; - €110</option>
              <option value="8&quot;">8&quot; - €140</option>
              <option value="custom">Custom</option>
            </select>
            {errors.size && (
              <p id="enquiry-size-error" className="text-rose mt-0.5 text-[10px]" role="alert">
                {errors.size.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="enquiry-flavours" className="text-xs font-medium text-warmgray">
              Flavours <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              id="enquiry-flavours"
              type="text"
              className="mt-0.5 w-full rounded-lg border bg-white px-3 py-1.5 text-sm"
              placeholder="e.g. Vanilla"
              autoComplete="off"
              aria-required="true"
              aria-invalid={errors.flavours ? "true" : "false"}
              aria-describedby={errors.flavours ? "enquiry-flavours-error" : undefined}
              {...register("flavours")}
            />
            {errors.flavours && (
              <p id="enquiry-flavours-error" className="text-rose mt-0.5 text-[10px]" role="alert">
                {errors.flavours.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="enquiry-name-age" className="text-xs font-medium text-warmgray">
              Name/Age (optional)
            </label>
            <input
              id="enquiry-name-age"
              type="text"
              className="mt-0.5 w-full rounded-lg border bg-white px-3 py-1.5 text-sm"
              placeholder="e.g. Sarah, 5"
              autoComplete="off"
              {...register("nameAndAge")}
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="enquiry-theme" className="text-xs font-medium text-warmgray">
              Theme
            </label>
            <textarea
              id="enquiry-theme"
              rows={2}
              className="mt-0.5 w-full rounded-lg border bg-white px-3 py-1.5 text-sm"
              placeholder="Describe theme..."
              autoComplete="off"
              {...register("theme")}
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="enquiry-notes" className="text-xs font-medium text-warmgray">
              Notes (optional)
            </label>
            <textarea
              id="enquiry-notes"
              rows={2}
              className="mt-0.5 w-full rounded-lg border bg-white px-3 py-1.5 text-sm"
              autoComplete="off"
              {...register("notes")}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="bg-apron hover:bg-rose rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Sending…" : "Send enquiry"}
        </button>
        <button
          type="button"
          className="hover:border-rose/40 rounded-lg border px-4 py-2 text-sm font-semibold shadow-sm"
          onClick={() => reset()}
        >
          Reset
        </button>
      </div>
      {submitError && (
        <p className="text-rose mt-2 text-sm">{submitError}</p>
      )}
    </form>
  );
}

function CupcakeForm() {
  const form = useForm<CupcakeFormValues>({
    resolver: zodResolver(cupcakeSchema),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  // Persist form data to localStorage
  const { clearSavedData } = useFormPersistence(form, 'cupcake-enquiry-form');

  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: CupcakeFormValues) => {
    try {
      setSubmitError(null);

      // Send email via EmailJS
      await sendCupcakeEnquiry({
        name: data.name,
        email: data.email,
        date: data.date,
        occasion: data.occasion,
        quantity: data.quantity,
        flavours: data.flavours,
        ...(data.phone && { phone: data.phone }),
        ...(data.colourScheme && { colourScheme: data.colourScheme }),
        ...(data.notes && { notes: data.notes }),
        imageUrls: [],
      });

      setSubmitted(true);
      clearSavedData(); // Clear saved form data after successful submission
      reset();
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to send enquiry. Please try again.');
    }
  };

  if (submitted) {
    return <SuccessMessage />;
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <h2 className="text-apron mb-2 font-body text-base font-semibold">Contact details</h2>
        <div className="grid gap-3 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="cupcake-name" className="text-xs font-medium text-warmgray">
              Name <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              id="cupcake-name"
              type="text"
              autoComplete="name"
              className="mt-0.5 w-full rounded-lg border bg-white px-3 py-1.5 text-sm"
              aria-required="true"
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "cupcake-name-error" : undefined}
              {...register("name")}
            />
            {errors.name && (
              <p id="cupcake-name-error" className="text-rose mt-0.5 text-[10px]" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="cupcake-email" className="text-xs font-medium text-warmgray">
              Email <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              id="cupcake-email"
              type="email"
              autoComplete="email"
              className="mt-0.5 w-full rounded-lg border bg-white px-3 py-1.5 text-sm"
              aria-required="true"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "cupcake-email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p id="cupcake-email-error" className="text-rose mt-0.5 text-[10px]" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="cupcake-phone" className="text-xs font-medium text-warmgray">
              Phone (optional)
            </label>
            <input
              id="cupcake-phone"
              type="tel"
              autoComplete="tel"
              className="mt-0.5 w-full rounded-lg border bg-white px-3 py-1.5 text-sm"
              {...register("phone")}
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="cupcake-date" className="text-xs font-medium text-warmgray">
              Date <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              id="cupcake-date"
              type="date"
              className="mt-0.5 w-full rounded-lg border bg-white px-3 py-1.5 text-sm"
              autoComplete="off"
              aria-required="true"
              aria-invalid={errors.date ? "true" : "false"}
              aria-describedby={errors.date ? "cupcake-date-error" : undefined}
              {...register("date")}
            />
            {errors.date && (
              <p id="cupcake-date-error" className="text-rose mt-0.5 text-[10px]" role="alert">
                {errors.date.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-apron mb-2 font-body text-base font-semibold">Cupcake details</h2>
        <div className="grid gap-3 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <label htmlFor="cupcake-occasion" className="text-xs font-medium text-warmgray">
              Occasion <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              id="cupcake-occasion"
              type="text"
              className="mt-0.5 w-full rounded-lg border bg-white px-3 py-1.5 text-sm"
              autoComplete="off"
              aria-required="true"
              aria-invalid={errors.occasion ? "true" : "false"}
              aria-describedby={errors.occasion ? "cupcake-occasion-error" : undefined}
              {...register("occasion")}
            />
            {errors.occasion && (
              <p id="cupcake-occasion-error" className="text-rose mt-0.5 text-[10px]" role="alert">
                {errors.occasion.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="cupcake-quantity" className="text-xs font-medium text-warmgray">
              Quantity <span className="text-red-500" aria-label="required">*</span>
            </label>
            <select
              id="cupcake-quantity"
              className="mt-0.5 w-full rounded-lg border bg-white px-3 py-1.5 text-sm"
              autoComplete="off"
              aria-required="true"
              aria-invalid={errors.quantity ? "true" : "false"}
              aria-describedby={errors.quantity ? "cupcake-quantity-error" : undefined}
              {...register("quantity")}
            >
              <option value="">Select</option>
              <option value="6">6 - €20</option>
              <option value="12">12 - €35</option>
              <option value="18">18 - €55</option>
              <option value="custom">Custom</option>
            </select>
            {errors.quantity && (
              <p id="cupcake-quantity-error" className="text-rose mt-0.5 text-[10px]" role="alert">
                {errors.quantity.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="cupcake-flavours" className="text-xs font-medium text-warmgray">
              Flavours <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              id="cupcake-flavours"
              type="text"
              className="mt-0.5 w-full rounded-lg border bg-white px-3 py-1.5 text-sm"
              placeholder="e.g. Vanilla"
              autoComplete="off"
              aria-required="true"
              aria-invalid={errors.flavours ? "true" : "false"}
              aria-describedby={errors.flavours ? "cupcake-flavours-error" : undefined}
              {...register("flavours")}
            />
            {errors.flavours && (
              <p id="cupcake-flavours-error" className="text-rose mt-0.5 text-[10px]" role="alert">
                {errors.flavours.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="cupcake-colour" className="text-xs font-medium text-warmgray">
              Colour scheme (optional)
            </label>
            <input
              id="cupcake-colour"
              type="text"
              className="mt-0.5 w-full rounded-lg border bg-white px-3 py-1.5 text-sm"
              autoComplete="off"
              {...register("colourScheme")}
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="cupcake-notes" className="text-xs font-medium text-warmgray">
              Notes (optional)
            </label>
            <textarea
              id="cupcake-notes"
              rows={1}
              className="mt-0.5 w-full rounded-lg border bg-white px-3 py-1.5 text-sm"
              autoComplete="off"
              {...register("notes")}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="bg-apron hover:bg-rose rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Sending…" : "Send enquiry"}
        </button>
        <button
          type="button"
          className="hover:border-rose/40 rounded-lg border px-4 py-2 text-sm font-semibold shadow-sm"
          onClick={() => reset()}
        >
          Reset
        </button>
      </div>
      {submitError && (
        <p className="text-rose mt-2 text-sm">{submitError}</p>
      )}
    </form>
  );
}

function SuccessMessage() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <svg width="48" height="48" fill="none" viewBox="0 0 56 56" className="text-apron mb-3">
        <circle cx="28" cy="28" r="28" fill="#F8E1E7" />
        <path
          d="M18 29.5l7 7 13-13"
          stroke="#e684ad"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="text-apron mb-2 text-xl font-semibold">Enquiry sent!</div>
      <div className="text-warmgray max-w-md text-center text-base font-medium leading-relaxed">
        Thank you for your enquiry. We’ll be in touch within 1 business day.
      </div>
    </div>
  );
}

export default function Enquiry() {
  const [isCupcake, setIsCupcake] = useState(false);

  return (
    <motion.section
      className="mx-auto max-w-2xl px-2 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-2xl bg-white px-6 py-6 shadow-lg md:px-8">
        <div className="mb-6">
          <motion.h1
            className="text-rose font-script text-3xl tracking-wide drop-shadow-sm md:text-4xl"
            style={{ textShadow: "0 2px 8px rgba(255, 192, 203, 0.15)" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.4, 0, 0.2, 1] }}
          >
            Cake Enquiry
          </motion.h1>
          <motion.div
            className="bg-rose/30 mt-1 mb-4 h-1 w-12 rounded-full"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            style={{ originX: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          />
          <motion.p
            className="text-warmgray mb-4 text-base font-medium leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {isCupcake
              ? "Tell us about your cupcake order and we’ll get back to you within 1 business day."
              : "Tell us about your occasion and we’ll get back to you within 1 business day."}
          </motion.p>

          <PinkToggleButtonGroup
            value={isCupcake ? "cupcake" : "cake"}
            exclusive
            onChange={(_, newValue) => {
              if (newValue !== null) {
                setIsCupcake(newValue === "cupcake");
              }
            }}
            aria-label="Enquiry type"
          >
            <PinkToggleButton value="cake" aria-label="Custom Cake">
              Custom Cake
            </PinkToggleButton>
            <PinkToggleButton value="cupcake" aria-label="Cupcakes">
              Cupcakes
            </PinkToggleButton>
          </PinkToggleButtonGroup>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isCupcake ? "cupcake" : "cake"}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {isCupcake ? <CupcakeForm /> : <CakeForm />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
