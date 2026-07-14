"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AccountProfilePage() {
  const [session, setSession] = React.useState<any | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
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
      const storedSession = JSON.parse(localStorage.getItem("999-store-session") || "null");
      if (storedSession) {
        setSession(storedSession);
        setValue("name", storedSession.name);
        setValue("phone", storedSession.phone);
        setValue("email", storedSession.email || "");
      }
    }
  }, [setValue]);

  const onSubmit = (data: ProfileFormValues) => {
    if (typeof window !== "undefined" && session) {
      const updated = {
        ...session,
        name: data.name,
        phone: data.phone,
        email: data.email,
      };
      localStorage.setItem("999-store-session", JSON.stringify(updated));
      toast.success("Profile preferences updated successfully!");
    }
  };

  return (
    <div className="space-y-6 font-body">
      <div className="space-y-1 border-b border-border-light pb-4">
        <h1 className="text-xl font-extrabold font-heading text-text-primary uppercase tracking-tight">
          MY PROFILE PREFERENCES
        </h1>
        <p className="text-xs text-text-secondary">
          Update your contact details and shipping preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-secondary">Full Name</label>
          <Input type="text" {...register("name")} />
          {errors.name && <p className="text-[10px] text-red-600">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-secondary">Mobile Number</label>
          <Input type="tel" {...register("phone")} />
          {errors.phone && <p className="text-[10px] text-red-600">{errors.phone.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-secondary">Email Address</label>
          <Input type="email" {...register("email")} />
          {errors.email && <p className="text-[10px] text-red-600">{errors.email.message}</p>}
        </div>

        <Button type="submit" disabled={!isDirty} className="w-full h-10 uppercase font-bold tracking-wider cursor-pointer">
          Save Settings
        </Button>
      </form>
    </div>
  );
}
