"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, Save, User } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number").or(z.literal("")).optional(),
  email: z.string().email("Invalid email address").or(z.literal("")).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AccountProfilePage() {
  const [saving, setSaving] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const userSession =
        JSON.parse(localStorage.getItem("999-user-session") || "null") ||
        JSON.parse(localStorage.getItem("999-store-session") || "null");

      if (userSession) {
        if (userSession.name) setValue("name", userSession.name);
        if (userSession.phone) setValue("phone", userSession.phone);
        if (userSession.email) setValue("email", userSession.email);
      }
    }
  }, [setValue]);

  const onSubmit = async (data: ProfileFormValues) => {
    setSaving(true);
    setSavedSuccess(false);

    try {
      if (typeof window !== "undefined") {
        const existing =
          JSON.parse(localStorage.getItem("999-user-session") || "null") ||
          JSON.parse(localStorage.getItem("999-store-session") || "null") ||
          {};

        const updated = {
          ...existing,
          name: data.name.trim(),
          phone: data.phone?.trim() || "",
          email: data.email?.trim() || "",
          updatedAt: new Date().toISOString(),
        };

        localStorage.setItem("999-user-session", JSON.stringify(updated));
        localStorage.setItem("999-store-session", JSON.stringify(updated));

        // Dispatch a storage event so layout sidebar picks it up
        window.dispatchEvent(new Event("storage"));

        setSavedSuccess(true);
        toast.success("Profile preferences saved successfully!");
      }
    } catch (err) {
      toast.error("Failed to save profile preferences.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-body max-w-lg">
      <div className="space-y-1 border-b border-[#E8E0D0] pb-4">
        <h1 className="text-xl font-extrabold font-heading text-text-primary uppercase tracking-tight flex items-center gap-2">
          <User className="h-5 w-5 text-brand-primary" />
          <span>My Profile Preferences</span>
        </h1>
        <p className="text-xs text-text-secondary font-ui">
          Update your contact details and shipping preferences for faster checkout.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Full Name</label>
          <Input
            type="text"
            placeholder="e.g. Luffy"
            {...register("name")}
            className="h-12 rounded-2xl bg-bg-secondary border-border-medium/60 text-sm font-ui"
          />
          {errors.name && <p className="text-[11px] text-red-600 font-semibold">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Mobile Number</label>
          <Input
            type="tel"
            placeholder="e.g. 9876543210"
            {...register("phone")}
            className="h-12 rounded-2xl bg-bg-secondary border-border-medium/60 text-sm font-ui"
          />
          {errors.phone && <p className="text-[11px] text-red-600 font-semibold">{errors.phone.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Email Address</label>
          <Input
            type="email"
            placeholder="e.g. luffy@example.com"
            {...register("email")}
            className="h-12 rounded-2xl bg-bg-secondary border-border-medium/60 text-sm font-ui"
          />
          {errors.email && <p className="text-[11px] text-red-600 font-semibold">{errors.email.message}</p>}
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>All changes have been saved to your session!</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={saving}
          className="w-full h-12 uppercase font-black tracking-widest text-xs rounded-2xl bg-[#1D1D1F] text-white hover:bg-[#2C2C2E] cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving..." : "Save Settings"}</span>
        </Button>
      </form>
    </div>
  );
}
