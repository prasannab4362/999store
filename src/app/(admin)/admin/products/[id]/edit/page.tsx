"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  RefreshCw,
  Package,
  Palette,
  Layers,
  Tag,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { MediaUploadSection } from "@/components/admin/media-upload-section";

const COMBO_TIERS = [
  { id: "combo-10", label: "10 Picks", color: "bg-violet-500" },
  { id: "combo-8", label: "8 Picks", color: "bg-blue-500" },
  { id: "combo-5", label: "5 Picks", color: "bg-emerald-500" },
  { id: "combo-3", label: "3 Picks", color: "bg-amber-500" },
  { id: "combo-2", label: "2 Picks", color: "bg-rose-500" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "26", "28", "30", "32", "34", "36", "38", "40"];
const GENDER_OPTIONS = ["men", "women", "unisex"];

// ─── Field Input ──────────────────────────────────────────────────────────────
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-white/60 uppercase tracking-wider block">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full h-11 px-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-amber-400/30 transition-all";

// ─── Add Variant Row ──────────────────────────────────────────────────────────
function AddVariantRow({ productId, onAdded }: { productId: string; onAdded: () => void }) {
  const [colorName, setColorName] = React.useState("Black");
  const [colorHex, setColorHex] = React.useState("#000000");
  const [size, setSize] = React.useState("M");
  const [stock, setStock] = React.useState(50);
  const [saving, setSaving] = React.useState(false);

  const handleAdd = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colorName, colorHex, size, stock }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Variant added!");
        setColorName("Black");
        setColorHex("#000000");
        setSize("M");
        setStock(50);
        onAdded();
      } else {
        toast.error(data.error ?? "Failed to add variant.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-400/5 border border-amber-400/20 flex-wrap">
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={colorHex}
          onChange={(e) => setColorHex(e.target.value)}
          className="h-9 w-9 rounded-xl cursor-pointer border border-white/10 bg-transparent"
          title="Color Hex"
        />
        <input
          type="text"
          value={colorName}
          onChange={(e) => setColorName(e.target.value)}
          placeholder="Color name"
          className="h-9 w-28 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-400/30"
        />
      </div>
      <select
        value={size}
        onChange={(e) => setSize(e.target.value)}
        className="h-9 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none cursor-pointer"
      >
        {SIZES.map((s) => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
      </select>
      <div className="flex items-center gap-1">
        <span className="text-white/40 text-xs">Stock:</span>
        <input
          type="number"
          value={stock}
          min={0}
          onChange={(e) => setStock(Number(e.target.value))}
          className="h-9 w-20 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
        />
      </div>
      <button
        onClick={handleAdd}
        disabled={saving || !colorName}
        className="h-9 px-4 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
      >
        <Plus className="h-3.5 w-3.5" />
        {saving ? "Adding..." : "Add Variant"}
      </button>
    </div>
  );
}

// ─── Existing Variant Row ────────────────────────────────────────────────────
function VariantRow({
  productId,
  variant,
  onDeleted,
  onStockUpdated,
}: {
  productId: string;
  variant: any;
  onDeleted: () => void;
  onStockUpdated: (variantId: string, stock: number) => void;
}) {
  const [stock, setStock] = React.useState(variant.stock);
  const [editingStock, setEditingStock] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const saveStock = async () => {
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
        setEditingStock(false);
        onStockUpdated(variant.id, stock);
      } else {
        toast.error(data.error);
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteVariant = async () => {
    if (!confirm("Delete this variant?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/variants?variantId=${variant.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Variant removed.");
        onDeleted();
      } else {
        toast.error(data.error);
      }
    } finally {
      setDeleting(false);
    }
  };

  const colorName = variant.colorName ?? variant.color?.name ?? "Unknown";
  const colorHex = variant.colorHex ?? variant.color?.hex ?? "#888888";

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] group">
      <span
        className="h-5 w-5 rounded-full border border-white/20 shrink-0"
        style={{ backgroundColor: colorHex }}
        title={colorName}
      />
      <span className="text-white/80 text-sm font-medium w-24 truncate">{colorName}</span>
      <span className="text-white/40 text-xs font-mono w-12">{variant.size}</span>
      <span className="text-white/30 text-xs">·</span>
      <span className="text-white/40 text-xs">SKU:</span>
      <span className="text-white/30 text-[10px] font-mono truncate max-w-[120px]">{variant.sku}</span>

      <div className="ml-auto flex items-center gap-2">
        {/* Stock */}
        {editingStock ? (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={stock}
              min={0}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-20 h-8 rounded-xl bg-white/10 border border-white/20 text-white text-xs px-3 focus:outline-none"
              autoFocus
            />
            <button
              onClick={saveStock}
              disabled={saving}
              className="h-8 px-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/30 cursor-pointer transition-all"
            >
              {saving ? "..." : "Save"}
            </button>
            <button
              onClick={() => { setStock(variant.stock); setEditingStock(false); }}
              className="h-8 w-8 rounded-xl bg-white/5 text-white/30 hover:bg-white/10 flex items-center justify-center cursor-pointer"
            >
              <span className="text-xs">✕</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingStock(true)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer hover:scale-105 transition-all ${
              stock === 0
                ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                : stock < 10
                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
            }`}
          >
            {stock} units
          </button>
        )}

        {/* Delete */}
        <button
          onClick={deleteVariant}
          disabled={deleting}
          className="h-8 w-8 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover:opacity-100"
          title="Remove variant"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Edit Page ───────────────────────────────────────────────────────────
export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params.id;

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [product, setProduct] = React.useState<any>(null);

  // Form state
  const [name, setName] = React.useState("");
  const [subcategory, setSubcategory] = React.useState("");
  const [gender, setGender] = React.useState("unisex");
  const [imageUrl, setImageUrl] = React.useState("");
  const [videoUrl, setVideoUrl] = React.useState("");
  const [fabric, setFabric] = React.useState("");
  const [fit, setFit] = React.useState("");
  const [pattern, setPattern] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [comboTierIds, setComboTierIds] = React.useState<string[]>([]);
  const [newArrival, setNewArrival] = React.useState(false);
  const [trending, setTrending] = React.useState(false);

  const fetchProduct = React.useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`);
      const data = await res.json();
      if (data.success) {
        const p = data.product;
        setProduct(p);
        setName(p.name ?? "");
        setSubcategory(p.subcategory ?? "");
        setGender(p.gender ?? "unisex");
        setFabric(p.fabric ?? "");
        setFit(p.fit ?? "");
        setPattern(p.pattern ?? "");
        setDescription(p.description ?? "");
        setComboTierIds(p.comboTierIds ?? []);
        setNewArrival(p.newArrival ?? false);
        setTrending(p.trending ?? false);

        // Find image & video
        const frontMedia = p.media?.find((m: any) => m.viewType === "front")?.url || p.imageUrl || "";
        const vidMedia = p.media?.find((m: any) => m.viewType === "video")?.url || p.videoUrl || "";
        setImageUrl(frontMedia);
        setVideoUrl(vidMedia);
      } else {
        toast.error("Product not found.");
        router.push("/admin/products");
      }
    } catch {
      toast.error("Failed to load product.");
    } finally {
      setLoading(false);
    }
  }, [productId, router]);

  React.useEffect(() => { fetchProduct(); }, [fetchProduct]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Product name is required.");
      return;
    }
    if (comboTierIds.length === 0) {
      toast.error("Assign at least one combo tier.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          subcategory,
          gender,
          imageUrl,
          videoUrl,
          fabric,
          fit,
          pattern,
          description,
          comboTierIds,
          newArrival,
          trending,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Product updated successfully!");
        router.push("/admin/products");
      } else {
        toast.error(data.error ?? "Update failed.");
      }
    } catch {
      toast.error("Server error.");
    } finally {
      setSaving(false);
    }
  };

  const toggleTier = (tierId: string) => {
    if (comboTierIds.includes(tierId)) {
      if (comboTierIds.length === 1) {
        toast.error("Must assign to at least one combo.");
        return;
      }
      setComboTierIds(comboTierIds.filter((t) => t !== tierId));
    } else {
      setComboTierIds([...comboTierIds, tierId]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <RefreshCw className="h-8 w-8 text-white/20 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24 space-y-4">
        <AlertCircle className="h-10 w-10 text-rose-400 mx-auto" />
        <p className="text-white/50 text-sm">Product not found.</p>
        <Link href="/admin/products" className="text-amber-400 text-sm hover:underline">
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-body max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="h-10 w-10 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 flex items-center justify-center transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black font-heading text-white tracking-tight uppercase">Edit Product</h1>
          <p className="text-xs text-white/40 mt-0.5 font-mono">{product.productCode}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="ml-auto h-10 px-6 rounded-2xl bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 hover:bg-amber-300 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-amber-400/20"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Media Upload & Sample Picker Section */}
      <MediaUploadSection
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
        preferredCategory={subcategory}
        preferredGender={gender as any}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ── Left Column: Product Details ── */}
        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
              <Tag className="h-3.5 w-3.5" /> Product Details
            </div>

            <Field label="Product Name">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="e.g. Slim Cargo Pants" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Subcategory">
                <input type="text" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className={inputCls} placeholder="Shirts, Tops..." />
              </Field>
              <Field label="Gender">
                <select value={gender} onChange={(e) => setGender(e.target.value)} className={inputCls + " cursor-pointer"}>
                  {GENDER_OPTIONS.map((g) => <option key={g} value={g} className="bg-slate-900 capitalize">{g}</option>)}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Fabric">
                <input type="text" value={fabric} onChange={(e) => setFabric(e.target.value)} className={inputCls} placeholder="100% Cotton" />
              </Field>
              <Field label="Fit">
                <input type="text" value={fit} onChange={(e) => setFit(e.target.value)} className={inputCls} placeholder="Regular Fit" />
              </Field>
            </div>

            <Field label="Pattern">
              <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} className={inputCls} placeholder="Solid, Striped..." />
            </Field>

            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputCls + " h-24 resize-none pt-3"}
                placeholder="Product description..."
              />
            </Field>

            {/* Flags */}
            <div className="flex gap-3 flex-wrap pt-1">
              {[
                { key: "newArrival", label: "New Arrival", value: newArrival, set: setNewArrival },
                { key: "trending", label: "Trending", value: trending, set: setTrending },
              ].map((flag) => (
                <button
                  key={flag.key}
                  type="button"
                  onClick={() => flag.set(!flag.value)}
                  className={`h-9 px-4 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    flag.value
                      ? "bg-amber-400/20 text-amber-300 border-amber-400"
                      : "bg-white/5 text-white/40 border-white/10 hover:text-white"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${flag.value ? "bg-amber-400" : "bg-white/20"}`} />
                  {flag.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Combo Tier Assignment ── */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
              <Layers className="h-3.5 w-3.5" /> Assigned Combo Packages
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COMBO_TIERS.map((tier) => {
                const selected = comboTierIds.includes(tier.id);
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => toggleTier(tier.id)}
                    className={`h-11 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      selected
                        ? "bg-amber-400/20 text-amber-300 border-amber-400"
                        : "bg-white/5 text-white/40 border-white/10 hover:text-white"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${selected ? "bg-amber-400" : tier.color + "/60"}`} />
                    {tier.label}
                    {selected && <span className="text-[10px] text-amber-400/60">✓</span>}
                  </button>
                );
              })}
            </div>
            <p className="text-white/25 text-[10px]">
              This product will appear ONLY in the combo builders for the selected packages above.
            </p>
          </div>
        </div>

        {/* ── Right Column: Variants ── */}
        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
              <Palette className="h-3.5 w-3.5" /> Size & Color Variants
            </div>

            {/* Existing variants */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {product.variants?.length === 0 ? (
                <div className="py-8 text-center">
                  <Package className="h-6 w-6 text-white/15 mx-auto mb-2" />
                  <p className="text-white/25 text-xs">No variants yet. Add one below.</p>
                </div>
              ) : (
                (product.variants ?? []).map((v: any) => (
                  <VariantRow
                    key={v.id}
                    productId={productId}
                    variant={v}
                    onDeleted={fetchProduct}
                    onStockUpdated={(vid, s) => {
                      setProduct((prev: any) => ({
                        ...prev,
                        variants: prev.variants.map((vv: any) =>
                          vv.id === vid ? { ...vv, stock: s } : vv
                        ),
                      }));
                    }}
                  />
                ))
              )}
            </div>

            {/* Add variant */}
            <div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Add New Variant</p>
              <AddVariantRow productId={productId} onAdded={fetchProduct} />
            </div>
          </div>

          {/* Product Stats */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5">
            <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-3">Quick Stats</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-2xl p-3 text-center">
                <p className="text-2xl font-black text-white">{product.variants?.length ?? 0}</p>
                <p className="text-white/40 text-xs mt-0.5">Variants</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 text-center">
                <p className="text-2xl font-black text-emerald-400">
                  {product.variants?.reduce((a: number, v: any) => a + (v.stock ?? 0), 0) ?? 0}
                </p>
                <p className="text-white/40 text-xs mt-0.5">Total Stock</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 text-center">
                <p className="text-2xl font-black text-amber-400">{comboTierIds.length}</p>
                <p className="text-white/40 text-xs mt-0.5">Combos</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 text-center">
                <p className="text-lg font-black text-white capitalize">{gender}</p>
                <p className="text-white/40 text-xs mt-0.5">Gender</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
