import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { LoaderProvider } from "@/components/loader/LoaderProvider";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Preloader } from "@/components/loader/Preloader";
import { LightCursor } from "@/components/cursor/LightCursor";
import { themeInitScript } from "@/lib/themeScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <LoaderProvider>
          <SmoothScroll>
            <Preloader />
            {children}
            <LightCursor />
          </SmoothScroll>
        </LoaderProvider>
      </body>
    </html>
  );
}
