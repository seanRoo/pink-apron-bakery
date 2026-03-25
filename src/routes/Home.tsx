import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

import FadeInSection from "@/components/FadeInSection";
import ProductCard from "@/components/ProductCard";
import { ProductDetailDialog } from "@/components/ProductDetailDialog";
import ResponsiveProductImage from "@/components/ResponsiveProductImage";
import { reviews } from "@/data/reviews";
import type { Product } from "@/types/product";
import { getSpotlightCakes } from "@/lib/spotlightCakes";

// Hero collage images - mix of spotlight cakes
const heroCollageImages = [
  "/img/spotlight_cakes/drip_cake.jpg",
  "/img/spotlight_cakes/teddy_bear_cake.jpg",
  "/img/spotlight_cakes/safari_cake.jpg",
  "/img/spotlight_cakes/farm_cake.jpg",
  "/img/spotlight_cakes/rainbow_cake.jpg",
  "/img/spotlight_cakes/vintage_lambeth_cake.jpg",
  "/img/spotlight_cakes/bento_cake.jpg",
  "/img/spotlight_cakes/number_cake.jpg",
  "/img/spotlight_cakes/naas_ball_cake.jpg",
];

export default function Home() {
  const spotlight = useMemo(() => getSpotlightCakes(), []);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
  const [showAllSpotlight, setShowAllSpotlight] = useState(false);
  const [selectedSpotlight, setSelectedSpotlight] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleExpandReview = (index: number) => {
    setExpandedReviews((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 6);

  return (
    <motion.div
      className="space-y-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-[1400px] items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="space-y-6 order-2 md:order-1">
            {[
              <h1 className="font-script text-rose mb-2 text-5xl leading-none md:text-6xl">Pink Apron Bakery</h1>,
              <div className="text-apron mb-1 font-serif text-lg tracking-wide md:text-xl">Sweet moments, beautifully baked</div>,
              <div className="bg-rose/30 mb-2 h-1 w-16 rounded-full" />,
              <p className="text-warmgray mb-4 text-xl font-body font-medium leading-relaxed">Welcome to Pink Apron Bakery! We believe every celebration deserves a centerpiece that's as unique as you are.</p>,
              <p className="text-warmgray mb-4 text-lg font-body font-medium leading-relaxed">Specializing in bespoke celebration cakes and cupcakes, we pour care and creativity into every made-to-order creation for birthdays, weddings, and all of life's special occasions.</p>,
              <p className="text-warmgray mb-4 text-lg font-body font-medium leading-relaxed">Get in touch and let us help make your next event truly unforgettable.</p>,
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/enquiry" className="hover:border-rose/50 rounded-xl border px-4 py-2 font-semibold shadow">Custom cake enquiry</Link>
                <Link to="/weddings" className="bg-rose hover:bg-apron rounded-xl px-4 py-2 font-semibold text-white shadow transition">Wedding cake enquiry</Link>
              </div>,
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
          <motion.div
            className="border-apron mx-auto w-[360px] h-[360px] md:w-[480px] md:h-[480px] lg:w-[560px] lg:h-[560px] rounded-full border-4 bg-white shadow-2xl relative order-1 md:order-2"
            style={{ boxShadow: '0 20px 40px rgba(230, 132, 173, 0.3), 0 0 0 4px rgba(230, 132, 173, 0.1)' }}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* Center hero image - HIGH PRIORITY */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[54%] h-[54%] overflow-hidden rounded-full z-10 bg-rose/20">
              <ResponsiveProductImage
                src="/img/hero.png"
                alt="Pink Apron Bakery logo"
                className="h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            {/* Outer images positioned in a circle - 12 images */}
            {[...heroCollageImages, ...heroCollageImages.slice(0, 3)].slice(0, 12).map((img, i) => {
              const angle = (i * 30) - 90;
              const angleRad = (angle * Math.PI) / 180;
              const radius = 38;
              const top = 50 + Math.sin(angleRad) * radius;
              const left = 50 + Math.cos(angleRad) * radius;
              return (
                <motion.div
                  key={`outer-${i}`}
                  className="absolute w-[18%] h-[18%] overflow-hidden rounded-full -translate-x-1/2 -translate-y-1/2 bg-rose/10"
                  style={{ top: `${top}%`, left: `${left}%` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.07, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <ResponsiveProductImage
                    src={img}
                    alt={`Cake ${i + 1}`}
                    className="h-full w-full object-cover"
                    loading={i < 4 ? "eager" : "lazy"}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Spotlight */}
      <FadeInSection>
        <section className="mx-auto max-w-[1400px] px-4">
          <div className="mb-2">
            <h2
              className="text-rose font-script text-4xl tracking-wide drop-shadow-sm md:text-5xl"
              style={{ textShadow: "0 2px 8px rgba(255, 192, 203, 0.15)" }}
            >
              Spotlight cakes
            </h2>
          </div>

          <div className="mt-4 grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3">
            {spotlight.map((p, i) => (
              <div
                key={p.id}
                className={i >= 6 && !showAllSpotlight ? "hidden sm:block" : ""}
              >
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() => {
                    setSelectedSpotlight(p);
                    setDialogOpen(true);
                  }}
                >
                  <ProductCard product={p} hidePrice hideTags />
                </button>
              </div>
            ))}
          </div>
          {!showAllSpotlight && spotlight.length > 6 && (
            <div className="mt-8 text-center sm:hidden">
              <button
                onClick={() => setShowAllSpotlight(true)}
                className="bg-apron hover:bg-rose rounded-full px-8 py-3 font-semibold text-white shadow-lg transition"
              >
                View More Cakes
              </button>
            </div>
          )}
        </section>
      </FadeInSection>

      {/* About */}
      <FadeInSection delay={0.1}>
        <section className="bg-cream/60 mx-auto max-w-[1400px] rounded-2xl px-6 py-14 shadow-lg">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2
              className="font-script text-rose mb-4 text-4xl tracking-wide drop-shadow-sm md:text-5xl"
              style={{ textShadow: "0 2px 8px rgba(255, 192, 203, 0.15)" }}
            >
              About Pink Apron Bakery
            </h2>
            <p className="text-warmgray mb-4 text-xl font-body font-medium leading-relaxed">
              Hi, I'm Niamh, the baker behind Pink Apron Bakery!
            </p>
            <p className="text-warmgray mb-4 text-lg font-body font-medium leading-relaxed">
              What began as a childhood hobby truly blossomed into a passion during my college
              years. After honing my skills baking for friends and family, my order book quickly
              grew. I have since been lucky enough to contribute to countless celebrations, from
              christenings and baby showers to beautiful weddings. I love all things creative, and
              there is nothing better than crafting a cake that is both delicious and stunningly
              beautiful.
            </p>
            <p className="text-warmgray mb-6 text-lg font-body font-medium leading-relaxed">
              I thrive on creativity and love a good challenge! No matter how unique or "crazy" your
              idea may seem, I am ready to work with you to turn your vision into a delicious
              reality. Get in touch and I would be delighted to help design the perfect cake for your
              next celebration!
            </p>
          </div>
          <div className="flex justify-center">
            <ResponsiveProductImage
              src="/img/niamh.jpg"
              alt="Niamh from Pink Apron Bakery"
              className="w-full max-w-xl rounded-2xl border-4 border-rose object-cover shadow-xl ring-4 ring-rose/20"
              loading="lazy"
            />
          </div>
        </div>
        </section>
      </FadeInSection>

      {/* Testimonials */}
      <FadeInSection delay={0.2}>
        <section className="mx-auto max-w-[1400px] px-4 pb-16">
          <h2
            className="text-rose font-script mb-8 text-4xl tracking-wide drop-shadow-sm md:text-5xl"
            style={{ textShadow: "0 2px 8px rgba(255, 192, 203, 0.15)" }}
          >
            What customers say
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
            {visibleReviews.map((review, i) => (
              <div
                key={i}
                className={`relative flex flex-col items-start rounded-2xl bg-white/80 p-6 shadow-lg min-h-[680px] ${!showAllReviews && i >= 3 ? "hidden sm:flex" : ""}`}
              >
                {review.photo && (
                  <div className="mb-4 w-full aspect-[3/4] overflow-hidden rounded-xl">
                    <ResponsiveProductImage
                      src={review.photo}
                      alt={`Review from ${review.name}`}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                )}
                <span className="text-rose -mb-1 text-3xl">"</span>
                <p
                  className={`text-warmgray text-lg italic ${!expandedReviews.has(i) ? "line-clamp-4" : ""}`}
                >
                  {review.text}
                </p>
                {review.text.length > 150 && (
                  <button
                    onClick={() => toggleExpandReview(i)}
                    className="text-rose hover:text-apron mt-2 text-sm font-medium transition-colors"
                  >
                    {expandedReviews.has(i) ? "Read less" : "Read more"}
                  </button>
                )}
                <div className="font-script text-rose mt-4 self-end text-xl">{review.name}</div>
              </div>
            ))}
          </div>
          {!showAllReviews && reviews.length > 6 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowAllReviews(true)}
                className="bg-apron hover:bg-rose rounded-full px-8 py-3 font-semibold text-white shadow-lg transition"
              >
                View More Reviews
              </button>
            </div>
          )}
        </section>
      </FadeInSection>

      <ProductDetailDialog
        product={selectedSpotlight}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </motion.div>
  );
}
