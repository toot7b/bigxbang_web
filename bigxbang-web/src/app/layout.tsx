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
  title: "BigXBang Studio",
  description: "Automatisations et solutions logicielles sur mesure.",
};

import ClientLayout from "@/components/layout/ClientLayout";
import { ViewTransitions } from "next-view-transitions";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="fr">
        <body className={cn(jakarta.variable, clash.variable, londrina.variable, londrinaSolid.variable, nunito.variable, space.variable, "antialiased font-sans bg-black text-white")}>
          <ClientLayout>
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </ClientLayout>
        </body>
      </html>
    </ViewTransitions>
  );
}
