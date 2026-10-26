"use client";

import { RevealText } from "../motion-primitives";

/* The section title every Selected Work layout opens with. */
export function WorkHeading({ center = false }: { center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""}>
      <h2 className="type-display">
        <RevealText text="Selected Work" stagger={0.05} />
      </h2>
      <p className={`type-prose mt-4 max-w-[40ch] text-ink/70 ${center ? "mx-auto" : ""}`}>
        Six projects, from construction to fintech to fragrance.
      </p>
    </div>
  );
}
