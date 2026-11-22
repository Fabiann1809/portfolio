import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";
import { siteMetadata } from "@/data/locale";

export const metadata: Metadata = siteMetadata.en;

export default function Home() {
  return <HomePage />;
}
