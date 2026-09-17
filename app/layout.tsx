import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/navigation/Navbar";
import { ServiceWorkerRegistrar } from "@/components/shared/ServiceWorkerRegistrar";
import { SiteWatermark } from "@/components/shared/SiteWatermark";

export const metadata: Metadata = {
  title: "WizhMe — One Place. Every Special Moment.",
  description:
    "Create beautiful interactive wishes, invitations and surprises — all from one place.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#B98CFF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegistrar />
        <Navbar />
        <SiteWatermark />
        {children}
      </body>
    </html>
  );
}
