"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Video, UploadCloud, Film, CheckCircle2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// Form validation
const claimSchema = z.object({
  orderId: z.string().min(4, "Enter a valid order ID"),
  productName: z.string().min(3, "Enter the affected product details"),
  reason: z.string().min(5, "Please specify the damage reason"),
  description: z.string().min(10, "Please describe the damage in at least 10 characters"),
  policyAccepted: z.boolean().refine((val) => val === true, {
    message: "You must acknowledge the unboxing video requirements",
  }),
});

type ClaimFormValues = z.infer<typeof claimSchema>;

export default function FileReturnClaimPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledOrderId = searchParams.get("orderId") || "";

  const [videoFile, setVideoFile] = React.useState<File | null>(null);
  const [videoError, setVideoError] = React.useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      orderId: prefilledOrderId,
      productName: "",
      reason: "",
      description: "",
      policyAccepted: false,
    },
  });

  // Handle prefilled values
  React.useEffect(() => {
    if (prefilledOrderId) setValue("orderId", prefilledOrderId);
  }, [prefilledOrderId, setValue]);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setVideoError(null);

    if (!file) {
      setVideoFile(null);
      return;
    }

    // Validate type (MP4, MOV, MKV, WebM)
    const validTypes = ["video/mp4", "video/quicktime", "video/x-matroska", "video/webm"];
    if (!validTypes.includes(file.type)) {
      setVideoError("Unsupported video format. Please upload MP4, MOV, or WebM.");
      setVideoFile(null);
      return;
    }

    // Validate size (max 50MB for demo)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setVideoError("Video size exceeds 50MB. Please compress the file.");
      setVideoFile(null);
      return;
    }

    setVideoFile(file);
  };

  const onSubmit = async (data: ClaimFormValues) => {
    if (!videoFile) {
      setVideoError("Continuous unboxing video is required.");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    // Mock video upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    // Wait for upload completion + mock latency
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Save claim metadata only
    const claimId = `CLM-${Math.floor(100000 + Math.random() * 900000)}`;
    const newClaim = {
      id: claimId,
      orderId: data.orderId,
      productName: data.productName,
      reason: data.reason,
      description: data.description,
      videoFile: {
        name: videoFile.name,
        size: videoFile.size,
        type: videoFile.type,
      },
      status: "submitted",
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      const existingClaims = JSON.parse(localStorage.getItem("999-store-claims") || "[]");
      localStorage.setItem("999-store-claims", JSON.stringify([newClaim, ...existingClaims]));
    }

    toast.success("Damage return claim submitted for review.");
    setIsSubmitting(false);
    setUploadProgress(null);
    router.push("/account/returns");
  };

  return (
    <div className="space-y-6 font-body">
      {/* Title & Back */}
      <div className="flex items-center justify-between border-b border-border-light pb-4">
        <div className="flex items-center gap-3">
          <Link href="/account/returns" className="p-2 -ml-2 text-text-secondary hover:text-brand-primary active:scale-95 transition-transform">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold font-heading text-text-primary uppercase tracking-tight">
              File Damage Return Claim
            </h1>
            <p className="text-xs text-text-secondary">
              File a transit damage report with unboxing video evidence.
            </p>
          </div>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="rounded-card border border-red-200 bg-red-50 p-4 flex gap-3 text-xs text-red-900 leading-normal">
        <ShieldAlert className="h-5 w-5 shrink-0 text-red-600" />
        <div>
          <p className="font-semibold font-heading text-red-800 uppercase tracking-wider text-[10px]">Unboxing Video Policy Requirements</p>
          <p className="mt-1">
            To prevent return fraud, **you must upload a continuous unboxing video** showing:
          </p>
          <ul className="list-disc pl-4 mt-1 space-y-0.5">
            <li>The shipping label clearly legible.</li>
            <li>The parcel showing no prior signs of opening.</li>
            <li>The full unpacking flow, showing the damage directly in context.</li>
          </ul>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Order ID</label>
            <Input type="text" placeholder="999-123456" {...register("orderId")} />
            {errors.orderId && <p className="text-[10px] text-red-600">{errors.orderId.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Affected Product Details</label>
            <Input type="text" placeholder="e.g. Emerald check shirt (M)" {...register("productName")} />
            {errors.productName && <p className="text-[10px] text-red-600">{errors.productName.message}</p>}
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-text-secondary">Damage Reason Summary</label>
            <Input type="text" placeholder="e.g. Fabric tear on left sleeve" {...register("reason")} />
            {errors.reason && <p className="text-[10px] text-red-600">{errors.reason.message}</p>}
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-text-secondary">Detailed Description</label>
            <Textarea placeholder="Describe the transit damage in details..." {...register("description")} />
            {errors.description && <p className="text-[10px] text-red-600">{errors.description.message}</p>}
          </div>
        </div>

        {/* Video Upload Dropzone */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-secondary block">
            Unboxing Video Evidence (Max 50MB, MP4/WebM)
          </label>
          <div className="border-2 border-dashed border-border-medium rounded-promo p-6 text-center space-y-3 bg-bg-secondary/20 hover:bg-bg-secondary/40 transition-colors relative cursor-pointer group">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoSelect}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {videoFile ? (
              <div className="flex flex-col items-center space-y-2 text-xs text-brand-primary">
                <Film className="h-8 w-8" />
                <p className="font-semibold">{videoFile.name}</p>
                <p className="text-text-muted">{(videoFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2 text-xs text-text-secondary">
                <UploadCloud className="h-8 w-8 text-text-muted group-hover:scale-105 transition-transform" />
                <p className="font-semibold text-text-primary">Click to select video file</p>
                <p className="text-[10px] text-text-muted">Continuous single-shot unboxing video only</p>
              </div>
            )}
          </div>
          {videoError && <p className="text-[10px] text-red-600 font-semibold">{videoError}</p>}
        </div>

        {/* Progress bar */}
        {uploadProgress !== null && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-brand-primary">
              <span>Uploading evidence to secure storage...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} max={100} className="h-2" />
            <p className="text-[9px] text-text-muted">*Do not refresh or navigate away during mock upload progress.</p>
          </div>
        )}

        {/* Checkbox policy */}
        <div className="space-y-2">
          <div className="flex gap-2.5 items-start">
            <Checkbox
              id="policyAccepted"
              onCheckedChange={(checked) => setValue("policyAccepted", checked === true)}
            />
            <label htmlFor="policyAccepted" className="text-[11px] text-text-secondary leading-normal select-none cursor-pointer">
              I verify that the uploaded unboxing video matches the order shipment details, is continuous (no cuts/edits), and clearly shows the damage package label.
            </label>
          </div>
          {errors.policyAccepted && (
            <p className="text-[10px] text-red-600 font-semibold">{errors.policyAccepted.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" size="lg" className="w-full h-11 uppercase font-bold tracking-wider cursor-pointer" disabled={isSubmitting}>
          Submit Claim
        </Button>
      </form>
    </div>
  );
}
