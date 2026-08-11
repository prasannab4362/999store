"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCartStore } from "@/stores/cart-store";
import { calculateOrderTotals, formatCurrency } from "@/features/checkout/utils/calculate-order-totals";
import { siteConfig } from "@/config/site";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Lock, CreditCard, Banknote, Smartphone, Loader2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

const ErrorMessage = ({ message }: { message?: string }) => (
  <AnimatePresence>
    {message && (
      <motion.p
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.2 }}
        className="text-[10px] font-ui text-red-500 font-bold mt-1.5 ml-1 tracking-wide"
      >
        {message}
      </motion.p>
    )}
  </AnimatePresence>
);

const checkoutSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number starting with 6-9"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  addressLine1: z.string().min(5, "Address must be at least 5 characters"),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  state: z.string().min(2, "State is required"),
  pinCode: z.string().regex(/^\d{6}$/, "Pin code must be exactly 6 digits"),
  paymentMethod: z.enum(["upi", "online", "cod_advance"]),
  policyAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the return policy to place your order",
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const inputClass = "h-12 bg-bg-secondary border-transparent font-ui font-medium rounded-[14px] px-4 hover:bg-border-light/20 focus-visible:bg-white focus-visible:border-[rgba(0,0,0,0.1)] focus-visible:ring-4 focus-visible:ring-[rgba(0,0,0,0.04)] transition-all shadow-none text-text-primary placeholder:text-text-muted/60";
const labelClass = "text-[11px] font-semibold font-ui uppercase tracking-widest text-text-secondary pl-1 block mb-1.5";

export default function CheckoutPage() {
  const router = useRouter();
  const { comboGroups, coupon, clearCart, isHydrated } = useCartStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      district: "",
      state: "",
      pinCode: "",
      paymentMethod: "online",
      policyAccepted: false,
    },
  });

  const selectedPaymentMethod = watch("paymentMethod");

  const totals = React.useMemo(() => {
    return calculateOrderTotals({
      comboGroups,
      coupon: coupon || undefined,
      shippingMinor: siteConfig.policies.defaultShippingChargeMinor,
      paymentMethod: selectedPaymentMethod,
    });
  }, [comboGroups, coupon, selectedPaymentMethod]);

  React.useEffect(() => {
    if (isHydrated && comboGroups.length === 0) {
      router.push("/cart");
    }
  }, [comboGroups, isHydrated, router]);

  if (!isHydrated || comboGroups.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] font-body">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary mb-4" />
        <p className="text-xs font-ui font-bold uppercase tracking-widest text-text-muted">Loading checkout...</p>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    toast.loading("Placing your order...", { id: "checkout-toast" });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const orderId = `999-${Math.floor(100000 + Math.random() * 900000)}`;
    const mockOrder = {
      id: orderId,
      orderNumber: orderId,
      customer: { name: data.fullName, phone: data.phone, email: data.email },
      shippingAddress: {
        fullName: data.fullName, phone: data.phone,
        addressLine1: data.addressLine1, addressLine2: data.addressLine2,
        landmark: data.landmark, city: data.city,
        district: data.district, state: data.state,
        pinCode: data.pinCode, country: "India",
      },
      comboGroups: comboGroups.map((g) => ({
        id: g.id, comboId: g.comboId, comboSlug: g.comboSlug,
        comboName: g.comboName, itemLimit: g.itemLimit,
        basePriceMinor: g.basePriceMinor,
        items: g.items.map((item) => ({
          lineId: item.lineId, productId: item.productId,
          productSlug: item.productSlug, productName: item.productName,
          productCode: item.productCode, variantId: item.variantId,
          sku: item.sku, colorName: item.colorName,
          colorHex: item.colorHex, size: item.size, image: item.image,
        })),
      })),
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === "cod_advance" ? "advance_pending" : "paid",
      orderStatus: "confirmed",
      statusHistory: [{ status: "confirmed", timestamp: new Date().toISOString(), note: "Order placed successfully" }],
      subtotalMinor: totals.subtotalMinor, discountMinor: totals.discountMinor,
      shippingMinor: totals.shippingMinor, advanceMinor: totals.advanceMinor,
      balanceDueMinor: totals.balanceDueMinor, grandTotalMinor: totals.grandTotalMinor,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      const existingOrders = JSON.parse(localStorage.getItem("999-store-orders") || "[]");
      localStorage.setItem("999-store-orders", JSON.stringify([mockOrder, ...existingOrders]));
    }

    toast.success("Order placed successfully!", { id: "checkout-toast" });
    clearCart();
    router.push(`/checkout/success?orderId=${orderId}`);
  };

  const sectionClass = "bg-white p-6 sm:p-8 rounded-[24px] border border-[rgba(0,0,0,0.06)] shadow-sm space-y-6 relative overflow-hidden group transition-all duration-300 hover:shadow-md";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 font-body min-h-[80vh]">

      <div className="pb-8 mb-4">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] font-ui mb-2">Checkout Process</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold font-heading text-text-primary tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-sm font-ui text-text-secondary flex items-center gap-2 mt-2">
          <Lock className="h-3.5 w-3.5 text-text-muted" />
          Enter your details below to complete your order.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-[1fr_400px] gap-10 xl:gap-14 items-start">

        {/* Left: Form Sections */}
        <div className="space-y-6">

          {/* 01 Contact Details */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className={sectionClass}>
            <div className="absolute top-0 left-0 w-1 h-full bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <h3 className="text-base font-semibold font-heading uppercase text-text-primary tracking-widest flex items-center gap-2.5">
              <span className="text-text-muted font-ui text-sm font-bold">01.</span> Contact Details
            </h3>
            <div className="grid gap-5 sm:grid-cols-2 pt-1">
              <div>
                <label className={labelClass}>Full Name</label>
                <Input type="text" placeholder="John Doe" {...register("fullName")} className={inputClass} />
                <ErrorMessage message={errors.fullName?.message} />
              </div>
              <div>
                <label className={labelClass}>Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-ui font-bold text-sm">+91</span>
                  <Input type="tel" placeholder="9876543210" {...register("phone")} className={cn(inputClass, "pl-12")} />
                </div>
                <ErrorMessage message={errors.phone?.message} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Email Address <span className="text-text-muted font-normal normal-case tracking-normal ml-1 text-[10px]">(Optional)</span></label>
                <Input type="email" placeholder="john@example.com" {...register("email")} className={inputClass} />
                <ErrorMessage message={errors.email?.message} />
              </div>
            </div>
          </motion.div>

          {/* 02 Delivery Address */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={sectionClass}>
            <div className="absolute top-0 left-0 w-1 h-full bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <h3 className="text-base font-semibold font-heading uppercase text-text-primary tracking-widest flex items-center gap-2.5">
              <span className="text-text-muted font-ui text-sm font-bold">02.</span> Delivery Address
            </h3>
            <div className="grid gap-5 sm:grid-cols-2 pt-1">
              <div className="sm:col-span-2">
                <label className={labelClass}>Address Line 1</label>
                <Input type="text" placeholder="Flat / House No. / Street" {...register("addressLine1")} className={inputClass} />
                <ErrorMessage message={errors.addressLine1?.message} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Address Line 2 <span className="text-text-muted font-normal normal-case tracking-normal ml-1 text-[10px]">(Optional)</span></label>
                <Input type="text" placeholder="Apartment / Area / Suite" {...register("addressLine2")} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Landmark <span className="text-text-muted font-normal normal-case tracking-normal ml-1 text-[10px]">(Optional)</span></label>
                <Input type="text" placeholder="Near Apollo Hospital" {...register("landmark")} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Pin Code</label>
                <Input type="text" placeholder="600001" {...register("pinCode")} className={cn(inputClass, "tracking-widest")} />
                <ErrorMessage message={errors.pinCode?.message} />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <Input type="text" placeholder="Chennai" {...register("city")} className={inputClass} />
                <ErrorMessage message={errors.city?.message} />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <Input type="text" placeholder="Tamil Nadu" {...register("state")} className={inputClass} />
                <ErrorMessage message={errors.state?.message} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>District</label>
                <Input type="text" placeholder="Chennai" {...register("district")} className={inputClass} />
                <ErrorMessage message={errors.district?.message} />
              </div>
            </div>
          </motion.div>

          {/* 03 Payment Method */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className={sectionClass}>
            <div className="absolute top-0 left-0 w-1 h-full bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <h3 className="text-base font-semibold font-heading uppercase text-text-primary tracking-widest flex items-center gap-2.5">
              <span className="text-text-muted font-ui text-sm font-bold">03.</span> Payment Method
            </h3>
            <div className="pt-1 space-y-3">
              <RadioGroup
                value={selectedPaymentMethod}
                onValueChange={(val) => setValue("paymentMethod", val as any)}
                className="grid gap-3"
              >
                {[
                  { id: "online", title: "Online Payment", desc: "Credit/Debit Card, NetBanking. Faster dispatch.", icon: CreditCard },
                  { id: "upi", title: "UPI Payment", desc: "Instant secure payment via GooglePay, PhonePe, Paytm.", icon: Smartphone },
                  { id: "cod_advance", title: "Cash on Delivery", desc: `Pay 20% advance (${formatCurrency(totals.advanceMinor)}) now. Balance on delivery.`, icon: Banknote },
                ].map((method) => {
                  const isSelected = selectedPaymentMethod === method.id;
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.id}
                      onClick={() => setValue("paymentMethod", method.id as any)}
                      className={cn(
                        "relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 select-none",
                        isSelected
                          ? "border-[#1D1D1F] bg-[#FAFAF9] shadow-sm"
                          : "border-border-medium/60 hover:border-border-medium hover:bg-[#FAFAF9]"
                      )}
                    >
                      <RadioGroupItem value={method.id} className="sr-only" />
                      <div className="flex flex-1 items-center gap-4">
                        <div className={cn(
                          "flex items-center justify-center h-12 w-12 rounded-xl border shrink-0",
                          isSelected
                            ? "bg-[#1D1D1F] border-transparent text-white"
                            : "bg-bg-secondary border-transparent text-text-muted"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <h4 className={cn("font-heading font-black text-sm", isSelected ? "text-[#1D1D1F]" : "text-text-primary")}>{method.title}</h4>
                          <p className="text-[11px] font-ui text-text-secondary leading-snug">{method.desc}</p>
                        </div>
                      </div>
                      <div className={cn("absolute top-4 right-4 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors", isSelected ? "border-[#1D1D1F]" : "border-border-medium/60")}>
                        {isSelected && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-2.5 w-2.5 rounded-full bg-[#1D1D1F]" />
                        )}
                      </div>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>
          </motion.div>
        </div>

        {/* Right: Order Summary */}
        <div className="sticky top-24 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-[24px] bg-white border border-[rgba(0,0,0,0.06)] p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 space-y-6"
          >
            <h3 className="font-heading font-black text-xl text-text-primary uppercase tracking-widest flex items-center gap-2">
              <Shield className="h-5 w-5 text-text-primary" /> Order Summary
            </h3>

            {/* Products */}
            <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-1 scrollbar-thin">
              {comboGroups.map((group) => (
                <div key={group.id} className="p-3 bg-bg-secondary rounded-xl border border-transparent space-y-2.5">
                  <div className="flex justify-between items-center border-b border-border-medium/30 pb-2">
                    <p className="font-black font-heading text-xs text-text-primary uppercase tracking-wide">{group.comboName}</p>
                    <span className="text-[10px] font-black text-text-primary font-ui">{formatCurrency(group.basePriceMinor)}</span>
                  </div>
                  <div className="space-y-1.5">
                    {group.items.map((it) => (
                      <div key={it.lineId} className="flex gap-2.5 items-center bg-white p-2 rounded-lg border border-border-light shadow-sm">
                        <div className="relative h-10 w-8 rounded-lg overflow-hidden bg-bg-secondary shrink-0 border border-border-light">
                          {it.image ? <Image src={it.image} alt={it.productName} fill sizes="32px" className="object-cover" /> : <div className="w-full h-full bg-bg-secondary" />}
                        </div>
                        <div className="text-[11px] min-w-0 font-ui flex-1">
                          <h4 className="font-bold text-text-primary truncate leading-snug">{it.productName}</h4>
                          <div className="flex items-center gap-2 text-[10px] text-text-muted mt-0.5">
                            <span>Size: <strong className="text-text-secondary">{it.size}</strong></span>
                            <span>·</span>
                            <span>Color: <strong className="text-text-secondary">{it.colorName}</strong></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="border-t border-border-medium/30 pt-5 space-y-3 text-sm font-ui">
              <div className="flex justify-between items-center text-text-secondary">
                <span>Combo Subtotal</span>
                <span className="font-black text-text-primary font-heading text-base">{formatCurrency(totals.subtotalMinor)}</span>
              </div>
              {totals.discountMinor > 0 && (
                <div className="flex justify-between items-center text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
                  <span className="font-black text-xs uppercase tracking-wider">Coupon ({coupon?.code})</span>
                  <span className="font-black font-heading text-base">-{formatCurrency(totals.discountMinor)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-text-secondary">
                <span>Standard Courier</span>
                <span className="font-black text-text-primary font-heading text-base">{formatCurrency(totals.shippingMinor)}</span>
              </div>

              {selectedPaymentMethod === "cod_advance" ? (
                <>
                  <div className="border-t border-border-medium/30 pt-4 flex justify-between items-center font-black text-text-primary">
                    <span className="uppercase tracking-widest text-[11px]">20% Advance Payable</span>
                    <span className="font-heading text-2xl">{formatCurrency(totals.advanceMinor)}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-text-secondary bg-bg-secondary px-3 py-2 rounded-xl border border-transparent">
                    <span className="uppercase tracking-widest text-[10px]">Balance on Delivery</span>
                    <span className="font-heading text-lg">{formatCurrency(totals.balanceDueMinor)}</span>
                  </div>
                </>
              ) : (
                <div className="border-t border-border-medium/30 pt-4 flex justify-between items-end">
                  <span className="font-heading font-black text-text-primary uppercase tracking-widest text-sm">Total Payable</span>
                  <span className="font-heading font-black text-text-primary text-3xl tracking-tight">{formatCurrency(totals.grandTotalMinor)}</span>
                </div>
              )}
            </div>

            {/* Policy Checkbox */}
            <div className="space-y-2 border-t border-border-medium/30 pt-5">
              <div className="flex gap-3 items-start p-3 bg-red-50 rounded-xl border border-red-100">
                <Checkbox
                  id="policyAccepted"
                  onCheckedChange={(checked) => setValue("policyAccepted", checked === true)}
                  className="mt-0.5 border-red-200"
                />
                <label htmlFor="policyAccepted" className="text-[11px] font-ui text-text-secondary leading-relaxed cursor-pointer select-none">
                  I understand there are <strong className="text-text-primary">no regular exchanges</strong>. Damaged items require a parcel opening video and are subject to management approval.
                </label>
              </div>
              <ErrorMessage message={errors.policyAccepted?.message} />
            </div>

            {/* Place Order */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 uppercase font-semibold text-[17px] font-ui rounded-full transition-all duration-300 active:scale-95 group flex items-center justify-center gap-3 cursor-pointer overflow-hidden relative bg-[#1D1D1F] text-white shadow-sm hover:shadow-md hover:-translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Place Order</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </form>
    </div>
  );
}
