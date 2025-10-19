'use client';

import { useMemo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

function euro(v, fallback = '—') {
  if (typeof v !== 'number') return fallback;
  return `${v.toFixed(2)}€`;
}

export default function AddonDrawer({ item, onClose }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mounted, onClose]);

  const groups = useMemo(() => {
    const arr = Array.isArray(item?.addons) ? item.addons : [];
    return arr.map((g, idx) => ({
      key: `g${idx}`,
      title: g?.title || 'Επιλογές',
      required: !!g?.required,
      multi: !!g?.multi_select,
      options: Array.isArray(g?.options) ? g.options : [],
    }));
  }, [item]);

  const groupsWithOptions = useMemo(
    () => groups.filter((g) => g.options && g.options.length > 0),
    [groups]
  );

  const hasAddons = groupsWithOptions.length > 0;
  const hasImage = !!item?.image;
  const description = (item?.description ?? '').toString().trim();

  if (!mounted) return null;

  return createPortal(
    <>
      <AnimatePresence>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-[9998] bg-black/35 backdrop-blur-2xl backdrop-saturate-150
                     before:content-[''] before:absolute before:inset-0
                     before:bg-[radial-gradient(70%_60%_at_50%_50%,rgba(0,0,0,0.18),transparent)]"
        />

        <motion.div
          key="modal"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          onClick={onClose}
          className="fixed inset-0 z-[9999] flex items-center justify-center px-3 sm:px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg sm:max-w-2xl rounded-3xl bg-white/90 shadow-2xl
                       border border-orange-100 backdrop-blur supports-[backdrop-filter]:bg-white/80
                       max-h-[86vh] flex flex-col select-none relative
                       before:absolute before:inset-0 before:rounded-3xl before:pointer-events-none
                       before:ring-1 before:ring-inset before:ring-white/40
                       after:absolute after:inset-[-1px] after:rounded-3xl after:pointer-events-none
                       after:bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,159,64,0.25),rgba(255,255,255,0)_30%,rgba(255,159,64,0.25)_60%,rgba(255,255,255,0)_85%,rgba(255,159,64,0.25))] after:opacity-40"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-orange-100/70 flex items-center justify-between bg-transparent">
              <div className="flex items-center gap-3 sm:gap-4">
                {hasImage && (
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl overflow-hidden bg-orange-50 ring-1 ring-orange-100">
                    <img
                      src={item.image}
                      alt={item.image_alt || item.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="leading-tight">
                  <div className="text-base sm:text-lg font-semibold text-neutral-900">
                    {item?.name}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                      {item?.price_text || euro(item?.price_value)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                aria-label="Κλείσιμο"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl
                           border border-orange-300 text-orange-600 bg-white/80 hover:bg-orange-50 transition shadow-sm"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5 space-y-5 overflow-auto nice-scroll">
              {/* If NO addons, show only the description (the “stuff it has inside”) */}
              {!hasAddons && description && (
                <div className="rounded-2xl border border-orange-100 bg-white/70 p-4 sm:p-5 text-sm leading-6 text-neutral-800">
                  {description}
                </div>
              )}

              {/* If there ARE addons, render the groups */}
              {hasAddons &&
                groupsWithOptions.map((g) => (
                  <section
                    key={g.key}
                    className="rounded-2xl border border-orange-100 bg-white/70 overflow-hidden shadow-sm"
                  >
                    <div className="px-4 sm:px-5 py-3 border-b border-orange-100/80 flex items-center justify-between">
                      <div className="font-medium text-neutral-900">{g.title}</div>
                      <div className="text-xs text-orange-700">
                        {g.required ? 'Υποχρεωτικό' : 'Προαιρετικό'} • {g.multi ? 'Πολλαπλή επιλογή' : 'Μονή επιλογή'}
                      </div>
                    </div>

                    <ul className="divide-y divide-orange-100/70">
                      {g.options.map((opt, oi) => (
                        <li key={oi}>
                          <div className="w-full px-4 sm:px-5 py-3 flex items-center justify-between gap-3 bg-white/80">
                            <span className="truncate text-neutral-900">{opt.name}</span>
                            <span className="text-sm text-orange-700 shrink-0">
                              {opt.price_text || euro(opt.price_value, '0,00€')}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <style jsx global>{`
        .nice-scroll {
          scrollbar-width: thin;
          scrollbar-color: #f97316 #fff7ed;
        }
        .nice-scroll::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .nice-scroll::-webkit-scrollbar-track {
          background: #fff7ed;
          border-radius: 999px;
        }
        .nice-scroll::-webkit-scrollbar-thumb {
          background-image: linear-gradient(180deg, #f97316 0%, #ea580c 100%);
          border-radius: 999px;
          border: 2px solid #fff7ed;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.4) inset;
        }
        .nice-scroll::-webkit-scrollbar-thumb:hover {
          filter: brightness(0.95);
        }
      `}</style>
    </>,
    document.body
  );
}
