import type { Metadata, Viewport } from "next";
import { Elms_Sans } from "next/font/google";
import "./globals.css";

const elms = Elms_Sans({
  variable: "--font-elms",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Feels like",
  description: "Weather that knows how you feel",
  appleWebApp: {
    capable: true,
    title: "Feels like",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${elms.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-neutral-900">{children}</body>
    </html>
  );
}
