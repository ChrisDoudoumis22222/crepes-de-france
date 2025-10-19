export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-2 border-orange-200" />
        <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-neutral-600">Φόρτωση…</p>
    </div>
  );
}
