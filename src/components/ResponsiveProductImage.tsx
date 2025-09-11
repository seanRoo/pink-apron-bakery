// Shared responsive image component for AVIF/WebP/JPG/PNG
import React from "react";
type Props = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
  decoding?: "sync" | "async";
  fetchPriority?: "high" | "low" | "auto";
};

export default function ResponsiveProductImage({
  src,
  alt,
  className,
  width,
  height,
  loading = "lazy",
  decoding = "async",
  fetchPriority = "auto",
}: Props) {
  const webp = src.replace(/\.(jpg|jpeg|png)$/, ".webp");
  const avif = src.replace(/\.(jpg|jpeg|png|webp)$/, ".avif");
  return (
    <picture>
      <source type="image/avif" srcSet={avif} />
      <source type="image/webp" srcSet={webp} />
      <img
        src={src}
        srcSet={`${src} 1x, ${webp} 2x`}
        sizes="(max-width: 640px) 100vw, 400px"
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
      />
    </picture>
  );
}
