"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Trash2,
  Edit3,
  Upload,
  Download,
  Save,
  X,
  Package,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";

// ─── Combo Tiers Config ───────────────────────────────────────────────────────
const COMBO_TIERS = [
  { id: "all", label: "All Products", picks: null, color: "bg-slate-600" },
  { id: "combo-10", label: "Combo 10", picks: 10, color: "bg-violet-600" },
  { id: "combo-8", label: "Combo 8", picks: 8, color: "bg-blue-600" },
  { id: "combo-5", label: "Combo 5", picks: 5, color: "bg-emerald-600" },
  { id: "combo-3", label: "Combo 3", picks: 3, color: "bg-amber-500" },
  { id: "combo-2", label: "Combo 2", picks: 2, color: "bg-rose-600" },
];

const TIER_BADGE: Record<string, string> = {
  "combo-10": "bg-violet-500/20 text-violet-300 border-violet-500/30",
  "combo-8": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "combo-5": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "combo-3": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "combo-2": "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

// ─── CSV Parser ───────────────────────────────────────────────────────────────
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ?? "";
    });
    return row;
  });
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({
  productName,
  onConfirm,
  onCancel,
}: {
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="h-14 w-14 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-5">
          <Trash2 className="h-6 w-6 text-rose-400" />
        </div>
        <h3 className="font-bold text-white text-lg mb-2">Delete Product?</h3>
        <p className="text-white/50 text-sm mb-6 leading-relaxed">
          <span className="text-white font-semibold">{productName}</span> and all its size/color
          variants will be permanently removed. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-11 rounded-2xl border border-white/10 text-white/70 text-sm font-semibold hover:bg-white/5 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 rounded-2xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-all cursor-pointer shadow-lg"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CSV Upload Modal ─────────────────────────────────────────────────────────
function BulkUploadModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [file, setFile] = React.useState<File | null>(null);
  const [rows, setRows] = React.useState<Record<string, string>[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [result, setResult] = React.useState<{ created: number; failed: number; errors: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      setRows(parsed);
    };
    reader.readAsText(f);
  };

  const handleUpload = async () => {
    if (rows.length === 0) {
      toast.error("No rows to upload. Please select a valid CSV file.");
      return;
    }
    setUploading(true);
    try {
      const res = await fetch("/api/admin/products/bulk-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const data = await res.json();
      setResult({ created: data.created, failed: data.failed, errors: data.errors ?? [] });
      if (data.created > 0) {
        toast.success(`${data.created} product(s) uploaded successfully!`);
        onDone();
      }
      if (data.failed > 0) {
        toast.error(`${data.failed} product(s) failed. Check errors below.`);
      }
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-400/10 flex items-center justify-center">
              <FileSpreadsheet className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Bulk Upload Products</h3>
              <p className="text-white/40 text-xs">Upload a CSV file to add multiple products at once</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Download Template */}
        <a
          href="/api/admin/products/bulk-upload"
          download="999store-products-template.csv"
          className="flex items-center gap-2 h-10 px-4 rounded-xl border border-white/10 text-white/60 text-xs hover:text-white hover:border-white/30 transition-all w-fit mb-5 cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          Download CSV Template
        </a>

        {/* CSV Format Info */}
        <div className="bg-white/5 rounded-2xl p-4 mb-5 text-xs font-mono text-white/50 leading-relaxed overflow-x-auto">
          <p className="text-amber-400 font-sans font-bold mb-1 not-italic">CSV Column Format:</p>
          name, subcategory, gender, imageUrl, fabric, fit, <span className="text-emerald-400">comboTiers</span>, colorName, colorHex, size, stock
          <br />
          <span className="text-white/30 text-[10px]">
            comboTiers: pipe-separated e.g. <span className="text-emerald-300">combo-10|combo-5|combo-3</span>
          </span>
          <br />
          <span className="text-white/30 text-[10px]">
            Multiple rows with the same name = multiple color/size variants of the same product
          </span>
        </div>

        {/* File Picker */}
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-white/10 hover:border-amber-400/50 rounded-2xl p-8 text-center transition-all">
            <Upload className="h-8 w-8 text-white/30 mx-auto mb-3" />
            <p className="text-white/50 text-sm">
              {file ? (
                <span className="text-amber-400 font-semibold">{file.name} ({rows.length} rows)</span>
              ) : (
                "Click to select CSV file"
              )}
            </p>
            <p className="text-white/25 text-xs mt-1">.csv files only</p>
          </div>
          <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileChange} />
        </label>

        {/* Preview */}
        {rows.length > 0 && (
          <div className="mt-4 max-h-40 overflow-y-auto rounded-xl border border-white/10">
            <table className="w-full text-xs">
              <thead className="bg-white/5">
                <tr>
                  {Object.keys(rows[0]).slice(0, 7).map((k) => (
                    <th key={k} className="px-3 py-2 text-left text-white/40 font-semibold">{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 8).map((row, i) => (
                  <tr key={i} className="border-t border-white/5">
                    {Object.values(row).slice(0, 7).map((val, j) => (
                      <td key={j} className="px-3 py-2 text-white/60 truncate max-w-[100px]">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-4 rounded-xl bg-white/5 p-4 space-y-2">
            <div className="flex gap-4 text-sm font-semibold">
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> {result.created} Created
              </span>
              {result.failed > 0 && (
                <span className="text-rose-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> {result.failed} Failed
                </span>
              )}
            </div>
            {result.errors.length > 0 && (
              <div className="text-xs text-rose-300 space-y-1 max-h-24 overflow-y-auto">
                {result.errors.map((e, i) => <p key={i}>• {e}</p>)}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-2xl border border-white/10 text-white/70 text-sm font-semibold hover:bg-white/5 transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleUpload}
            disabled={rows.length === 0 || uploading}
            className="flex-1 h-11 rounded-2xl bg-amber-400 text-slate-950 text-sm font-bold hover:bg-amber-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-amber-400/20"
          >
            {uploading ? "Uploading..." : `Upload ${rows.length} Rows`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Inline Stock Editor ──────────────────────────────────────────────────────
function StockCell({
  productId,
  variant,
  onSaved,
}: {
  productId: string;
  variant: any;
  onSaved: () => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [stock, setStock] = React.useState(variant.stock);
  const [saving, setSaving] = React.useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, variantId: variant.id, stock }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Stock updated!");
        setEditing(false);
        onSaved();
      } else {
        toast.error(data.error);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className={`px-2 py-0.5 rounded-lg text-xs font-bold border cursor-pointer transition-all hover:scale-105 ${
          stock === 0
            ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
            : stock < 10
            ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
            : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
        }`}
      >
        {stock}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={stock}
        min={0}
        onChange={(e) => setStock(Number(e.target.value))}
        className="w-16 h-7 rounded-lg bg-white/10 border border-white/20 text-white text-xs px-2 focus:outline-none"
        autoFocus
      />
      <button
        onClick={save}
        disabled={saving}
        className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 flex items-center justify-center cursor-pointer transition-all"
      >
        <Save className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => { setStock(variant.stock); setEditing(false); }}
        className="h-7 w-7 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-all"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Product Row ──────────────────────────────────────────────────────────────
function ProductRow({
  product,
  onDelete,
  onRefresh,
}: {
  product: any;
  onDelete: (id: string, name: string) => void;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const totalStock = product.variants?.reduce((a: number, v: any) => a + v.stock, 0) ?? 0;
  const firstImg =
    product.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&q=60";

  return (
    <>
      <tr className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
        {/* Product Name + Image */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 rounded-xl overflow-hidden shrink-0 bg-white/10 border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={firstImg} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate max-w-[200px]">{product.name}</p>
              <p className="text-white/40 text-xs">{product.productCode} · {product.subcategory}</p>
            </div>
          </div>
        </td>

        {/* Combo Tiers */}
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {(product.comboTierIds ?? []).map((tid: string) => (
              <span
                key={tid}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${TIER_BADGE[tid] ?? "bg-white/10 text-white/50 border-white/10"}`}
              >
                {tid.replace("combo-", "")} Picks
              </span>
            ))}
          </div>
        </td>

        {/* Gender */}
        <td className="px-4 py-3">
          <span className="text-white/50 text-xs capitalize">{product.gender}</span>
        </td>

        {/* Total Stock */}
        <td className="px-4 py-3">
          <span
            className={`text-sm font-bold ${
              totalStock === 0 ? "text-rose-400" : totalStock < 20 ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {totalStock}
          </span>
          <span className="text-white/30 text-xs ml-1">units</span>
        </td>

        {/* Variants count */}
        <td className="px-4 py-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            {product.variants?.length ?? 0} variants
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="h-8 w-8 rounded-xl bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 flex items-center justify-center transition-all cursor-pointer"
              title="Edit product"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={() => onDelete(product.id, product.name)}
              className="h-8 w-8 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 flex items-center justify-center transition-all cursor-pointer"
              title="Delete product"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded Variants */}
      {expanded && (
        <tr className="border-b border-white/5 bg-white/[0.02]">
          <td colSpan={6} className="px-4 pb-4 pt-2">
            <div className="flex flex-wrap gap-2">
              {product.variants?.map((v: any) => (
                <div
                  key={v.id}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2"
                >
                  <span
                    className="h-3 w-3 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: v.colorHex ?? v.color?.hex }}
                    title={v.colorName ?? v.color?.name}
                  />
                  <span className="text-white/60 text-xs">{v.colorName ?? v.color?.name}</span>
                  <span className="text-white/30 text-xs">·</span>
                  <span className="text-white/60 text-xs font-mono">{v.size}</span>
                  <span className="text-white/30 text-xs">·</span>
                  <span className="text-white/40 text-xs">Stock:</span>
                  <StockCell productId={product.id} variant={v} onSaved={onRefresh} />
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("all");
  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; name: string } | null>(null);
  const [bulkUploadOpen, setBulkUploadOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const fetchProducts = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch {
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success(`"${deleteTarget.name}" deleted.`);
        setDeleteTarget(null);
        fetchProducts();
      } else {
        toast.error(data.error ?? "Delete failed.");
      }
    } catch {
      toast.error("Server error while deleting.");
    } finally {
      setDeleting(false);
    }
  };

  // Filter by combo + search
  const filteredProducts = products.filter((p) => {
    const matchesCombo =
      activeTab === "all" || (p.comboTierIds ?? []).includes(activeTab);
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.productCode ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.subcategory ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesCombo && matchesSearch;
  });

  const tierCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    for (const tier of COMBO_TIERS.slice(1)) {
      counts[tier.id] = products.filter((p) => (p.comboTierIds ?? []).includes(tier.id)).length;
    }
    return counts;
  }, [products]);

  return (
    <div className="space-y-6 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight uppercase">
            Products & Combo Catalog
          </h1>
          <p className="text-xs sm:text-sm text-white/50 font-ui mt-1">
            {products.length} products across all combos — manage CRUD, stock, colors, and bulk uploads
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setBulkUploadOpen(true)}
            className="h-10 px-4 rounded-2xl border border-white/10 text-white/70 font-bold text-xs flex items-center gap-2 hover:bg-white/5 transition-all cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" />
            Bulk Upload CSV
          </button>
          <button
            onClick={fetchProducts}
            className="h-10 w-10 rounded-2xl border border-white/10 text-white/40 hover:text-white hover:bg-white/5 flex items-center justify-center transition-all cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/admin/products/new"
            className="h-10 px-5 rounded-2xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 hover:scale-105 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Combo Tier Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {COMBO_TIERS.map((tier) => (
          <button
            key={tier.id}
            onClick={() => setActiveTab(tier.id)}
            className={`flex items-center gap-2 h-10 px-4 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer border whitespace-nowrap ${
              activeTab === tier.id
                ? "bg-amber-400 text-slate-950 border-amber-400 shadow-lg shadow-amber-400/20"
                : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                activeTab === tier.id ? "bg-slate-950" : tier.color
              }`}
            />
            {tier.label}
            <span
              className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === tier.id
                  ? "bg-slate-950/20 text-slate-950"
                  : "bg-white/10 text-white/40"
              }`}
            >
              {tierCounts[tier.id] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input
          type="text"
          placeholder="Search by name, code, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-amber-400/30 transition-all"
        />
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-white/10 overflow-hidden bg-white/[0.02]">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="h-8 w-8 text-white/20 animate-spin mx-auto mb-3" />
            <p className="text-white/30 text-sm">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Package className="h-10 w-10 text-white/10 mx-auto" />
            <p className="text-white/30 text-sm font-semibold">
              {activeTab === "all" ? "No products yet." : `No products assigned to ${COMBO_TIERS.find(t=>t.id===activeTab)?.label}.`}
            </p>
            <p className="text-white/20 text-xs">
              Add a product or use Bulk Upload to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-[11px] font-black text-white/40 uppercase tracking-widest">Product</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black text-white/40 uppercase tracking-widest">Combo Tiers</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black text-white/40 uppercase tracking-widest">Gender</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black text-white/40 uppercase tracking-widest">Total Stock</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black text-white/40 uppercase tracking-widest">Variants</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black text-white/40 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onDelete={(id, name) => setDeleteTarget({ id, name })}
                    onRefresh={fetchProducts}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          productName={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Bulk Upload Modal */}
      {bulkUploadOpen && (
        <BulkUploadModal
          onClose={() => setBulkUploadOpen(false)}
          onDone={() => { setBulkUploadOpen(false); fetchProducts(); }}
        />
      )}

      {/* Deleting overlay */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-white text-sm font-semibold bg-slate-900 border border-white/10 rounded-2xl px-6 py-4">
            <RefreshCw className="h-4 w-4 animate-spin text-rose-400" />
            Deleting product...
          </div>
        </div>
      )}
    </div>
  );
}
