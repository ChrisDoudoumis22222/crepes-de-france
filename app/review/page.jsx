'use client';

import { useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ExternalLink, Share2, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

/* ───────────────────────── Config ───────────────────────── */
const CONFIG = {
  reviewUrl: 'https://share.google/blBrQKe1s8vvjiA7p', // κρυφό στην UI
  shopName: 'Crepes de France',
};

/* Ratings με τα δικά σου links + favicon logos */
const RATINGS = [
  {
    name: 'Google Maps',
    url: 'https://share.google/blBrQKe1s8vvjiA7p',
    domainForIcon: 'google.com',
    score: '4,3',
    scale: '5',
    reviews: '394',
    chipClasses: 'border-[#4285f4]/30',
    dotClass: 'bg-[#4285f4]',
  },
  {
    name: 'efood.gr',
    url: 'https://www.e-food.gr/delivery/nea-filadelfeia/crepes-de-france',
    domainForIcon: 'e-food.gr',
    score: '4,8',
    scale: '5',
    reviews: '615',
    chipClasses: 'border-[#e21c23]/30',
    dotClass: 'bg-[#e21c23]',
  },
  {
    name: 'Wolt',
    url: 'https://wolt.com/en/grc/athens/restaurant/crepes-de-france',
    domainForIcon: 'wolt.com',
    score: '9,2',
    scale: '10',
    reviews: '20',
    chipClasses: 'border-[#00b2ff]/30',
    dotClass: 'bg-[#00b2ff]',
  },
  {
    name: 'Box',
    url: 'https://box.gr/delivery/nea-filadelfeia/crepes-de-france',
    domainForIcon: 'box.gr',
    score: '4,6',
    scale: '5',
    reviews: '26',
    chipClasses: 'border-[#ff6a00]/30',
    dotClass: 'bg-[#ff6a00]',
  },
];

/* ───────────────────────── Helpers ───────────────────────── */
function isValidUrl(u) {
  try {
    const url = new URL(u);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/* ───────────────────────── Component ───────────────────────── */
export default function ReviewPage() {
  const url = useMemo(() => (isValidUrl(CONFIG.reviewUrl) ? CONFIG.reviewUrl : ''), []);
  const canOpen = !!url;

  // QR code (responsive width)
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canOpen || !canvasRef.current) return;
    const isSmall = typeof window !== 'undefined' && window.innerWidth < 640; // sm breakpoint
    const width = isSmall ? 180 : 220;
    QRCode.toCanvas(canvasRef.current, url, { width, margin: 1 }, (err) => {
      if (err) console.error(err);
    });
  }, [canOpen, url]);

  const openReview = () => {
    if (canOpen) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareLink = async () => {
    if (!canOpen) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Κριτική — ${CONFIG.shopName}`,
          text: 'Γράψτε μία κριτική στο Google',
          url,
        });
      } catch {}
    } else {
      openReview();
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 18 } },
  };

  return (
    <section className="relative">
      {/* soft background accent pinned to page bottom (from bottom to top) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[260px] sm:h-[340px]
                   bg-[radial-gradient(80%_70%_at_50%_100%,rgba(255,159,64,0.22),transparent)] z-0"
      />

      {/* HERO */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="relative z-10 mb-5 sm:mb-6 rounded-2xl border border-orange-200 bg-orange-50/70 p-4 sm:p-7"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Star size={18} />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                Δώστε μας μία κριτική στο Google
              </h1>
            </div>
            <p className="text-neutral-700 text-sm sm:text-base">
              Αν σας άρεσε το <strong>{CONFIG.shopName}</strong>, μία σύντομη κριτική κάνει μεγάλη
              διαφορά. Ευχαριστούμε! 🙌
            </p>
          </div>

          {/* κρύβω το animation των 5 αστεριών σε πολύ μικρά screens για να υπάρχει χώρος */}
          <div className="hidden xs:flex items-center gap-1 text-orange-500" aria-hidden>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05 * i, type: 'spring', stiffness: 250, damping: 16 }}
              >
                <Star size={20} className="sm:h-[22px] sm:w-[22px]" fill="currentColor" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* RATINGS: horizontal scroll on mobile, grid on larger */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="relative z-10 mb-5 sm:mb-6"
      >
        <div className="sm:hidden -mx-4 px-4 overflow-x-auto scrollbar-none">
          <div className="flex gap-3 snap-x snap-mandatory">
            {RATINGS.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noreferrer noopener"
                className={`snap-start min-w-[78%] rounded-2xl border ${r.chipClasses} bg-white/80 hover:bg-white transition p-4 flex items-center gap-3`}
              >
                <span className="relative h-8 w-8 shrink-0">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(r.domainForIcon)}&sz=64`}
                    alt={`${r.name} logo`}
                    className="h-8 w-8 rounded-lg object-contain bg-white"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <span className={`absolute -bottom-1 -right-1 h-2 w-2 rounded-full ${r.dotClass}`} />
                </span>
                <div className="leading-tight">
                  <div className="font-semibold text-neutral-900 text-sm">{r.name}</div>
                  <div className="text-xs text-neutral-700">
                    <span className="font-semibold">{r.score}</span> / {r.scale}{' '}
                    {r.reviews ? <span className="text-neutral-500">· {r.reviews} κριτικές</span> : null}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3">
          {RATINGS.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noreferrer noopener"
              className={`rounded-2xl border ${r.chipClasses} bg-white/70 hover:bg-white transition p-4 flex items-center gap-3`}
            >
              <span className="relative h-9 w-9 shrink-0">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(r.domainForIcon)}&sz=64`}
                  alt={`${r.name} logo`}
                  className="h-9 w-9 rounded-xl object-contain bg-white"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <span className={`absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full ${r.dotClass}`} />
              </span>
              <div className="leading-tight">
                <div className="font-semibold text-neutral-900">{r.name}</div>
                <div className="text-sm text-neutral-700">
                  <span className="font-semibold">{r.score}</span> / {r.scale}{' '}
                  {r.reviews ? <span className="text-neutral-500">· {r.reviews} κριτικές</span> : null}
                </div>
              </div>
            </a>
          ))}
        </div>
      </motion.div>

      {/* CARD with QR + buttons (URL hidden) */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="relative z-10 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm"
      >
        {/* Mobile-first: stack; row on lg */}
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
          {/* Left: CTA */}
          <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
            <div className="text-sm text-neutral-600">
              Πατήστε «Γράψτε Κριτική στο Google» ή σκανάρετε το QR.
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={openReview}
                disabled={!canOpen}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium
                           border border-orange-600 text-white bg-orange-600 hover:bg-orange-700
                           disabled:opacity-60"
              >
                <ExternalLink size={16} />
                Γράψτε Κριτική στο Google
              </button>

              <button
                onClick={shareLink}
                disabled={!canOpen}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium
                           border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50
                           disabled:opacity-60"
              >
                <Share2 size={16} />
                Κοινοποίηση
              </button>
            </div>
          </div>

          {/* Right: QR (responsive size from effect) */}
          {canOpen && (
            <div className="lg:w-[260px]">
              <div className="flex items-center gap-2 mb-2 text-neutral-700">
                <QrCode size={18} />
                <span className="text-sm font-medium">Σκανάρετε για να αφήσετε κριτική</span>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm inline-block">
                <canvas ref={canvasRef} className="block rounded-xl bg-white" />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
