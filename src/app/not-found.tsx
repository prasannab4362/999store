"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/commerce/brand-logo";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-bg-primary font-body">
      {/* Header */}
      <header className="border-b border-border-light py-4 px-6 flex justify-center sm:justify-start">
        <BrandLogo size="sm" />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6 max-w-md mx-auto">
        <div className="text-8xl font-black font-heading text-brand-primary tracking-widest animate-pulse">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold font-heading text-text-primary uppercase tracking-tight">
            Style Not Found
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            The page or styling details you are looking for may have moved, expired, or are currently out of stock in our regional warehouse.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Button size="lg" className="flex-grow cursor-pointer" onClick={() => router.push("/")}>
            Go Home
          </Button>
          <Button size="lg" variant="outline" className="flex-grow cursor-pointer" onClick={() => router.push("/products")}>
            Shop Catalog
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-light py-4 px-6 text-center text-xs text-text-muted">
        &copy; {new Date().getFullYear()} 999 Combo Store. All rights reserved.
      </footer>
    </div>
  );
}
