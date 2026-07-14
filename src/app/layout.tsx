import type { Metadata } from "next";
import { AppProviders } from "@/providers/app-providers";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "999 Combo Store | Build Your Own Fashion Combo",
    template: "%s | 999 Combo Store",
  },
  description: "Build your own men's, women's or mixed fashion combo. Choose your styles, sizes and available colours.",
  metadataBase: new URL("https://999combostore.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
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
