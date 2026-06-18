"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Img = { url: string; alt?: string | null };

export function PropertyGallery({ images }: { images: Img[] }) {
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const count = images.length;
  const touchX = useRef<number | null>(null);

  const go = useCallback((n: number) => setIdx((p) => (n + count) % count), [count]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === "ArrowLeft") go(idx - 1);
      else if (e.key === "ArrowRight") go(idx + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, idx, go]);

  // Lock scroll while preserving (and restoring) the exact position
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // Single-finger swipe (two-finger gestures fall through to native pinch-zoom)
  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches.length === 1 ? e.touches[0].clientX : null;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) (dx < 0 ? go(idx + 1) : go(idx - 1));
    touchX.current = null;
  }

  if (!count) return <div className="aspect-[16/10] w-full bg-surface-2" />;

  return (
    <div>
      {/* Main image */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Open gallery"
        className="relative aspect-[16/10] w-full cursor-zoom-in overflow-hidden bg-surface-2"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen(true)}
      >
        <Image
          src={images[idx].url}
          alt={images[idx].alt ?? "Property image"}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />
        <span className="absolute bottom-3 right-3 bg-ink/75 px-2.5 py-1 text-[0.72rem] text-white">
          {idx + 1} / {count}
        </span>
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <div className="mt-2 grid grid-cols-5 gap-2 sm:grid-cols-7">
          {images.map((image, i) => (
            <button
              key={image.url + i}
              onClick={() => setIdx(i)}
              className={cn(
                "relative aspect-square overflow-hidden border transition-opacity",
                i === idx ? "border-accent opacity-100" : "border-line-2 opacity-60 hover:opacity-100",
              )}
            >
              <Image src={image.url} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.88)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          onClick={() => setOpen(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Close */}
          <button
            aria-label="Close gallery"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full text-2xl text-white/90 transition-colors hover:bg-white/10"
          >
            ×
          </button>

          {/* Counter */}
          <span className="absolute left-1/2 top-5 z-10 -translate-x-1/2 text-[0.8rem] tracking-wide text-white/70">
            {idx + 1} / {count}
          </span>

          {/* Image (pinch-zoom enabled on mobile, bounded to viewport on desktop) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[idx].url}
            alt={images[idx].alt ?? "Property image"}
            onClick={(e) => e.stopPropagation()}
            style={{ touchAction: "pinch-zoom" }}
            className="max-h-[88vh] max-w-[92vw] select-none object-contain"
          />

          {/* Arrows */}
          {count > 1 && (
            <>
              <button
                aria-label="Previous image"
                onClick={(e) => { e.stopPropagation(); go(idx - 1); }}
                className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 sm:left-6"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <button
                aria-label="Next image"
                onClick={(e) => { e.stopPropagation(); go(idx + 1); }}
                className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 sm:right-6"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m9 6 6 6-6 6" /></svg>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
