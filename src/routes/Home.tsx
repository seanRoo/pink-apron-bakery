import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

import ProductCard from "@/components/ProductCard";
import ResponsiveProductImage from "@/components/ResponsiveProductImage";
import { fetchProducts } from "@/lib/csv/parseProducts";
import type { Product } from "@/types/product";

export default function Home() {
  const [all, setAll] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts()
      .then(setAll)
      .catch(() => setAll([]));
  }, []);

  const spotlight = useMemo(() => all.filter((p) => p.featured).slice(0, 6), [all]);

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
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="space-y-6">
            <h1 className="font-script text-rose mb-2 text-5xl leading-none md:text-6xl">
              Pink Apron Bakery
            </h1>
            <div className="text-apron mb-1 font-serif text-lg tracking-wide md:text-xl">
              Sweet moments, beautifully baked
            </div>
            <div className="bg-rose/30 mb-2 h-1 w-16 rounded-full" />
            <p className="text-warmgray max-w-xl font-sans md:text-lg">
              Welcome to Pink Apron Bakery, where every cake is made to order with care and
              creativity. We specialize in bespoke celebration cakes and cupcakes for birthdays,
              weddings, and all of life's special occasions. Enjoy local pickup or delivery in
              Kildare, and let us help you make your next event unforgettable with a cake that's as
              unique as you are.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                to="/products"
                className="bg-apron hover:bg-rose rounded-xl px-4 py-2 font-semibold text-white shadow"
              >
                View all cakes
              </Link>
              <Link
                to="/enquiry"
                className="hover:border-rose/50 rounded-xl border px-4 py-2 font-semibold shadow"
              >
                Custom cake enquiry
              </Link>
            </div>
          </div>
          <div className="animate-in fade-in-50 slide-in-from-right-4 border-rose/10 mx-auto aspect-square max-w-sm overflow-hidden rounded-full border-4 bg-white shadow-lg md:max-w-md">
            <ResponsiveProductImage
              src="/img/hero.png"
              alt="Pink Apron Bakery hero"
              className="h-full w-full rounded-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Spotlight */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="mb-2 flex items-center justify-between">
          <h2
            className="text-rose font-script text-4xl tracking-wide drop-shadow-sm md:text-5xl"
            style={{ textShadow: "0 2px 8px rgba(255, 192, 203, 0.15)" }}
          >
            Spotlight cakes
          </h2>
          <Link
            to="/products"
            className="text-rose text-base font-medium hover:underline md:text-lg"
          >
            View all
          </Link>
        </div>

        <div className="mt-4 grid auto-rows-fr grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(spotlight.length ? spotlight : all.slice(0, 6)).map((p) => (
            <ProductCard key={p.id} product={{ ...p, images: ["/img/placeholder.jpg"] }} />
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/products"
            className="bg-apron hover:bg-rose inline-block rounded-xl px-4 py-2 text-white"
          >
            View all cakes
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="bg-cream/60 mx-auto max-w-6xl rounded-2xl px-6 py-14 shadow-lg">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2
              className="font-script text-rose mb-4 text-4xl tracking-wide drop-shadow-sm md:text-5xl"
              style={{ textShadow: "0 2px 8px rgba(255, 192, 203, 0.15)" }}
            >
              About Pink Apron Bakery
            </h2>
            <p className="text-warmgray mb-4 text-lg">
              At Pink Apron Bakery, every cake is a celebration. Founded in the heart of Kildare, we
              believe in the magic of handcrafted baking—using only the finest ingredients, a dash
              of creativity, and a whole lot of love. From whimsical birthday cakes to elegant
              wedding tiers, we bring your sweetest visions to life.
            </p>
            <p className="text-warmgray mb-4">
              Our passion is creating bespoke cakes and cupcakes for every occasion, big or small.
              Each treat is made to order, ensuring freshness and a personal touch. We offer both
              convenient pickup and local delivery, so your special moments are always a little
              sweeter.
            </p>
            <p className="text-warmgray mb-6">
              Whether you have a design in mind or need inspiration, we’re here to help you
              celebrate with style and flavor. Discover why our customers return time and again for
              cakes that look as good as they taste!
            </p>
            <Link
              to="/enquiry"
              className="bg-apron hover:bg-rose inline-block rounded-xl px-5 py-2 font-semibold text-white shadow-md transition"
            >
              Meet the Baker
            </Link>
          </div>
          <div className="flex justify-center">
            <ResponsiveProductImage
              src="/img/cupcakes.png"
              alt="Decorated cake from Pink Apron Bakery"
              className="border-rose/20 w-full max-w-md rounded-2xl border object-cover shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2
          className="text-rose font-script mb-8 text-4xl tracking-wide drop-shadow-sm md:text-5xl"
          style={{ textShadow: "0 2px 8px rgba(255, 192, 203, 0.15)" }}
        >
          What customers say
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Aoife",
              text: "Absolutely stunning cake and it tasted incredible! The attention to detail was amazing and everyone at the party was so impressed. Will definitely be ordering again.",
            },
            {
              name: "Liam",
              text: "Kids loved it—looked exactly like the brief. The cake was delicious and the design was spot on. The whole process was easy and friendly from start to finish.",
            },
            {
              name: "Niamh",
              text: "Seamless pickup and beautiful design, thank you! The cake was the highlight of our celebration and tasted as good as it looked. Highly recommend Pink Apron Bakery!",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="relative flex min-h-[180px] flex-col items-start rounded-2xl bg-white/80 p-6 shadow-lg"
            >
              <span className="text-rose mb-2 text-3xl">“</span>
              <p className="text-warmgray flex-1 text-lg italic">{t.text}</p>
              <div className="font-script text-rose mt-4 self-end text-xl">— {t.name}</div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
