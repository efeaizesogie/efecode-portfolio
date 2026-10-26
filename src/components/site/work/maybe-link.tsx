"use client";

import type { ReactNode } from "react";

/* Links out to a project's live site when it has one; otherwise a plain
 * wrapper, so projects without a public site never point at nothing. */
export function MaybeLink({
  href,
  className,
  children,
}: {
  href?: string | undefined;
  className?: string;
  children: ReactNode;
}) {
  if (!href) return <div className={className}>{children}</div>;
  return (
    <a href={href} target="_blank" rel="noreferrer" data-cursor="Visit" className={className}>
      {children}
    </a>
  );
}
