'use client';

import { useEffect, useState } from 'react';
import { ChefHat, Coffee, Sandwich } from 'lucide-react';

/**
 * Shows bouncing icons (no spinner) on first page load,
 * then renders children. Suspense loaders inside still work normally.
 */
export default function BootLoader({ children, minMs = 500 }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), Math.max(0, minMs));
    return () => clearTimeout(t);
  }, [minMs]);

  if (!ready) {
    return (
      <div
        className="min-h-[50vh] flex flex-col items-center justify-center gap-5"
        role="status"
        aria-busy="true"
      >
        {/* Bouncing icon row */}
        <div className="flex items-end gap-4">
          <Bounce delay="0s"   label="Κρέπα"><ChefHat size={22} /></Bounce>
          <Bounce delay="0.12s" label="Καφές"><Coffee size={22} /></Bounce>
          <Bounce delay="0.24s" label="Σάντουιτς"><Sandwich size={22} /></Bounce>
        </div>

        <p className="text-sm text-neutral-600">Φόρτωση…</p>

        {/* subtle accent behind */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-12 h-[180px]
                     bg-[radial-gradient(80%_60%_at_50%_-10%,rgba(255,159,64,0.18),transparent)]"
        />
      </div>
    );
  }

  return children;
}

function Bounce({ children, delay = '0s', label }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-orange-100 text-orange-600 shadow-sm animate-bounce"
        style={{ animationDelay: delay }}
        aria-hidden
      >
        {children}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-wide text-neutral-500">{label}</span>
    </div>
  );
}
