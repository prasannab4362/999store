"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";

const contactSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(4, "Subject must be at least 4 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    toast.loading("Sending your message...", { id: "contact" });

    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Message sent successfully! We will get back to you soon.", { id: "contact" });
    setIsSubmitting(false);
    reset();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 font-body">
      <div className="text-center max-w-xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary tracking-tight uppercase">
          Contact Us
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          Have questions about sizing, combo tiers, or shipping? Send us a message and we'll reply within 24 hours.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Info panel */}
        <div className="space-y-6 bg-bg-secondary/40 border border-border-light p-6 rounded-promo shadow-sm">
          <h3 className="font-heading font-extrabold text-lg text-text-primary uppercase tracking-wide">
            Support Info
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Please feel free to reach out via standard communication channels or drop a support ticket using the contact form.
          </p>

          <div className="space-y-4 text-xs text-text-secondary">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-brand-primary" />
              <div>
                <p className="font-bold text-text-primary font-heading">Support Email</p>
                <p>{siteConfig.supportEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-brand-primary" />
              <div>
                <p className="font-bold text-text-primary font-heading">Phone / Whatsapp</p>
                <p>{siteConfig.supportPhone} / {siteConfig.whatsappNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-brand-primary" />
              <div>
                <p className="font-bold text-text-primary font-heading">HQ Location</p>
                <p>999 Corporate Office, T-Nagar, Chennai, Tamil Nadu, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Full Name</label>
            <Input type="text" placeholder="John Doe" {...register("name")} />
            {errors.name && <p className="text-[10px] text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Email Address</label>
            <Input type="email" placeholder="john@example.com" {...register("email")} />
            {errors.email && <p className="text-[10px] text-red-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Subject</label>
            <Input type="text" placeholder="Query about size guide" {...register("subject")} />
            {errors.subject && <p className="text-[10px] text-red-600">{errors.subject.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Message</label>
            <Textarea placeholder="Type details of your request here..." {...register("message")} />
            {errors.message && <p className="text-[10px] text-red-600">{errors.message.message}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full h-11 uppercase font-bold tracking-wider cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Submit Message"}
          </Button>
        </form>
      </div>
    </div>
  );
}
