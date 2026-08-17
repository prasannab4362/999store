"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, Sparkles, Zap, Film } from "lucide-react";
import { toast } from "sonner";
import { MediaUploadSection } from "@/components/admin/media-upload-section";
import { QUICK_SAMPLE_PRODUCTS } from "@/data/admin-sample-media";

export default function AdminNewProductPage() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [subcategory, setSubcategory] = React.useState("Shirts");
  const [gender, setGender] = React.useState<"men" | "women">("men");
  const [imageUrl, setImageUrl] = React.useState("https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80");
  const [videoUrl, setVideoUrl] = React.useState("https://assets.mixkit.co/videos/preview/mixkit-model-posing-in-a-leather-jacket-and-sunglasses-41005-large.mp4");
  const [fabric, setFabric] = React.useState("100% Premium Cotton");
  const [fit, setFit] = React.useState("Regular Fit");
  const [description, setDescription] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [selectedComboTiers, setSelectedComboTiers] = React.useState<string[]>([
    "combo-10",
    "combo-8",
    "combo-5",
    "combo-3",
    "combo-2",
  ]);

  // Default size variants
  const [variants, setVariants] = React.useState([
    { size: "S", colorName: "Black", colorHex: "#000000", stock: 50 },
    { size: "M", colorName: "Black", colorHex: "#000000", stock: 50 },
    { size: "L", colorName: "Black", colorHex: "#000000", stock: 50 },
    { size: "XL", colorName: "Black", colorHex: "#000000", stock: 50 },
  ]);

  const handleToggleComboTier = (tierId: string) => {
    if (selectedComboTiers.includes(tierId)) {
      if (selectedComboTiers.length === 1) {
        toast.error("Product must be assigned to at least one combo package.");
        return;
      }
      setSelectedComboTiers(selectedComboTiers.filter((t) => t !== tierId));
    } else {
      setSelectedComboTiers([...selectedComboTiers, tierId]);
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, { size: "L", colorName: "Navy", colorHex: "#1E3A8A", stock: 50 }]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Quick fill sample preset
  const handleApplyQuickPreset = (preset: (typeof QUICK_SAMPLE_PRODUCTS)[0]) => {
    setName(preset.name);
    setSubcategory(preset.subcategory);
    setGender(preset.gender);
    setImageUrl(preset.imageUrl);
    setVideoUrl(preset.videoUrl);
    setFabric(preset.fabric);
    setFit(preset.fit);
    setDescription(preset.description);
    setVariants(preset.variants);
    toast.success(`⚡ Loaded preset: "${preset.name}" with sample image and video!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imageUrl) {
      toast.error("Please enter a product title and image URL.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          subcategory,
          gender,
          imageUrl,
          videoUrl,
          fabric,
          fit,
          description,
          comboTierIds: selectedComboTiers,
          variants,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("New product with image & video added successfully!");
        router.push("/admin/products");
      } else {
        toast.error(data.error || "Failed to create product.");
      }
    } catch (err) {
      toast.error("Server error while adding product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-body">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="text-xs font-bold text-white/60 hover:text-white flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Inventory</span>
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight uppercase flex items-center gap-2">
          <span>Add New Dress Product</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 normal-case font-body font-bold">
            Image & Video Upload Ready
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-white/50 font-ui">
          Create a new style for the flat ₹999 combo catalog with customizable image, video reels, and size/color swatches.
        </p>
      </div>

      {/* Quick Fill Sample Data Bar */}
      <div className="rounded-3xl border border-amber-400/20 bg-amber-400/[0.03] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Zap className="h-4 w-4 fill-amber-400" />
            <span>1-Click Sample Product Presets (With Image & Video)</span>
          </div>
          <span className="text-[11px] text-white/40 font-ui hidden sm:inline">
            Instant sample population for quick testing
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {QUICK_SAMPLE_PRODUCTS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyQuickPreset(preset)}
              className="text-left p-3 rounded-2xl bg-white/5 hover:bg-amber-400/10 border border-white/10 hover:border-amber-400/40 transition-all cursor-pointer group"
            >
              <p className="text-white group-hover:text-amber-300 text-xs font-bold truncate">
                {preset.name}
              </p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-white/40">
                <span className="capitalize">{preset.gender}</span>
                <span>•</span>
                <span>{preset.subcategory}</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-0.5">
                  <Film className="h-2.5 w-2.5" /> Video Included
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Media Upload & Sample Picker Section */}
        <MediaUploadSection
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          preferredCategory={subcategory}
          preferredGender={gender}
        />

        {/* Product Details Card */}
        <div className="rounded-3xl border border-white/10 bg-[#161618] p-6 sm:p-8 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
            Product Specifications
          </h3>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Title */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">Product Title</label>
              <input
                type="text"
                placeholder="e.g. Royal Oxford Cotton Slim Fit Shirt"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400 transition-colors"
                required
              />
            </div>

            {/* Subcategory */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">Category</label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full h-11 px-4 bg-[#161618] border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Shirts">Shirts</option>
                <option value="T-Shirts">T-Shirts</option>
                <option value="Chudidar Sets">Chudidar Sets</option>
                <option value="Tops">Tops</option>
                <option value="Pants">Pants</option>
                <option value="Lowers">Lowers</option>
              </select>
            </div>

            {/* Collection Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">Collection / Gender</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender("men")}
                  className={`h-11 rounded-2xl font-bold text-xs cursor-pointer border transition-all ${gender === "men" ? "bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/20" : "bg-white/5 text-white border-white/10"}`}
                >
                  Men's
                </button>
                <button
                  type="button"
                  onClick={() => setGender("women")}
                  className={`h-11 rounded-2xl font-bold text-xs cursor-pointer border transition-all ${gender === "women" ? "bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/20" : "bg-white/5 text-white border-white/10"}`}
                >
                  Women's
                </button>
              </div>
            </div>

            {/* Fabric & Fit */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">Fabric Material</label>
              <input
                type="text"
                placeholder="e.g. 100% Breathable Cotton"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">Fit Type</label>
              <input
                type="text"
                placeholder="e.g. Regular Fit / Slim Fit / Oversized"
                value={fit}
                onChange={(e) => setFit(e.target.value)}
                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Eligible Combo Package Tiers */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">Assigned Combo Package Tiers</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: "combo-10", label: "10 Picks" },
                  { id: "combo-8", label: "8 Picks" },
                  { id: "combo-5", label: "5 Picks" },
                  { id: "combo-3", label: "3 Picks" },
                  { id: "combo-2", label: "2 Picks" },
                ].map((tier) => {
                  const isSelected = selectedComboTiers.includes(tier.id);
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => handleToggleComboTier(tier.id)}
                      className={`h-11 rounded-2xl font-bold text-xs cursor-pointer border transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? "bg-amber-400/20 text-amber-300 border-amber-400"
                          : "bg-white/5 text-white/40 border-white/10 hover:text-white"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${isSelected ? "bg-amber-400" : "bg-white/20"}`} />
                      <span>{tier.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">Product Description</label>
              <textarea
                rows={3}
                placeholder="Describe fabric texture, fit, and style..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Variants Section */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider">Size & Color Variants</label>
              <button
                type="button"
                onClick={handleAddVariant}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Variant</span>
              </button>
            </div>

            <div className="space-y-2">
              {variants.map((v, i) => (
                <div key={i} className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <select
                    value={v.size}
                    onChange={(e) => {
                      const next = [...variants];
                      next[i].size = e.target.value;
                      setVariants(next);
                    }}
                    className="h-9 px-3 bg-[#161618] border border-white/10 rounded-xl text-xs text-white"
                  >
                    <option value="XS">Size XS</option>
                    <option value="S">Size S</option>
                    <option value="M">Size M</option>
                    <option value="L">Size L</option>
                    <option value="XL">Size XL</option>
                    <option value="XXL">Size XXL</option>
                    <option value="3XL">Size 3XL</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Color Name"
                    value={v.colorName}
                    onChange={(e) => {
                      const next = [...variants];
                      next[i].colorName = e.target.value;
                      setVariants(next);
                    }}
                    className="h-9 px-3 w-32 bg-[#161618] border border-white/10 rounded-xl text-xs text-white"
                  />

                  <input
                    type="color"
                    value={v.colorHex}
                    onChange={(e) => {
                      const next = [...variants];
                      next[i].colorHex = e.target.value;
                      setVariants(next);
                    }}
                    className="h-9 w-9 p-1 bg-[#161618] border border-white/10 rounded-xl cursor-pointer"
                  />

                  <input
                    type="number"
                    placeholder="Stock"
                    value={v.stock}
                    onChange={(e) => {
                      const next = [...variants];
                      next[i].stock = parseInt(e.target.value) || 0;
                      setVariants(next);
                    }}
                    className="h-9 w-20 px-3 bg-[#161618] border border-white/10 rounded-xl text-xs text-white text-center font-bold"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(i)}
                    className="h-9 w-9 text-red-400 hover:bg-red-400/10 rounded-xl flex items-center justify-center cursor-pointer ml-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="h-12 px-8 rounded-2xl bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-400/20 hover:scale-105 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? "Saving to Database..." : "Save Product with Media"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
