// app/error.tsx
"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-lg font-semibold mb-2">Κάτι πήγε στραβά</h1>
      <p className="text-sm text-neutral-600 mb-4">{error?.message || "Σφάλμα εφαρμογής."}</p>
      <button
        onClick={() => reset()}
        className="rounded-lg border border-orange-600 px-3 py-2 text-sm text-orange-700 bg-white hover:bg-orange-50"
      >
        Προσπάθησε ξανά
      </button>
    </div>
  );
}
