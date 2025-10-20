'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';
import { Wifi, Shield, Copy, Check } from 'lucide-react';

const CONFIG = {
  shopName: 'Crepes de France',
  ssid: 'Crepes De France',        // αλλάξτε αν χρειάζεται
  password: '11111111',         // αφήστε κενό για ανοιχτό δίκτυο
  encryption: 'Password', // "nopass", "WPA", ή "WEP"
};

function wifiQRString({ ssid, password, encryption }) {
  if (!ssid) return '';
  const enc = (encryption ?? 'nopass').toUpperCase();
  return enc === 'NOPASS'
    ? `WIFI:T:nopass;S:${ssid};;`
    : `WIFI:T:${enc};S:${ssid};P:${password || ''};;`;
}

export default function WifiPage() {
  const canvasRef = useRef(null);
  const boxRef = useRef(null);            // <-- wrapper used for responsive sizing
  const [copied, setCopied] = useState(null); // 'ssid' | 'pass' | null

  const qrText = useMemo(() => wifiQRString(CONFIG), []);
  const isOpen = (CONFIG.encryption ?? 'nopass').toLowerCase() === 'nopass';

  // Responsive + retina-sharp QR that fits the box
  useEffect(() => {
    if (!qrText || !canvasRef.current || !boxRef.current) return;

    const render = (cssSize) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const px = Math.max(160, Math.round(cssSize)); // clamp min size
      QRCode.toCanvas(
        canvasRef.current,
        qrText,
        {
          width: Math.round(px * dpr),   // render pixels
          margin: 1,
          color: { dark: '#000000', light: '#FFFFFFFF' },
        },
        (err) => err && console.error(err)
      );
      // scale to the CSS size of the container
      canvasRef.current.style.width = `${px}px`;
      canvasRef.current.style.height = `${px}px`;
    };

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width || 220;
      // Leave some padding inside the card; cap the max size
      const target = Math.min(w, 320);
      render(target);
    });

    ro.observe(boxRef.current);
    return () => ro.disconnect();
  }, [qrText]);

  const copy = async (text, key) => {
    try { await navigator.clipboard.writeText(text || ''); } catch {}
    setCopied(key);
    setTimeout(() => setCopied(null), 1200);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 20 } },
  };

  return (
    <section className="relative">
      {/* soft bottom accent */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 h-[260px] sm:h-[320px]
                   bg-[radial-gradient(80%_70%_at_50%_100%,rgba(255,159,64,0.18),transparent)] z-0"
      />

      <div className="relative z-10">
        {/* HERO */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 ring-1 ring-orange-200">
              <Wifi size={20} />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 leading-tight">
                Wi-Fi πρόσβαση
              </h1>
              <p className="text-neutral-600 mt-1">
                Σκανάρετε τον QR για άμεση σύνδεση στο δίκτυο του <strong>{CONFIG.shopName}</strong>.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:gap-7 sm:grid-cols-2">
          {/* Card: QR + info */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="rounded-3xl border border-orange-100 bg-white/90 p-5 sm:p-6 shadow-[0_10px_30px_rgba(255,159,64,0.08)] backdrop-blur supports-[backdrop-filter]:bg-white/80"
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="font-semibold text-neutral-900">Στοιχεία δικτύου</div>
              <span
                className={[
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs border',
                  isOpen
                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200',
                ].join(' ')}
              >
                <Shield size={14} />
                {isOpen ? 'Ανοιχτό δίκτυο' : (CONFIG.encryption || 'WPA')}
              </span>
            </div>

            <div className="grid sm:grid-cols-[1fr_auto] gap-5 sm:gap-6 items-start">
              {/* Left: fields */}
              <div className="space-y-3">
                <Field
                  label="Όνομα δικτύου"
                  value={CONFIG.ssid || '—'}
                  onCopy={() => copy(CONFIG.ssid || '', 'ssid')}
                  copied={copied === 'ssid'}
                />
                <Field
                  label="Κωδικός"
                  value={isOpen ? '(κανένας)' : (CONFIG.password ? '••••••••' : '(κανένας)')}
                  reveal={CONFIG.password && !isOpen ? CONFIG.password : null}
                  onCopy={() => !isOpen && copy(CONFIG.password || '', 'pass')}
                  copied={copied === 'pass'}
                  disabled={isOpen || !CONFIG.password}
                />

                <div className="text-xs text-neutral-500 leading-relaxed">
                  TIP: Αν ο QR δεν λειτουργεί, συνδεθείτε χειροκίνητα από τις ρυθμίσεις Wi-Fi
                  εισάγοντας το όνομα δικτύου και τον κωδικό.
                </div>
              </div>

              {/* Right: QR block (fully responsive inside its box) */}
              <div className="sm:justify-self-end">
                <div
                  ref={boxRef}
                  className="w-full max-w-[320px] sm:max-w-[320px] rounded-2xl border border-orange-100 bg-white p-3 shadow-sm inline-block relative"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/50"></div>
                  <div className="w-full aspect-square grid place-items-center">
                    <canvas
                      ref={canvasRef}
                      className="block w-full h-auto rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card: tips */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">Χρήσιμες συμβουλές</h3>
            <ul className="pl-5 text-sm text-neutral-700 space-y-2">
              <li className="list-disc">Σε iPhone: ανοίξτε την κάμερα και σαρώστε τον κωδικό.</li>
              <li className="list-disc">Σε Android: σαρώστε από την κάμερα ή τον σαρωτή QR στις γρήγορες ρυθμίσεις.</li>
              <li className="list-disc">Αν δεν γίνει σύνδεση αυτόματα, χρησιμοποιήστε το όνομα δικτύου και (αν υπάρχει) τον κωδικό.</li>
              <li className="list-disc">Για βοήθεια, ρωτήστε το προσωπικό μας — με χαρά! 🙂</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, reveal, onCopy, copied, disabled }) {
  const canCopy = !disabled && !!onCopy;
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-3.5 flex items-center justify-between">
      <div className="min-w-0">
        <div className="text-xs text-neutral-500">{label}</div>
        <div className="font-medium text-neutral-900 truncate">
          {reveal ? (
            <span title="Κωδικός">
              {value} <span className="text-neutral-400">/</span>{' '}
              <span className="text-neutral-700">{reveal}</span>
            </span>
          ) : (
            value
          )}
        </div>
      </div>

      <button
        onClick={canCopy ? onCopy : undefined}
        disabled={!canCopy}
        className={[
          'ml-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition shadow-sm',
          canCopy
            ? 'border border-orange-500 text-orange-700 bg-white hover:bg-orange-50'
            : 'border border-neutral-200 text-neutral-400 bg-neutral-50 cursor-not-allowed',
        ].join(' ')}
        aria-label="Αντιγραφή"
        title={canCopy ? 'Αντιγραφή' : 'Μη διαθέσιμο'}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? 'Αντιγράφηκε' : 'Αντιγραφή'}
      </button>
    </div>
  );
}
