import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";
import { siteMetadata } from "@/data/locale";

export const metadata: Metadata = siteMetadata.es;

export default function Home() {
  return <HomePage />;
}
