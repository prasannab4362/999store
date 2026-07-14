"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 space-y-6 font-body">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-extrabold font-heading text-text-primary uppercase tracking-tight">
          SEARCH CATALOG
        </h1>
        <p className="text-xs text-text-secondary">
          Find shirts, Kurtas, pants, cotton-sets, or any specific styles.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 bg-white p-2 rounded-card border border-border-light shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            type="text"
            placeholder="Search for styles, fabric, colors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-10 border-transparent bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
        </div>
        <Button type="submit" size="sm" className="h-10 px-4 cursor-pointer gap-1">
          <span>Search</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="text-center space-y-2">
        <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Suggested searches</span>
        <div className="flex flex-wrap justify-center gap-2">
          {["Shirt", "Kurta", "Cotton Sets", "Chinos", "Green", "Cotton"].map((term) => (
            <button
              key={term}
              onClick={() => router.push(`/products?q=${encodeURIComponent(term)}`)}
              className="text-xs bg-bg-secondary px-3 py-1 rounded-full border border-border-light hover:border-brand-primary text-text-secondary hover:text-brand-primary transition-colors cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
