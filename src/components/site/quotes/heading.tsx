"use client";

import type { ReactNode } from "react";
import { RevealText } from "../motion-primitives";

/* The title every testimonials view opens with; `aside` holds the switch. */
export function QuotesHeading({ aside }: { aside?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <h2 className="type-display">
        <RevealText text="Kind words" stagger={0.05} />
      </h2>
      {aside}
    </div>
  );
}
