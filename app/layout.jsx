// app/layout.jsx
import "./globals.css";
import Header from "./components/Header";
import Loading from "./loading";
import { Suspense } from "react";
import BootLoader from "./components/BootLoader";
import ClientUrlNormalizer from "./ClientUrlNormalizer";
import Script from "next/script";

export const metadata = {
  title: "Crepes de France - Νεα Φιλαδέλφια",
  icons: {
    icon: "/crepes_de_france_logo.ico",
    shortcut: "/crepes_de_france_logo.ico",
    apple: "/crepes_de_france_logo.ico",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      nosnippet: true,
      "max-snippet": -1,
      "max-image-preview": "none",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="el">
      <head>
        {/* Extra safety alongside Metadata API */}
        <meta name="robots" content="noindex,nofollow,noarchive,nosnippet" />
        <meta name="googlebot" content="noindex,nofollow,noimageindex,nosnippet" />

        {/* Fix any // in path BEFORE any script runs */}
        <Script id="pre-hydration-slash-normalizer" strategy="beforeInteractive">
          {`
            try {
              var p = location.pathname;
              if (/\\/\\/{2,}/.test(p)) {
                var fixed = p.replace(/\\/\\/{2,}/g, '/');
                history.replaceState(null, '', fixed + location.search + location.hash);
              }
            } catch (e) {
              try { location.replace('/'); } catch (_) {}
            }
          `}
        </Script>
      </head>
      <body>
        {/* Client safety net after hydration */}
        <ClientUrlNormalizer />

        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="mx-auto max-w-6xl w-full px-4 pb-16 pt-6 sm:pt-10">
            <BootLoader minMs={600}>
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </BootLoader>
          </main>
        </div>
      </body>
    </html>
  );
}
