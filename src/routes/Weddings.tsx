import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CakeSlice, Truck, Heart, ClipboardPen } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import FadeInSection from "@/components/FadeInSection";
import ResponsiveProductImage from "@/components/ResponsiveProductImage";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { couplePhotos } from "@/lib/couplePhotos";
import { sendWeddingEnquiry } from "@/lib/emailjs";

// Featured image for center of collage
const featuredCollageImage = "/img/wedding_cakes/niamh-wedding.jpg";

// Collage images (6x6 grid with center 2x2 featured = 32 small images needed)
const heartCollageImages = [
  // Row 1
  "/img/wedding_cakes/wedding1.jpg",
  "/img/couple_photos/couple1.jpg",
  "/img/wedding_cakes/wedding2.jpg",
  "/img/couple_photos/couple2.jpg",
  "/img/wedding_cakes/wedding3.jpg",
  "/img/couple_photos/couple3.jpg",
  // Row 2
  "/img/wedding_cakes/wedding6.jpg",
  "/img/couple_photos/couple4.jpg",
  "/img/wedding_cakes/wedding8.jpg",
  "/img/couple_photos/couple5.jpg",
  "/img/wedding_cakes/wedding9.jpg",
  "/img/couple_photos/couple6.jpg",
  // Row 3 (2 left, featured, 2 right)
  "/img/wedding_cakes/wedding14.jpg",
  "/img/couple_photos/couple7.jpg",
  "/img/wedding_cakes/wedding17.jpg",
  "/img/couple_photos/couple8.jpg",
  // Row 4 (2 left, featured continues, 2 right)
  "/img/wedding_cakes/wedding20.jpg",
  "/img/couple_photos/couple9.jpg",
  "/img/wedding_cakes/wedding4.jpg",
  "/img/couple_photos/couple10.jpg",
  // Row 5
  "/img/wedding_cakes/wedding5.jpg",
  "/img/couple_photos/couple11.jpg",
  "/img/wedding_cakes/wedding11.jpg",
  "/img/couple_photos/couple12.jpg",
  "/img/wedding_cakes/wedding13.jpg",
  "/img/couple_photos/couple13.jpg",
  // Row 6
  "/img/wedding_cakes/wedding18.jpg",
  "/img/wedding_cakes/wedding19.jpg",
  "/img/wedding_cakes/wedding21.jpg",
  "/img/wedding_cakes/wedding22.jpg",
  "/img/wedding_cakes/wedding23.jpg",
  "/img/wedding_cakes/wedding24.jpg",
  "/img/wedding_cakes/wedding26.jpg",
];

const schema = z.object({
  names: z.string().min(2, "Names are required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(1, "Phone number is required"),
  date: z.string().min(1, "Wedding date is required"),
  venue: z.string().min(1, "Venue is required"),
  guests: z.string().min(1, "Number of guests is required"),
  tiers: z.string().min(1, "Number of tiers is required"),
  flavours: z.string().min(1, "Flavours are required"),
  design: z.string().optional(),
  finish: z.enum(["buttercream", "fondant"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Weddings() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { finish: "buttercream" },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  // Persist form data to localStorage
  const { clearSavedData } = useFormPersistence(form, 'wedding-enquiry-form');

  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitError(null);

      // Send email via EmailJS
      await sendWeddingEnquiry({
        names: data.names,
        email: data.email,
        phone: data.phone,
        date: data.date,
        venue: data.venue,
        guests: data.guests,
        tiers: data.tiers,
        flavours: data.flavours,
        finish: data.finish,
        ...(data.design && { design: data.design }),
        ...(data.notes && { notes: data.notes }),
        imageUrls: [],
      });

      setSubmitted(true);
      clearSavedData(); // Clear saved form data after successful submission
      reset({ finish: data.finish });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to send enquiry. Please try again.');
    }
  };

  return (
    <motion.div
      className="space-y-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section with Heart Collage */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-4 py-12 md:py-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Left side - Text and CTA */}
          <div className="text-center md:text-left order-2 md:order-1">
            {[
              <h1 className="text-rose font-script mb-4 text-4xl tracking-wide drop-shadow-sm md:text-5xl lg:text-6xl">
                Let's Talk Weddings
              </h1>,
              <div className="bg-rose/30 mx-auto md:mx-0 mb-6 h-1 w-16 rounded-full" />,
              <p className="text-warmgray mb-8 text-lg font-medium leading-relaxed max-w-xl mx-auto md:mx-0 font-body">
                Every milestone deserves a beautiful centerpiece. More than just a dessert, your wedding
                cake is a timeless tradition symbolizing your love and commitment.
              </p>,
              <button
                onClick={() => {
                  const element = document.getElementById('enquiry');
                  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="bg-apron hover:bg-rose inline-block rounded-full px-8 py-3 font-semibold text-white shadow-lg transition transform hover:scale-105"
              >
                Start Your Enquiry
              </button>,
            ].map((el, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              >
                {el}
              </motion.div>
            ))}
          </div>

          {/* Right side - Heart Collage */}
          <motion.div
            className="flex justify-center md:justify-end order-1 md:order-2"
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div 
              className="relative w-[340px] h-[340px] md:w-[480px] md:h-[480px] lg:w-[560px] lg:h-[560px]"
              style={{
                filter: "drop-shadow(0 10px 30px rgba(230, 132, 173, 0.3))",
              }}
            >
              <div
                className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 overflow-hidden rounded-2xl bg-white/50"
              >
                {/* Row 1: 6 images (indices 0-5) - load first 3 eagerly for faster initial render */}
                {heartCollageImages.slice(0, 6).map((img, i) => (
                  <div key={i} className="overflow-hidden rounded-lg bg-rose/10">
                    <ResponsiveProductImage
                      src={img}
                      alt={`Wedding collage ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading={i < 3 ? "eager" : "lazy"}
                      fetchPriority={i < 2 ? "high" : "auto"}
                      width={80}
                      height={80}
                    />
                  </div>
                ))}
                {/* Row 2: 6 images (indices 6-11) - all lazy */}
                {heartCollageImages.slice(6, 12).map((img, i) => (
                  <div key={i + 6} className="overflow-hidden rounded-lg bg-rose/10">
                    <ResponsiveProductImage
                      src={img}
                      alt={`Wedding collage ${i + 7}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={80}
                      height={80}
                    />
                  </div>
                ))}
                {/* Row 3: 2 images, featured 2x2, 2 images */}
                {heartCollageImages.slice(12, 14).map((img, i) => (
                  <div key={i + 12} className="overflow-hidden rounded-lg bg-rose/10">
                    <ResponsiveProductImage
                      src={img}
                      alt={`Wedding collage ${i + 13}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={80}
                      height={80}
                    />
                  </div>
                ))}
                {/* Featured center image - spans 2x2, perfectly centered - HIGH PRIORITY */}
                <div className="col-span-2 row-span-2 overflow-hidden rounded-lg bg-rose/20">
                  <ResponsiveProductImage
                    src={featuredCollageImage}
                    alt="Featured wedding cake"
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                    width={160}
                    height={160}
                  />
                </div>
                {heartCollageImages.slice(14, 16).map((img, i) => (
                  <div key={i + 14} className="overflow-hidden rounded-lg bg-rose/10">
                    <ResponsiveProductImage
                      src={img}
                      alt={`Wedding collage ${i + 15}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={80}
                      height={80}
                    />
                  </div>
                ))}
                {/* Row 4: 2 images, featured continues, 2 images */}
                {heartCollageImages.slice(16, 18).map((img, i) => (
                  <div key={i + 16} className="overflow-hidden rounded-lg bg-rose/10">
                    <ResponsiveProductImage
                      src={img}
                      alt={`Wedding collage ${i + 17}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={80}
                      height={80}
                    />
                  </div>
                ))}
                {heartCollageImages.slice(18, 20).map((img, i) => (
                  <div key={i + 18} className="overflow-hidden rounded-lg bg-rose/10">
                    <ResponsiveProductImage
                      src={img}
                      alt={`Wedding collage ${i + 19}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={80}
                      height={80}
                    />
                  </div>
                ))}
                {/* Row 5: 6 images (indices 20-25) */}
                {heartCollageImages.slice(20, 26).map((img, i) => (
                  <div key={i + 20} className="overflow-hidden rounded-lg bg-rose/10">
                    <ResponsiveProductImage
                      src={img}
                      alt={`Wedding collage ${i + 21}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={80}
                      height={80}
                    />
                  </div>
                ))}
                {/* Row 6: 6 images (indices 26-31) */}
                {heartCollageImages.slice(26, 32).map((img, i) => (
                  <div key={i + 26} className="overflow-hidden rounded-lg bg-rose/10">
                    <ResponsiveProductImage
                      src={img}
                      alt={`Wedding collage ${i + 27}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={80}
                      height={80}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        </div>
      </section>

      {/* Info Cards Row - Design, Tasters, Delivery */}
      <FadeInSection>
        <section className="mx-auto max-w-[1400px] px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Design Card */}
          <div className="rounded-2xl bg-white border border-rose/10 shadow-md p-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blush">
              <ClipboardPen className="h-10 w-10 text-warmgray" strokeWidth={1.5} />
            </div>
            <h2 className="text-rose font-script text-2xl tracking-wide mb-3">
              Design
            </h2>
            <p className="text-warmgray leading-relaxed text-base font-medium font-body">
              Your wedding cake is the centerpiece of your reception. We love collaborating on new
              styles and are happy to recreate any design from our portfolio.
            </p>
          </div>

          {/* Tasters Card */}
          <div className="rounded-2xl bg-white border border-rose/10 shadow-md p-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blush">
              <CakeSlice className="h-10 w-10 text-warmgray" strokeWidth={1.5} />
            </div>
            <h2 className="text-rose font-script text-2xl tracking-wide mb-3">
              Wedding Tasters
            </h2>
            <p className="text-warmgray leading-relaxed text-base font-medium font-body">
              Provided as 12 cupcakes (two of each flavour), allowing you to sample six different flavours.
            </p>
          </div>

          {/* Delivery Card */}
          <div className="rounded-2xl bg-white border border-rose/10 shadow-md p-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blush">
              <Truck className="h-10 w-10 text-warmgray" strokeWidth={1.5} />
            </div>
            <h2 className="text-rose font-script text-2xl tracking-wide mb-3">
              Delivery & Setup
            </h2>
            <p className="text-warmgray leading-relaxed text-base font-medium font-body">
              We manage the full delivery and setup, liaising with your venue coordinator for seamless placement.
            </p>
            <p className="text-warmgray text-sm mt-3 font-semibold">Small delivery fee applies based on location</p>
          </div>
        </div>
        </section>
      </FadeInSection>

      {/* Wedding Cakes Gallery Row */}
      <FadeInSection delay={0.1}>
        <section className="mx-auto max-w-[1400px] px-4">
          <div className="text-center mb-6">
            <h2
              className="text-rose font-script text-3xl tracking-wide drop-shadow-sm md:text-4xl"
            >
              Our Wedding Cakes
            </h2>
            <p className="text-warmgray text-base font-medium mt-2 font-body">A glimpse of our wedding cake creations</p>
          </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {[
            "/img/wedding_cakes/wedding1.jpg",
            "/img/wedding_cakes/wedding2.jpg",
            "/img/wedding_cakes/wedding3.jpg",
            "/img/wedding_cakes/wedding6.jpg",
            "/img/wedding_cakes/wedding8.jpg",
            "/img/wedding_cakes/wedding9.jpg",
            "/img/wedding_cakes/wedding14.jpg",
            "/img/wedding_cakes/wedding17.jpg",
            "/img/wedding_cakes/wedding20.jpg",
            "/img/wedding_cakes/wedding4.jpg",
            "/img/wedding_cakes/wedding18.jpg",
            "/img/wedding_cakes/wedding26.jpg",
          ].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="aspect-[3/4] overflow-hidden rounded-xl shadow-lg"
            >
              <ResponsiveProductImage
                src={img}
                alt={`Wedding cake ${i + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </motion.div>
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* Previous Couple Photos Section */}
      <FadeInSection delay={0.15}>
        <section className="mx-auto max-w-[1400px] px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="text-rose h-6 w-6" strokeWidth={1.5} />
              <h2
                className="text-rose font-script text-3xl tracking-wide drop-shadow-sm md:text-4xl"
              >
                Previous Couples
              </h2>
              <Heart className="text-rose h-6 w-6" strokeWidth={1.5} />
            </div>
            <p className="text-warmgray text-lg font-medium max-w-2xl mx-auto font-body leading-relaxed">
              See how we've helped make special days unforgettable
            </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {couplePhotos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="aspect-square overflow-hidden rounded-xl shadow-lg"
            >
              <ResponsiveProductImage
                src={photo}
                alt={`Wedding couple ${i + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </motion.div>
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* Wedding Enquiry Form */}
      <FadeInSection delay={0.2}>
        <section id="enquiry" className="mx-auto max-w-2xl px-4 pb-10 scroll-mt-8">
        <div className="rounded-2xl bg-white p-6 shadow-lg md:p-10">
          {!submitted && (
            <>
              <h2
                className="text-rose font-script mb-2 text-3xl tracking-wide drop-shadow-sm md:text-4xl"
                style={{ textShadow: "0 2px 8px rgba(255, 192, 203, 0.15)" }}
              >
                Wedding Cake Enquiry
              </h2>
              <p className="text-warmgray mb-2 text-lg font-medium font-body leading-relaxed">
                Tell us about your special day and we'll get back to you within 1 business day.
              </p>
              <div className="bg-rose/30 mb-6 h-1 w-16 rounded-full" />
            </>
          )}
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16">
              <svg width="56" height="56" fill="none" viewBox="0 0 56 56" className="text-apron mb-4">
                <circle cx="28" cy="28" r="28" fill="#F8E1E7" />
                <path
                  d="M18 29.5l7 7 13-13"
                  stroke="#E11D48"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-apron mb-2 text-2xl font-semibold">Enquiry sent!</div>
              <div className="text-warmgray max-w-md text-center text-base font-medium leading-relaxed">
                Thank you for your enquiry. We'll be in touch within 1 business day to discuss your
                wedding cake. If you need to contact us sooner, please email{" "}
                <a href="mailto:niamhpinkapron@gmail.com" className="text-apron underline">
                  niamhpinkapron@gmail.com
                </a>
                .
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div>
                <h3 className="text-apron mb-3 font-body text-lg font-semibold">Contact details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm">
                      Names <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                      placeholder="e.g. Sarah & John"
                      autoComplete="name"
                      {...register("names")}
                    />
                    {errors.names && (
                      <p className="text-rose mt-1 text-xs">{errors.names.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                      autoComplete="email"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-rose mt-1 text-xs">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm">
                      Phone number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                      autoComplete="tel"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-rose mt-1 text-xs">{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm">
                      Date of wedding <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                      autoComplete="off"
                      {...register("date")}
                    />
                    {errors.date && (
                      <p className="text-rose mt-1 text-xs">{errors.date.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-apron mb-3 font-body text-lg font-semibold">Wedding details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm">
                      Wedding venue <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                      autoComplete="organization"
                      {...register("venue")}
                    />
                    {errors.venue && (
                      <p className="text-rose mt-1 text-xs">{errors.venue.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm">
                      Number of guests <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                      autoComplete="off"
                      {...register("guests")}
                    />
                    {errors.guests && (
                      <p className="text-rose mt-1 text-xs">{errors.guests.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm">
                      Number of tiers <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                      autoComplete="off"
                      {...register("tiers")}
                    />
                    {errors.tiers && (
                      <p className="text-rose mt-1 text-xs">{errors.tiers.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm">
                      Flavours <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                      placeholder="e.g. Vanilla, Chocolate, Lemon"
                      autoComplete="off"
                      {...register("flavours")}
                    />
                    {errors.flavours && (
                      <p className="text-rose mt-1 text-xs">{errors.flavours.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm">Design (photos allowed)</label>
                <textarea
                  rows={4}
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                  placeholder="Describe your design ideas..."
                  autoComplete="off"
                  {...register("design")}
                />
              </div>

              <div>
                <label className="text-sm">
                  Buttercream or fondant finish <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 flex gap-2">
                  <label className="flex-1">
                    <input
                      type="radio"
                      value="buttercream"
                      {...register("finish")}
                      className="peer sr-only"
                    />
                    <span className="peer-checked:bg-apron peer-checked:border-apron block rounded-xl border px-3 py-2 text-center transition peer-checked:text-white">
                      Buttercream
                    </span>
                  </label>
                  <label className="flex-1">
                    <input
                      type="radio"
                      value="fondant"
                      {...register("finish")}
                      className="peer sr-only"
                    />
                    <span className="peer-checked:bg-apron peer-checked:border-apron block rounded-xl border px-3 py-2 text-center transition peer-checked:text-white">
                      Fondant
                    </span>
                  </label>
                </div>
                {errors.finish && (
                  <p className="text-rose mt-1 text-xs">{errors.finish.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm">Notes</label>
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                  placeholder="Any additional information..."
                  autoComplete="off"
                  {...register("notes")}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-apron hover:bg-rose rounded-xl px-5 py-2.5 font-semibold text-white shadow-md transition disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSubmitting}
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
              {submitError && (
                <p className="text-rose mt-2 text-sm">{submitError}</p>
              )}
            </form>
          )}
        </div>
        </section>
      </FadeInSection>
    </motion.div>
  );
}

