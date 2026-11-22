import { Barlow_Condensed, Doto, Geist, Geist_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "@/app/globals.css";
import { LoaderProvider } from "@/components/loader/LoaderProvider";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Preloader } from "@/components/loader/Preloader";
import { RetroOverlay } from "@/components/layout/RetroOverlay";
import { LocaleProvider } from "@/components/locale/LocaleProvider";
import { localeOptions } from "@/data/locale";
import { themeInitScript } from "@/lib/themeScript";
import type { Locale } from "@/types";

// Dot-matrix display face (variable, weights 400-900) for names, titles, labels and UI.
const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin", "latin-ext"],
  weight: "variable",
});

// Condensed face for the giant uppercase titles of the home sections.
const condensed = Barlow_Condensed({
  variable: "--font-condensed-face",
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Root document shared by both language layouts; each one passes its own locale. */
export function RootDocument({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const htmlLang = localeOptions.find((option) => option.id === locale)?.htmlLang ?? locale;
  return (
    <html
      lang={htmlLang}
      className={`${doto.variable} ${condensed.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <LocaleProvider locale={locale}>
          <LoaderProvider>
            <SmoothScroll>
              <Preloader />
              {children}
              <RetroOverlay />
            </SmoothScroll>
          </LoaderProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
