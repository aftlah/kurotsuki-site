import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Noto_Serif_JP } from "next/font/google";
import { Providers } from "./providers";
import { LoadingWrapper } from "@/components/LoadingWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${notoSerifJP.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg-primary font-sans text-white-soft">
        <Providers>
          <LoadingWrapper>{children}</LoadingWrapper>
        </Providers>
      </body>
    </html>
  );
}
