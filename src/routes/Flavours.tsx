import { motion } from "framer-motion";

import ResponsiveProductImage from "@/components/ResponsiveProductImage";

export default function Flavours() {
  return (
    <motion.section
      className="mx-auto max-w-4xl px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-2xl bg-white p-6 shadow-lg md:p-10">
        <motion.h1
          className="text-rose font-script mb-2 text-4xl tracking-wide drop-shadow-sm md:text-5xl"
          style={{ textShadow: "0 2px 8px rgba(255, 192, 203, 0.15)" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.4, 0, 0.2, 1] }}
        >
          Flavours
        </motion.h1>
        <motion.div
          className="bg-rose/30 mb-8 h-1 w-16 rounded-full"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          style={{ originX: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        />

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <ResponsiveProductImage
            src="/img/flavours.png"
            alt="Flavours available at Pink Apron Bakery"
            className="w-full max-w-[38rem] rounded-xl object-contain"
            loading="lazy"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}

