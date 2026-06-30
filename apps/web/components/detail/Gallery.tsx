'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
    };
    document.addEventListener('keydown', onKey);
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      triggerRef.current?.focus();
    };
  }, [lightbox]);

  if (!images.length) return null;

  return (
    <>
      <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
        <button
          ref={triggerRef}
          onClick={() => setLightbox(true)}
          className="relative aspect-[16/10] overflow-hidden rounded-2xl ring-focus"
          aria-label="Open gallery"
        >
          <Image src={images[active]} alt={title} fill className="object-cover" sizes="66vw" priority />
          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1.5 text-xs text-text backdrop-blur">
            View gallery
          </span>
        </button>
        <div className="grid grid-cols-4 gap-3 md:grid-cols-2">
          {images.slice(0, 4).map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-xl ring-focus ${
                active === i ? 'ring-2 ring-accent' : ''
              }`}
            >
              <Image src={src} alt={`${title} ${i + 1}`} fill className="object-cover" sizes="20vw" />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} gallery`}
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 outline-none"
            onClick={() => setLightbox(false)}
          >
            <button
              onClick={() => setLightbox(false)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <div className="relative h-[80vh] w-[90vw]" onClick={(e) => e.stopPropagation()}>
              <Image src={images[active]} alt={title} fill className="object-contain" sizes="90vw" />
            </div>
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(i);
                  }}
                  className={`h-2 rounded-full transition-all ${i === active ? 'w-8 bg-accent' : 'w-2 bg-white/40'}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
