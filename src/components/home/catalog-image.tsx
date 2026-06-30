"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type CatalogImageProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  fallbackClass: string;
  fallbackText: string;
  fit?: "cover" | "contain";
  roundedClass?: string;
};

export function CatalogImage({
  src,
  alt,
  className,
  imgClassName,
  fallbackClass,
  fallbackText,
  fit = "cover",
  roundedClass = "rounded-2xl",
}: CatalogImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={cn(
          "flex size-full items-center justify-center overflow-hidden",
          roundedClass,
          fallbackClass,
          className
        )}
      >
        <span className="text-sm font-black uppercase tracking-wide text-white/90 sm:text-base">
          {fallbackText}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative size-full", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "size-full overflow-hidden",
          roundedClass,
          fit === "contain" ? "object-contain p-2" : "object-cover",
          imgClassName
        )}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
