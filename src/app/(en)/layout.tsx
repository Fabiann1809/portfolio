import type { Metadata } from "next";
import { RootDocument } from "@/components/layout/RootDocument";
import { siteMetadata } from "@/data/locale";

export const metadata: Metadata = siteMetadata.en;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
