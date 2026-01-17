import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Londrina_Outline, Londrina_Solid, Nunito, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { cn } from "@/lib/utils";


const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const londrina = Londrina_Outline({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-londrina",
});

const londrinaSolid = Londrina_Solid({
  weight: ["100", "300", "400", "900"],
  subsets: ["latin"],
  variable: "--font-londrina-solid",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const clash = localFont({
  src: [
    {
      path: "../../public/fonts/ClashDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-clash",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bigxbang.studio"),
  title: {
    default: "BigxBang Studio — Expérience Web, Solutions Techniques & Stratégie",
    template: "%s | BigxBang Studio"
  },
  description: "Studio de création digitale spécialisé en expériences web immersives, architectures de systèmes et stratégie de marque. Nous transformons votre expertise en arsenal digital.",
  keywords: [
    "développement web sur-mesure",
    "automatisation de processus",
    "stratégie de marque",
    "design immersif",
    "Next.js",
    "branding premium",
    "BigxBang Studio"
  ],
  authors: [{ name: "Thomas Sarazin", url: "https://bigxbang.studio" }],
  creator: "Thomas Sarazin",
  openGraph: {
    title: "BigxBang Studio — Le Web n'est plus du papier.",
    description: "Studio spécialisé en expériences web immersives, solutions techniques sur-mesure et stratégie de marque. Oubliez les vitrines statiques.",
    url: "https://bigxbang.studio",
    siteName: "BigxBang Studio",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BigxBang Studio",
    description: "Expérience Web, Solutions Techniques & Stratégie.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import ClientLayout from "@/components/layout/ClientLayout";
import { ViewTransitions } from "next-view-transitions";
import Navbar from "@/components/layout/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="fr" suppressHydrationWarning>
        <body className={cn(jakarta.variable, clash.variable, londrina.variable, londrinaSolid.variable, nunito.variable, space.variable, "antialiased font-sans bg-black text-white")}>
          <ClientLayout>
            <Navbar />
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </ClientLayout>
        </body>
      </html>
    </ViewTransitions>
  );
}
