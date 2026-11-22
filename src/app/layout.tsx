import { RootDocument } from "@/components/layout/RootDocument";

/** One root layout for both languages, so switching ES/EN is a client-side navigation (no reload). */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return <RootDocument>{children}</RootDocument>;
}
