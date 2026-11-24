import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";
import { siteMetadata, siteUrl } from "@/data/locale";

export const metadata: Metadata = {
  ...siteMetadata.en,
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/en", languages: { es: "/", en: "/en" } },
  openGraph: { ...siteMetadata.en, url: "/en", siteName: "Fabian", locale: "en_US", type: "website" },
};

export default function Home() {
  return <HomePage />;
}
