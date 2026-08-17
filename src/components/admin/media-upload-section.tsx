"use client";

import * as React from "react";
import {
  Image as ImageIcon,
  Video as VideoIcon,
  Upload,
  Sparkles,
  Check,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Shuffle,
  Link2,
  FolderOpen,
} from "lucide-react";
import { SAMPLE_IMAGES, SAMPLE_VIDEOS, SampleMediaItem } from "@/data/admin-sample-media";
import { toast } from "sonner";

interface MediaUploadSectionProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  videoUrl?: string;
  setVideoUrl?: (url: string) => void;
  preferredCategory?: string;
  preferredGender?: "men" | "women" | "unisex";
}

export function MediaUploadSection({
  imageUrl,
  setImageUrl,
  videoUrl = "",
  setVideoUrl,
  preferredCategory,
  preferredGender,
}: MediaUploadSectionProps) {
  const [activeTab, setActiveTab] = React.useState<"image" | "video">("image");
  const [imageSourceMode, setImageSourceMode] = React.useState<"upload" | "sample" | "url">("sample");
  const [videoSourceMode, setVideoSourceMode] = React.useState<"sample" | "upload" | "url">("sample");

  const [selectedCategoryFilter, setSelectedCategoryFilter] = React.useState<string>("All");
  const [imageUploadLoading, setImageUploadLoading] = React.useState(false);
  const [videoUploadLoading, setVideoUploadLoading] = React.useState(false);

  // Video playback preview state
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);

  const imageFileInputRef = React.useRef<HTMLInputElement>(null);
  const videoFileInputRef = React.useRef<HTMLInputElement>(null);

  // Handle local Image File Upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    // Check size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size should be less than 10MB.");
      return;
    }

    setImageUploadLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImageUrl(dataUrl);
      setImageUploadLoading(false);
      toast.success(`Image "${file.name}" uploaded successfully!`);
    };
    reader.onerror = () => {
      setImageUploadLoading(false);
      toast.error("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  // Handle local Video File Upload
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please upload a valid video file (MP4, WEBM).");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("Video file size should be under 50MB.");
      return;
    }

    setVideoUploadLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (setVideoUrl) setVideoUrl(dataUrl);
      setVideoUploadLoading(false);
      toast.success(`Video "${file.name}" uploaded successfully!`);
    };
    reader.onerror = () => {
      setVideoUploadLoading(false);
      toast.error("Failed to read video file.");
    };
    reader.readAsDataURL(file);
  };

  // Filtered images
  const filteredImages = SAMPLE_IMAGES.filter((img) => {
    if (selectedCategoryFilter === "All") return true;
    return img.category === selectedCategoryFilter;
  });

  const categories = ["All", "Shirts", "T-Shirts", "Chudidar Sets", "Tops", "Pants"];

  // Random pick helpers
  const handlePickRandomImage = () => {
    const match = preferredCategory
      ? SAMPLE_IMAGES.filter((i) => i.category.toLowerCase().includes(preferredCategory.toLowerCase()))
      : SAMPLE_IMAGES;
    const pool = match.length > 0 ? match : SAMPLE_IMAGES;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setImageUrl(random.url);
    toast.success(`Sample image "${random.title}" selected!`);
  };

  const handlePickRandomVideo = () => {
    const random = SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)];
    if (setVideoUrl) {
      setVideoUrl(random.url);
      toast.success(`Sample video "${random.title}" selected!`);
    }
  };

  const togglePlayVideo = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMuteVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#161618] p-6 space-y-6 shadow-xl">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Product Media (Sample Images & Videos)
          </h3>
          <p className="text-xs text-white/40 mt-0.5">
            Select high-quality sample media presets, upload local files, or enter direct CDN URLs.
          </p>
        </div>

        {/* Media Switcher */}
        <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("image")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "image"
                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                : "text-white/60 hover:text-white"
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Product Image</span>
            {imageUrl && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 ml-0.5" />}
          </button>

          {setVideoUrl && (
            <button
              type="button"
              onClick={() => setActiveTab("video")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "video"
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                : "text-white/60 hover:text-white"
              }`}
            >
              <VideoIcon className="h-3.5 w-3.5" />
              <span>Product Video</span>
              {videoUrl && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 ml-0.5" />}
            </button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          IMAGE TAB
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "image" && (
        <div className="space-y-5">
          {/* Sub-modes: Sample Gallery | Upload File | Direct URL */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setImageSourceMode("sample")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  imageSourceMode === "sample"
                    ? "bg-amber-400/20 text-amber-300 border-amber-400"
                    : "bg-white/5 text-white/50 border-white/10 hover:text-white"
                }`}
              >
                Sample Presets
              </button>
              <button
                type="button"
                onClick={() => setImageSourceMode("upload")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                  imageSourceMode === "upload"
                    ? "bg-amber-400/20 text-amber-300 border-amber-400"
                    : "bg-white/5 text-white/50 border-white/10 hover:text-white"
                }`}
              >
                <Upload className="h-3 w-3" />
                Upload Image File
              </button>
              <button
                type="button"
                onClick={() => setImageSourceMode("url")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                  imageSourceMode === "url"
                    ? "bg-amber-400/20 text-amber-300 border-amber-400"
                    : "bg-white/5 text-white/50 border-white/10 hover:text-white"
                }`}
              >
                <Link2 className="h-3 w-3" />
                Image URL
              </button>
            </div>

            <button
              type="button"
              onClick={handlePickRandomImage}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20 cursor-pointer transition-all hover:scale-105"
            >
              <Shuffle className="h-3 w-3" />
              <span>Pick Random Sample Image</span>
            </button>
          </div>

          {/* Mode: Sample Gallery */}
          {imageSourceMode === "sample" && (
            <div className="space-y-4">
              {/* Category Filter Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold shrink-0 transition-all cursor-pointer border ${
                      selectedCategoryFilter === cat
                        ? "bg-white text-slate-950 border-white"
                        : "bg-white/5 text-white/40 border-white/5 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sample Images Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
                {filteredImages.map((item) => {
                  const isSelected = imageUrl === item.url;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setImageUrl(item.url);
                        toast.success(`Selected "${item.title}"`);
                      }}
                      className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all aspect-[3/4] bg-white/5 ${
                        isSelected
                          ? "border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-400/20"
                          : "border-white/10 hover:border-white/30 hover:scale-[1.02]"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5">
                        <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                          {item.category}
                        </span>
                        <p className="text-white text-xs font-semibold truncate">{item.title}</p>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mode: File Upload */}
          {imageSourceMode === "upload" && (
            <div className="space-y-3">
              <input
                type="file"
                ref={imageFileInputRef}
                accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
                onChange={handleImageFileChange}
                className="hidden"
              />
              <div
                onClick={() => imageFileInputRef.current?.click()}
                className="border-2 border-dashed border-white/15 hover:border-amber-400/60 rounded-3xl p-8 text-center transition-all bg-white/[0.02] hover:bg-amber-400/[0.02] cursor-pointer"
              >
                <div className="h-12 w-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                  <Upload className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Click or drag image file here</h4>
                <p className="text-xs text-white/40 mt-1">
                  Supports PNG, JPG, WEBP, AVIF up to 10MB. Stored directly for instantaneous display.
                </p>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all inline-flex items-center gap-1.5"
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  <span>Choose Image File</span>
                </button>
              </div>
            </div>
          )}

          {/* Mode: Direct URL */}
          {imageSourceMode === "url" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider block">
                Direct Image CDN URL
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or Supabase CDN URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          {/* Image Live Preview */}
          {imageUrl && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="h-16 w-16 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    Active Image Selected
                  </span>
                </div>
                <p className="text-white/60 text-xs font-mono truncate mt-1">{imageUrl}</p>
              </div>
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="h-8 w-8 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 flex items-center justify-center cursor-pointer transition-all shrink-0"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIDEO TAB
         ───────────────────────────────────────────────────────────── */}
      {activeTab === "video" && setVideoUrl && (
        <div className="space-y-5">
          {/* Sub-modes: Sample Gallery | Upload File | Direct URL */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setVideoSourceMode("sample")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  videoSourceMode === "sample"
                    ? "bg-amber-400/20 text-amber-300 border-amber-400"
                    : "bg-white/5 text-white/50 border-white/10 hover:text-white"
                }`}
              >
                Sample Fashion Videos
              </button>
              <button
                type="button"
                onClick={() => setVideoSourceMode("upload")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                  videoSourceMode === "upload"
                    ? "bg-amber-400/20 text-amber-300 border-amber-400"
                    : "bg-white/5 text-white/50 border-white/10 hover:text-white"
                }`}
              >
                <Upload className="h-3 w-3" />
                Upload Video File
              </button>
              <button
                type="button"
                onClick={() => setVideoSourceMode("url")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                  videoSourceMode === "url"
                    ? "bg-amber-400/20 text-amber-300 border-amber-400"
                    : "bg-white/5 text-white/50 border-white/10 hover:text-white"
                }`}
              >
                <Link2 className="h-3 w-3" />
                Video URL
              </button>
            </div>

            <button
              type="button"
              onClick={handlePickRandomVideo}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20 cursor-pointer transition-all hover:scale-105"
            >
              <Shuffle className="h-3 w-3" />
              <span>Pick Random Sample Video</span>
            </button>
          </div>

          {/* Mode: Sample Video Gallery */}
          {videoSourceMode === "sample" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_VIDEOS.map((item) => {
                const isSelected = videoUrl === item.url;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setVideoUrl(item.url);
                      toast.success(`Selected "${item.title}"`);
                    }}
                    className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all bg-white/5 p-3 flex items-center gap-3 ${
                      isSelected
                        ? "border-amber-400 ring-2 ring-amber-400/50 bg-amber-400/5 shadow-lg shadow-amber-400/20"
                        : "border-white/10 hover:border-white/30 hover:bg-white/10"
                    }`}
                  >
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="h-4 w-4 text-white fill-white" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-white text-xs font-bold truncate">{item.title}</p>
                      <p className="text-white/40 text-[11px] truncate mt-0.5">{item.description}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-amber-300">
                        {isSelected ? "✓ Active Video" : "Click to select"}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="h-6 w-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Mode: Video File Upload */}
          {videoSourceMode === "upload" && (
            <div className="space-y-3">
              <input
                type="file"
                ref={videoFileInputRef}
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleVideoFileChange}
                className="hidden"
              />
              <div
                onClick={() => videoFileInputRef.current?.click()}
                className="border-2 border-dashed border-white/15 hover:border-amber-400/60 rounded-3xl p-8 text-center transition-all bg-white/[0.02] hover:bg-amber-400/[0.02] cursor-pointer"
              >
                <div className="h-12 w-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                  <VideoIcon className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Click or drag video file here</h4>
                <p className="text-xs text-white/40 mt-1">
                  Supports MP4, WEBM, QuickTime up to 50MB for dynamic in-store video showcase.
                </p>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all inline-flex items-center gap-1.5"
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  <span>Choose Video File</span>
                </button>
              </div>
            </div>
          )}

          {/* Mode: Direct Video URL */}
          {videoSourceMode === "url" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider block">
                Direct Video MP4/WEBM URL
              </label>
              <div className="relative">
                <VideoIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="url"
                  placeholder="https://assets.mixkit.co/.../video.mp4 or Supabase Storage URL"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          {/* Live Video Player Preview */}
          {videoUrl && (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Live Video Preview Player
                </span>
                <button
                  type="button"
                  onClick={() => setVideoUrl("")}
                  className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 flex items-center justify-center cursor-pointer transition-all"
                  title="Remove video"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-56 mx-auto border border-white/10">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  loop
                  muted={isMuted}
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="h-full w-full object-contain mx-auto"
                />
                {/* Overlay controls */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlayVideo}
                      className="h-7 w-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold cursor-pointer"
                    >
                      {isPlaying ? <Pause className="h-3.5 w-3.5 fill-slate-950" /> : <Play className="h-3.5 w-3.5 fill-slate-950" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMuteVideo}
                      className="h-7 w-7 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-white/50 font-mono truncate max-w-[200px]">
                    {videoUrl.substring(0, 40)}...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
