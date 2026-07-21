import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Noto_Sans_JP, Noto_Serif_JP, Shippori_Mincho } from "next/font/google";
import { Providers } from "./providers";
import { LoadingWrapper } from "@/components/LoadingWrapper";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori-mincho",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kurotsuki-Kai | 黒月会",
  description: "The Moon Watches. The Dragon Protects.",
  icons: {
    icon: "/icon.png",
    apple: "/logo_kurot.png",
  },
  openGraph: {
    title: "Kurotsuki-Kai | 黒月会",
    description: "The Moon Watches. The Dragon Protects.",
    images: ["/logo_kurot.png"],
    type: "website",
  },
};

export const viewport = {
  themeColor: "#090909",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${notoSansJP.variable} ${notoSerifJP.variable} ${shipporiMincho.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg-primary font-sans text-white-soft">
        <Providers>
          <LoadingWrapper>{children}</LoadingWrapper>
        </Providers>
      </body>
    </html>
  );
}
