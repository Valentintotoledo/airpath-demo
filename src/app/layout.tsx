import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AirPath — Tu carrera en la aviación, despegada",
    template: "%s · AirPath",
  },
  description:
    "AirPath — el ecosistema de aviación que conecta formación FAA, aeronaves, instructores y escuelas. Una demo de previsualización.",
  applicationName: "AirPath",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050507",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-dvh bg-background text-content antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
