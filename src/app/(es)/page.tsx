import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";
import { siteMetadata, siteUrl } from "@/data/locale";

export const metadata: Metadata = {
  ...siteMetadata.es,
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/", languages: { es: "/", en: "/en" } },
  openGraph: { ...siteMetadata.es, url: "/", siteName: "Fabian", locale: "es_CO", type: "website" },
};

export default function Home() {
  return <HomePage />;
}
