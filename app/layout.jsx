// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Loading from "./loading";
import { Suspense, ReactNode } from "react";
import BootLoader from "./components/BootLoader";
import ClientUrlNormalizer from "./ClientUrlNormalizer"; // client component

export const metadata: Metadata = {
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

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="el">
      <head>
        {/* Extra safety alongside Metadata API */}
        <meta name="robots" content="noindex,nofollow,noarchive,nosnippet" />
        <meta name="googlebot" content="noindex,nofollow,noimageindex,nosnippet" />
      </head>
      <body>
        {/* Normalize any accidental double slashes ASAP on the client */}
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
