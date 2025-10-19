'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BookOpenText, Wifi, Star } from 'lucide-react';

const container = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 140, damping: 18 },
  },
};

const gridStagger = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const card = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 18 },
  },
};

export default function Page() {
  return (
    <section className="relative min-h-[60vh]">
      {/* soft background accent pinned to page bottom (from bottom to top) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[260px] sm:h-[340px]
                   bg-[radial-gradient(80%_70%_at_50%_100%,rgba(255,159,64,0.22),transparent)] z-0"
      />

      {/* Content (kept above the gradient) */}
      <div className="relative z-10">
        <AnimatePresence>
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="text-center my-10 sm:my-14"
            >
              {/* icon/logo removed */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
                Καλώς ήρθατε στο Crepes de France
              </h1>
              <p className="text-neutral-600 max-w-2xl mx-auto mt-3">
                Επιλέξτε μια ενότητα — δείτε το μενού, συνδεθείτε στο Wi-Fi ή αφήστε μια κριτική.
              </p>
            </motion.div>

            <motion.div
              variants={gridStagger}
              initial="hidden"
              animate="show"
              className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3 max-w-5xl mx-auto"
            >
              {/* Menu */}
              <motion.a
                variants={card}
                href="/menu"
                className="group rounded-2xl border border-orange-500 bg-white px-5 py-5 sm:py-6 shadow-sm
                           hover:shadow-md transition flex items-center gap-4"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <BookOpenText size={20} />
                </span>
                <div className="text-left">
                  <div className="font-semibold text-neutral-900">Δείτε το Μενού</div>
                  <div className="text-sm text-neutral-600">Κρέπες, καφές και περισσότερα.</div>
                </div>
              </motion.a>

              {/* Wi-Fi */}
              <motion.a
                variants={card}
                href="/wifi"
                className="group rounded-2xl border border-orange-500 bg-white px-5 py-5 sm:py-6 shadow-sm
                           hover:shadow-md transition flex items-center gap-4"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Wifi size={20} />
                </span>
                <div className="text-left">
                  <div className="font-semibold text-neutral-900">Wi-Fi</div>
                  <div className="text-sm text-neutral-600">Σάρωσε QR για άμεση σύνδεση.</div>
                </div>
              </motion.a>

              {/* Review */}
              <motion.a
                variants={card}
                href="/review"
                className="group rounded-2xl border border-orange-500 bg-white px-5 py-5 sm:py-6 shadow-sm
                           hover:shadow-md transition flex items-center gap-4"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Star size={20} />
                </span>
                <div className="text-left">
                  <div className="font-semibold text-neutral-900">Αφήστε Κριτική</div>
                  <div className="text-sm text-neutral-600">Μοιραστείτε την εμπειρία σας.</div>
                </div>
              </motion.a>
            </motion.div>

            {/* subtle bottom spacing */}
            <div className="h-10 sm:h-12" />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
