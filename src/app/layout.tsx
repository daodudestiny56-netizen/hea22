import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Browser extensions (Grammarly, ColorZilla, translators) add attributes to
    // <html> and <body> before React loads. This only silences mismatches on
    // these two elements' own attributes, not on anything rendered inside them.
    <html lang="en" suppressHydrationWarning>
      <body className={`${bricolage.variable} ${plexSans.variable} min-h-screen`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
