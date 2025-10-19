'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu as MenuIcon,
  X as XIcon,
  Home,
  BookOpenText,
  Wifi,
  Star,
} from 'lucide-react';

function NavLink({ href, label, Icon, onClick, className = "", active = false }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm transition",
        active
          ? "border border-orange-600 bg-orange-600 text-white shadow-sm"
          : "border border-orange-500 text-orange-700 bg-white hover:bg-orange-50",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        className
      ].join(' ')}
      aria-current={active ? "page" : undefined}
    >
      {Icon && <Icon size={16} />}
      <span>{label}</span>
    </a>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [path, setPath] = useState('/'); // <-- fixed

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPath(window.location.pathname || '/');
      const onScroll = () => setScrolled(window.scrollY > 6);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }
  }, []);

  const headerClasses = [
    "sticky top-0 z-40 border-b bg-white transition-all",
    scrolled ? "border-neutral-200/90 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/90" : "border-transparent",
  ].join(" ");

  return (
    <>
      {/* Top bar */}
      <motion.header
        initial={{ y: -14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className={headerClasses}
      >
        <div className={["mx-auto max-w-6xl px-4 flex items-center justify-between gap-3", scrolled ? "py-2.5" : "py-3 sm:py-4"].join(" ")}>
          {/* Brand */}
          <a href="/" className="group flex items-center gap-3">
            <img
              src="/crepes-de-france-no-background.png"
              alt="Crepes de France"
              className="h-10 w-10 rounded-2xl object-cover ring-1 ring-orange-200/60"
              loading="lazy"
            />
            <div className="leading-tight">
              <div className="text-base sm:text-lg font-semibold text-neutral-900">
                Crepes de France
              </div>
              <div className="hidden sm:block text-xs text-neutral-500 group-hover:text-neutral-600 transition">
                Νέα Φιλαδέλφια
              </div>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-2">
            <NavLink href="/"       label="Αρχική"         Icon={Home}        active={path === '/'} />
            <NavLink href="/menu"   label="Μενού"          Icon={BookOpenText} active={path.startsWith('/menu')} />
            <NavLink href="/wifi"   label="Wi-Fi"          Icon={Wifi}         active={path.startsWith('/wifi')} />
            <NavLink href="/review" label="Αφήστε Κριτική" Icon={Star}         active={path.startsWith('/review')} />
          </nav>

          {/* Mobile hamburger */}
          <button
            aria-label="Άνοιγμα μενού"
            className="sm:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-orange-500 text-orange-600 bg-white hover:bg-orange-50 transition"
            onClick={() => setOpen(true)}
          >
            <MenuIcon size={18} />
          </button>
        </div>
      </motion.header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              key="backdrop"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-md"
            />
            {/* Panel */}
            <motion.aside
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 z-[70] h-full w-[86%] max-w-sm bg-white border-l border-neutral-200 shadow-xl flex flex-col"
            >
              {/* Panel header with logo */}
              <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <img
                    src="/crepes-de-france-no-background.png"
                    alt="Crepes de France logo"
                    className="h-9 w-9 rounded-lg object-cover ring-1 ring-orange-200/60"
                    loading="lazy"
                  />
                  <div className="leading-tight">
                    <div className="font-semibold text-neutral-900">Crepes de France</div>
                  </div>
                </div>
                <button
                  aria-label="Κλείσιμο"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-orange-500 text-orange-600 bg-white hover:bg-orange-50 transition"
                  onClick={() => setOpen(false)}
                >
                  <XIcon size={18} />
                </button>
              </div>

              {/* Links */}
              <div className="p-4 grid gap-3 bg-white">
                <NavLink href="/"       label="Αρχική"         Icon={Home}         onClick={() => setOpen(false)} className="w-full justify-start" active={path === '/'} />
                <NavLink href="/menu"   label="Μενού"          Icon={BookOpenText} onClick={() => setOpen(false)} className="w-full justify-start" active={path.startsWith('/menu')} />
                <NavLink href="/wifi"   label="Wi-Fi"          Icon={Wifi}         onClick={() => setOpen(false)} className="w-full justify-start" active={path.startsWith('/wifi')} />
                <NavLink href="/review" label="Αφήστε Κριτική" Icon={Star}         onClick={() => setOpen(false)} className="w-full justify-start" active={path.startsWith('/review')} />
              </div>

              {/* Drawer footer */}
              <div className="mt-auto p-4 text-xs text-neutral-500 border-top border-neutral-200 bg-white">
                © {new Date().getFullYear()} Crepes de France
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
