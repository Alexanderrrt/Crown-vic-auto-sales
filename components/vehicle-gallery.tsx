"use client";

import Image from "next/image";
import { useState } from "react";

export function VehicleGallery({ title, images }: { title: string; images: string[] }) {
  const [active, setActive] = useState(0);
  const activeImage = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-[16/10] bg-slate-100">
        <Image src={activeImage} alt={title} fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/45 to-transparent" />
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 border-b border-slate-200 px-6 py-4">
          {images.slice(0, 8).map((media, index) => (
            <button
              key={`${media}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1} of ${title}`}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl border transition duration-200 ${
                active === index ? "border-red-500 ring-2 ring-red-200" : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <Image src={media} alt={`${title} view ${index + 1}`} fill sizes="25vw" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
