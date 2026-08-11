import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "999 Combo Store | Premium Mix & Match Fashion",
    template: "%s | 999 Combo Store",
  },
  description: "India's first dedicated Mix & Match fashion combo store. Create your customized fashion combo with men's and women's collections, all for a flat ₹999 base price.",
  metadataBase: new URL("https://999combostore.com"),
  keywords: ["fashion combo", "mix and match", "affordable fashion", "999 store", "men fashion", "women fashion", "buy clothing combo online"],
  openGraph: {
    title: "999 Combo Store | Premium Mix & Match Fashion",
    description: "India's first dedicated Mix & Match fashion combo store. Create your customized fashion combo with men's and women's collections, all for a flat ₹999 base price.",
    url: "https://999combostore.com",
    siteName: "999 Combo Store",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "999 Combo Store | Premium Mix & Match Fashion",
    description: "Create your customized fashion combo with men's and women's collections, all for a flat ₹999 base price.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable}`}
    >
      <body className="min-h-full flex flex-col font-body bg-bg-primary text-text-primary">
        <AppProviders>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </AppProviders>
      </body>
    </html>
  );
}

