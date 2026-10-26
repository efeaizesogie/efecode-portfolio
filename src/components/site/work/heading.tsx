"use client";

import type { ReactNode } from "react";
import { RevealText } from "../motion-primitives";

/* The section title both Selected Work views open with. `aside` sits to the
 * right on wide screens (the view switch). */
export function WorkHeading({ aside }: { aside?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <h2 className="type-display">
          <RevealText text="Selected Work" stagger={0.05} />
        </h2>
        <p className="type-prose mt-4 max-w-[40ch] text-ink/70">
          Six projects, from construction to fintech to fragrance.
        </p>
      </div>
      {aside}
    </div>
  );
}
