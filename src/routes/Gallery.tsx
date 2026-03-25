import { motion } from "framer-motion";
import { useState } from "react";


import { getImagesForFolder } from "@/lib/gallery";


const galleryFolders = [
  "Baby cakes",
  "Kids cakes",
  "Cakes for her",
  "Cakes for him",
  "Cupcakes",
  "Novelty cakes",
  "Seasonal",
  "Wedding cakes",
  "Vintage Lambeth cakes",
  "Treatbox",
] as const;

type GalleryFolder = typeof galleryFolders[number];

function GalleryImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative h-full w-full">
      {!loaded && (
        <div className="bg-rose/10 absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg overflow-hidden">
          {/* shimmer sweep */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <span className="text-3xl opacity-30 select-none">🎂</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full rounded-lg object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

const PAGE_SIZE = 30;

export default function Gallery() {
  const [selectedFolder, setSelectedFolder] = useState<GalleryFolder>(galleryFolders[0]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const allImages = getImagesForFolder(selectedFolder);
  const images = allImages.slice(0, visibleCount);

  function handleFolderChange(folder: GalleryFolder) {
    setSelectedFolder(folder);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <motion.section
      className="mx-auto max-w-[1400px] px-4 py-10"
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
          Gallery
        </motion.h1>
        <motion.div
          className="bg-rose/30 mb-8 h-1 w-16 rounded-full"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          style={{ originX: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Folder Navigation */}
        <div className="mb-8 flex flex-wrap gap-2">
          {galleryFolders.map((folder) => (
            <button
              key={folder}
              onClick={() => handleFolderChange(folder)}
              className={`cursor-pointer rounded-xl px-4 py-2 font-medium transition-colors ${
                selectedFolder === folder
                  ? "bg-apron text-white"
                  : "bg-cream text-apron hover:bg-rose/20"
              }`}
            >
              {folder} <span className="font-bold opacity-70">({getImagesForFolder(folder).length})</span>
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {allImages.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image, i) => (
                <motion.div
                  key={`${selectedFolder}-${image}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="bg-cream aspect-[4/5] rounded-xl p-3"
                >
                  <GalleryImage src={image} alt={`${selectedFolder} gallery image ${i + 1}`} />
                </motion.div>
              ))}
            </div>
            {visibleCount < allImages.length && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="bg-apron hover:bg-apron/90 cursor-pointer rounded-xl px-8 py-3 font-semibold text-white transition-colors"
                >
                  Load more ({allImages.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-warmgray flex flex-col items-center justify-center py-16">
            <p className="mb-2 text-xl font-medium">Gallery images coming soon</p>
            <p className="text-base font-medium leading-relaxed">
              Images for {selectedFolder} will be displayed here once added.
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}

