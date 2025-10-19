'use client';

import { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  UtensilsCrossed,
  Tag,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter as FilterIcon,
  X,
} from 'lucide-react';

// Lazy-load the Addon drawer (client-only)
const AddonDrawer = dynamic(() => import('./AddonDrawer'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 bg-black/30 grid place-items-center">
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-5 border border-neutral-200 shadow">
        <div className="relative">
          <div className="h-10 w-10 rounded-full border-2 border-orange-200" />
          <div className="absolute inset-0 h-10 w-10 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-neutral-600">Φόρτωση επιλογών…</p>
      </div>
    </div>
  ),
});

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-neutral-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-2/3 bg-neutral-100 rounded"></div>
        <div className="h-3 w-4/5 bg-neutral-100 rounded"></div>
        <div className="h-3 w-1/2 bg-neutral-100 rounded"></div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('Όλες');

  const [activeItem, setActiveItem] = useState(null);

  // Filter panel state (works on all breakpoints; layout adapts)
  const [filterOpen, setFilterOpen] = useState(false);

  // Track scroll direction to auto-close sheet when user scrolls upward
  const lastScrollY = useRef(0);

  const PAGE_SIZE = 20;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/crepes_de_france_menu.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('Αποτυχία φόρτωσης του μενού');
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err.message || String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Close filter on Esc
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setFilterOpen(false);
    };
    if (filterOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filterOpen]);

  // Close filter when user scrolls UP (towards top) by a threshold
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const delta = y - (lastScrollY.current || 0);
      // If scrolling upward (delta < 0) by at least 20px, close the filter panel
      if (filterOpen && delta < -20) {
        setFilterOpen(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [filterOpen]);

  const items = data?.items ?? [];

  // Desktop/tablet chips
  const categories = useMemo(
    () => ['Όλες', ...Array.from(new Set(items.map((i) => i.category || 'Λοιπά')))],
    [items]
  );

  // Mobile/Responsive sheet list with counts (one per line)
  const categoriesWithCounts = useMemo(() => {
    const counts = new Map();
    items.forEach((it) => {
      const c = it.category || 'Λοιπά';
      counts.set(c, (counts.get(c) || 0) + 1);
    });
    const list = ['Όλες', ...Array.from(new Set(items.map((i) => i.category || 'Λοιπά')))];
    return list.map((c) => ({
      name: c,
      count: c === 'Όλες' ? items.length : (counts.get(c) || 0),
    }));
  }, [items]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter((it) => {
      const passCat = category === 'Όλες' || (it.category || 'Λοιπά') === category;
      if (!term) return passCat;
      const blob = [it.name, it.description, it.category].filter(Boolean).join(' ').toLowerCase();
      return passCat && blob.includes(term);
    });
  }, [items, q, category]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [q, category]);

  const visibleItems = filtered.slice(0, visibleCount);
  const canLoadMore = visibleCount < filtered.length;

  const container = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 160, damping: 18 } },
  };
  const gridStagger = {
    hidden: { opacity: 1 },
    show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
  };
  const card = {
    hidden: { opacity: 0, y: 8, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 18 } },
  };

  const catRef = useRef(null);
  const scrollCats = (dir) => {
    const el = catRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((v) => Math.min(v + PAGE_SIZE, filtered.length));
      setLoadingMore(false);
    }, 500);
  };

  // Used by both top chips and sheet
  const applyCategory = (c) => {
    setCategory(c);
    setFilterOpen(false); // close panel after choosing
  };

  return (
    <section className="relative">
      {/* soft background accent pinned to page bottom (from bottom to top) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[240px] sm:h-[320px]
                   bg-[radial-gradient(80%_70%_at_50%_100%,rgba(255,159,64,0.18),transparent)] z-0"
      />

      {/* Content wrapper sits above the accent */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div variants={container} initial="hidden" animate="show" className="mb-5 sm:mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <UtensilsCrossed size={18} />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">Μενού</h1>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Αναζήτηση προϊόντων…"
              className="w-full rounded-2xl border border-neutral-200 bg-white px-10 py-3 outline-none
                         focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          {/* Categories row with arrows (desktop/tablet) */}
          <div className="relative">
            <button
              aria-label="Προηγούμενες κατηγορίες"
              onClick={() => scrollCats('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full
                         border border-orange-500 text-orange-600 bg-white hover:bg-orange-50
                         shadow-sm hidden sm:inline-flex items-center justify-center"
            >
              <ChevronLeft size={18} />
            </button>

            <div ref={catRef} className="cat-scroll flex items-center gap-2 overflow-x-auto px-10 sm:px-12 pb-2">
              <span className="shrink-0 inline-flex items-center gap-1 text-sm text-neutral-500 mr-1">
                <Tag size={16} /> Κατηγορίες:
              </span>
              {categories.map((c) => {
                const active = category === c;
                return (
                  <button
                    key={c}
                    onClick={() => applyCategory(c)}
                    className={[
                      'shrink-0 rounded-full px-3 py-1.5 text-sm border transition',
                      active
                        ? 'border-orange-600 text-orange-700 bg-orange-50'
                        : 'border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50',
                    ].join(' ')}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            <button
              aria-label="Επόμενες κατηγορίες"
              onClick={() => scrollCats('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full
                         border border-orange-500 text-orange-600 bg-white hover:bg-orange-50
                         shadow-sm hidden sm:inline-flex items-center justify-center"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Initial skeletons */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4 flex items-start gap-2">
            <AlertCircle className="mt-0.5" size={18} />
            <div>
              <div className="font-medium">Σφάλμα φόρτωσης</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-600">
            Δεν βρέθηκαν προϊόντα για τα φίλτρα/αναζήτηση.
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <>
            <motion.div
              variants={gridStagger}
              initial="hidden"
              animate="show"
              className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            >
              {visibleItems.map((it, idx) => {
                const hasImage = !!it.image;
                return (
                  <motion.article
                    key={`${it.name}-${idx}`}
                    variants={card}
                    className="group rounded-2xl border border-orange-500 bg-white overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                    onClick={() => setActiveItem(it)}
                  >
                    {/* Render image block ONLY if image exists */}
                    {hasImage && (
                      <div className="aspect-[16/9] bg-neutral-100">
                        <img
                          src={it.image}
                          alt={it.image_alt || it.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-neutral-900">{it.name}</h3>
                        <div className="shrink-0 rounded-full px-3 py-1 text-sm bg-orange-50 text-orange-700 border border-orange-200">
                          {it.price_text || (it.price_value ? `${Number(it.price_value).toFixed(2)}€` : '—')}
                        </div>
                      </div>

                      {it.description && (
                        <p className="text-sm text-neutral-600 line-clamp-2">{it.description}</p>
                      )}

                      {it.category && (
                        <div className="inline-flex items-center gap-1 text-xs rounded-full px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-200">
                          {it.category}
                        </div>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>

            {/* Load more */}
            {canLoadMore && (
              <div className="flex items-center justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center justify-center rounded-xl px-4 py-3 font-medium
                             border border-orange-600 text-orange-700 bg-white hover:bg-orange-50 disabled:opacity-60"
                >
                  {loadingMore ? 'Φόρτωση…' : 'Φόρτωση περισσότερων'}
                </button>
              </div>
            )}

            {/* Loading-more skeletons */}
            <AnimatePresence>
              {loadingMore && (
                <motion.div
                  key="more"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {Array.from({ length: Math.min(PAGE_SIZE, filtered.length - visibleItems.length) }).map((_, i) => (
                    <SkeletonCard key={`more-${i}`} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Addon drawer (lazy) */}
        <Suspense fallback={null}>
          {activeItem && <AddonDrawer item={activeItem} onClose={() => setActiveItem(null)} />}
        </Suspense>

        {/* Spacer so floating FAB doesn't overlap footer */}
        <div className="h-16 sm:h-12" />
      </div>

      {/* Floating "Φίλτρα" button (shows on all sizes; looks like FAB on mobile) */}
      <div className="fixed inset-x-0 bottom-4 z-20 flex justify-center">
        <button
          onClick={() => setFilterOpen(true)}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium
                     border border-orange-600 bg-white text-orange-700 shadow-sm hover:bg-orange-50"
        >
          <FilterIcon size={16} />
          Φίλτρα
        </button>
      </div>

      {/* Responsive Filter Panel */}
      <AnimatePresence>
        {filterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="filter-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 z-30 bg-black"
            />

            {/* Mobile bottom sheet */}
            <motion.div
              key="filter-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="fixed inset-x-0 bottom-0 z-40 md:hidden"
            >
              <div className="mx-auto max-w-lg w-full rounded-t-3xl border border-neutral-200 bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
                  <div className="font-semibold">Φίλτρα</div>
                  <button
                    aria-label="Κλείσιμο"
                    onClick={() => setFilterOpen(false)}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-xl border bg-white hover:bg-neutral-50"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Scrollable content */}
                <div className="px-4 py-4 max-h-[70vh] overflow-y-auto">
                  <div className="text-sm text-neutral-500 mb-2 inline-flex items-center gap-1">
                    <Tag size={16} /> Κατηγορία
                  </div>

                  <ul role="listbox" aria-label="Φίλτρο κατηγορίας" className="space-y-2">
                    {categoriesWithCounts.map(({ name, count }) => {
                      const active = category === name;
                      return (
                        <li key={`sheet-${name}`}>
                          <button
                            role="option"
                            aria-selected={active}
                            onClick={() => applyCategory(name)}
                            className={[
                              'w-full flex items-center justify-between rounded-xl border px-3.5 py-2.5',
                              'text-sm transition',
                              active
                                ? 'border-orange-600 bg-orange-50 text-orange-700'
                                : 'border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50',
                            ].join(' ')}
                          >
                            <span className="flex items-center gap-3">
                              <span
                                className={[
                                  'inline-flex h-4 w-4 items-center justify-center rounded-full border',
                                  active ? 'border-orange-600' : 'border-neutral-300',
                                ].join(' ')}
                              >
                                <span
                                  className={[
                                    'h-2.5 w-2.5 rounded-full',
                                    active ? 'bg-orange-600' : 'bg-transparent',
                                  ].join(' ')}
                                />
                              </span>
                              <span className="font-medium">{name}</span>
                            </span>

                            <span
                              className={[
                                'inline-flex min-w-[2ch] items-center justify-center rounded-full px-2 py-0.5 text-xs border',
                                active
                                  ? 'border-orange-300 bg-white/70 text-orange-700'
                                  : 'border-neutral-200 bg-neutral-50 text-neutral-600',
                              ].join(' ')}
                            >
                              {count}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Safe area spacer */}
                <div className="h-4" />
              </div>
            </motion.div>

            {/* Desktop/Tablet centered modal */}
            <motion.div
              key="filter-modal"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="fixed inset-0 z-40 hidden md:flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
                  <div className="font-semibold">Φίλτρα</div>
                  <button
                    aria-label="Κλείσιμο"
                    onClick={() => setFilterOpen(false)}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-xl border bg-white hover:bg-neutral-50"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="px-4 py-4 max-h-[70vh] overflow-y-auto">
                  <div className="text-sm text-neutral-500 mb-2 inline-flex items-center gap-1">
                    <Tag size={16} /> Κατηγορία
                  </div>

                  <ul role="listbox" aria-label="Φίλτρο κατηγορίας" className="space-y-2">
                    {categoriesWithCounts.map(({ name, count }) => {
                      const active = category === name;
                      return (
                        <li key={`modal-${name}`}>
                          <button
                            role="option"
                            aria-selected={active}
                            onClick={() => applyCategory(name)}
                            className={[
                              'w-full flex items-center justify-between rounded-xl border px-3.5 py-2.5',
                              'text-sm transition',
                              active
                                ? 'border-orange-600 bg-orange-50 text-orange-700'
                                : 'border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50',
                            ].join(' ')}
                          >
                            <span className="flex items-center gap-3">
                              <span
                                className={[
                                  'inline-flex h-4 w-4 items-center justify-center rounded-full border',
                                  active ? 'border-orange-600' : 'border-neutral-300',
                                ].join(' ')}
                              >
                                <span
                                  className={[
                                    'h-2.5 w-2.5 rounded-full',
                                    active ? 'bg-orange-600' : 'bg-transparent',
                                  ].join(' ')}
                                />
                              </span>
                              <span className="font-medium">{name}</span>
                            </span>

                            <span
                              className={[
                                'inline-flex min-w-[2ch] items-center justify-center rounded-full px-2 py-0.5 text-xs border',
                                active
                                  ? 'border-orange-300 bg-white/70 text-orange-700'
                                  : 'border-neutral-200 bg-neutral-50 text-neutral-600',
                              ].join(' ')}
                            >
                              {count}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="h-3" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
