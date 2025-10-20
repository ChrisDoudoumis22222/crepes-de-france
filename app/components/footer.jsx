'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFacebook, FaTiktok } from 'react-icons/fa6';

export default function Footer() {
  const [visible, setVisible] = useState(false);

  // Delay footer by 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.footer
          key="footer"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 18 }}
          className="relative mt-12 bg-orange-500 text-white"
        >
          <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            {/* Left side: Logo + name */}
            <motion.a
              href="/"
              whileHover={{ y: -2 }}
              className="flex items-center gap-3"
            >
              <img
                src="/crepes-de-france-no-background.png"
                alt="Crepes de France"
                className="h-10 w-10 rounded-2xl object-cover ring-1 ring-white/40"
                loading="lazy"
              />
              <div className="leading-tight">
                <div className="font-semibold text-lg">Crepes de France</div>
                <div className="text-sm text-orange-100">Νέα Φιλαδέλφια</div>
              </div>
            </motion.a>

            {/* Center: Socials */}
            <div className="flex items-center gap-3">
              <motion.a
                href="https://www.facebook.com/crepesdf94/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-white/70 text-white bg-orange-600 hover:bg-orange-400 transition"
                aria-label="Facebook"
              >
                <FaFacebook size={18} />
              </motion.a>
              <motion.a
                href="https://www.tiktok.com/@crepesdefrance_?lang=en"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-white/70 text-white bg-orange-600 hover:bg-orange-400 transition"
                aria-label="TikTok"
              >
                <FaTiktok size={18} />
              </motion.a>
            </div>

            {/* Right side: credit */}
            <div className="flex flex-col items-center sm:items-end gap-2">
              <div className="text-sm text-orange-100">
                © {new Date().getFullYear()} Crepes de France — All rights reserved.
              </div>
              <motion.a
                href="https://dont-wait-gr.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -1 }}
                className="flex items-center gap-2 text-sm text-white hover:text-orange-100 transition"
              >
                <span>Made by</span>
                <img
                  src="https://i.ibb.co/DPmSsDrN/2025-02-10-203844.png"
                  alt="dontwait.gr logo"
                  className="h-5 w-auto rounded-md"
                  loading="lazy"
                />
              </motion.a>
            </div>
          </div>
        </motion.footer>
      )}
    </AnimatePresence>
  );
}
