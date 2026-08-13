"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, PackageCheck, AlertCircle, Edit3, Save, Plus } from "lucide-react";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [editingVariant, setEditingVariant] = React.useState<{ productId: string; variantId: string; stock: number } | null>(null);

  const fetchProducts = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      toast.error("Failed to load products inventory.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSaveStock = async () => {
    if (!editingVariant) return;
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingVariant),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Variant stock updated!");
        setEditingVariant(null);
        fetchProducts();
      } else {
        toast.error(data.error || "Failed to update stock.");
      }
    } catch (err) {
      toast.error("Server error while updating stock.");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.productCode.toLowerCase().includes(search.toLowerCase()) ||
    p.subcategory.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight uppercase">
            Inventory & Dress Manager
          </h1>
          <p className="text-xs sm:text-sm text-white/50 font-ui mt-1">
            Manage catalog stock levels, sizes, color swatches, and combo package eligibility.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="h-10 px-5 rounded-2xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 hover:scale-105 transition-all cursor-pointer w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <input
          type="text"
          placeholder="Search by Dress Name, SKU, or Category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-10 pr-4 bg-[#161618] border border-white/10 rounded-2xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div key={product.id} className="rounded-3xl border border-white/10 bg-[#161618] p-5 space-y-4 shadow-xl">
            <div className="flex gap-4">
              <div className="h-20 w-16 rounded-2xl bg-slate-800 overflow-hidden relative shrink-0">
                <img
                  src={product.media[0]?.url}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  {product.subcategory} · {product.gender.toUpperCase()}
                </span>
                <h3 className="font-heading font-bold text-sm text-white truncate">{product.name}</h3>
                <p className="text-[10px] text-white/40 font-mono">SKU: {product.productCode}</p>
                <div className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20 mt-1">
                  Flat ₹999 Combo Eligible
                </div>
              </div>
            </div>

            {/* Variants Stock Table */}
            <div className="border-t border-white/10 pt-3 space-y-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">
                Color & Size Variants ({product.variants.length} SKU)
              </span>
              <div className="grid gap-1.5 max-h-36 overflow-y-auto pr-1">
                {product.variants.map((v: any) => {
                  const isEditing = editingVariant?.productId === product.id && editingVariant?.variantId === v.id;

                  return (
                    <div key={v.id} className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: v.color.hex }} />
                        <span className="font-bold text-white">{v.size}</span>
                        <span className="text-[10px] text-white/50">({v.color.name})</span>
                      </div>

                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editingVariant?.stock ?? 0}
                            onChange={(e) => {
                              if (editingVariant) {
                                setEditingVariant({
                                  productId: editingVariant.productId,
                                  variantId: editingVariant.variantId,
                                  stock: parseInt(e.target.value) || 0,
                                });
                              }
                            }}
                            className="w-14 h-7 bg-white/10 border border-amber-400 rounded-lg text-center font-bold text-white text-xs focus:outline-none"
                          />
                          <button
                            onClick={handleSaveStock}
                            className="h-7 w-7 rounded-lg bg-amber-400 text-slate-950 font-bold flex items-center justify-center cursor-pointer"
                          >
                            <Save className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingVariant({ productId: product.id, variantId: v.id, stock: v.stock })}
                          className="flex items-center gap-1.5 text-white/80 hover:text-amber-400 font-medium cursor-pointer"
                        >
                          <span className="font-bold tabular-nums">{v.stock} in stock</span>
                          <Edit3 className="h-3 w-3 text-white/40" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
