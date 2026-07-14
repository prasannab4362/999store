"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
import { Shield, ChevronRight, Lock, CreditCard } from "lucide-react";
import { toast } from "sonner";

// Validation schema
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

export default function CheckoutPage() {
  const router = useRouter();
  const { comboGroups, coupon, clearCart, isHydrated } = useCartStore();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form setup
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

  // Calculate totals
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
      <div className="mx-auto max-w-xl text-center py-20 font-body">
        <p className="text-sm text-text-secondary">Loading checkout...</p>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    toast.loading("Placing your order...", { id: "checkout-toast" });

    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate Order ID & persistent record
    const orderId = `999-${Math.floor(100000 + Math.random() * 900000)}`;
    const mockOrder = {
      id: orderId,
      orderNumber: orderId,
      customer: {
        name: data.fullName,
        phone: data.phone,
        email: data.email,
      },
      shippingAddress: {
        fullName: data.fullName,
        phone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        landmark: data.landmark,
        city: data.city,
        district: data.district,
        state: data.state,
        pinCode: data.pinCode,
        country: "India",
      },
      comboGroups: comboGroups.map((g) => ({
        comboId: g.comboId,
        comboName: g.comboName,
        itemLimit: g.itemLimit,
        basePriceMinor: g.basePriceMinor,
        items: g.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productCode: item.productCode,
          sku: item.sku,
          colorName: item.colorName,
          size: item.size,
          image: item.image,
        })),
      })),
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === "cod_advance" ? "advance_pending" : "paid",
      orderStatus: "confirmed",
      statusHistory: [
        { status: "confirmed", timestamp: new Date().toISOString(), note: "Order placed successfully" }
      ],
      subtotalMinor: totals.subtotalMinor,
      discountMinor: totals.discountMinor,
      shippingMinor: totals.shippingMinor,
      advanceMinor: totals.advanceMinor,
      balanceDueMinor: totals.balanceDueMinor,
      grandTotalMinor: totals.grandTotalMinor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to localStorage for tracking functionality
    if (typeof window !== "undefined") {
      const existingOrders = JSON.parse(localStorage.getItem("999-store-orders") || "[]");
      localStorage.setItem("999-store-orders", JSON.stringify([mockOrder, ...existingOrders]));
    }

    toast.success("Order placed successfully!", { id: "checkout-toast" });
    clearCart();
    router.push(`/checkout/success?orderId=${orderId}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-body">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight">
          CHECKOUT
        </h1>
        <p className="text-xs text-text-secondary">
          Enter your delivery details and choose a payment method.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* Left Column: Checkout details input */}
        <div className="space-y-6 bg-white p-6 rounded-card border border-border-light shadow-sm">
          {/* Section 1: Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-heading uppercase text-text-primary tracking-wider border-b border-border-light pb-2">
              01. Contact Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Full Name</label>
                <Input type="text" placeholder="John Doe" {...register("fullName")} />
                {errors.fullName && <p className="text-[10px] text-red-600">{errors.fullName.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Mobile Number (Indian format)</label>
                <Input type="tel" placeholder="9876543210" {...register("phone")} />
                {errors.phone && <p className="text-[10px] text-red-600">{errors.phone.message}</p>}
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-text-secondary">Email Address (Optional)</label>
                <Input type="email" placeholder="john@example.com" {...register("email")} />
                {errors.email && <p className="text-[10px] text-red-600">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Address */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold font-heading uppercase text-text-primary tracking-wider border-b border-border-light pb-2">
              02. Delivery Address
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-text-secondary">Address Line 1</label>
                <Input type="text" placeholder="Flat / House No. / Street" {...register("addressLine1")} />
                {errors.addressLine1 && <p className="text-[10px] text-red-600">{errors.addressLine1.message}</p>}
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-text-secondary">Address Line 2 (Optional)</label>
                <Input type="text" placeholder="Apartment / Area / Suite" {...register("addressLine2")} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Landmark (Optional)</label>
                <Input type="text" placeholder="Near Apollo Hospital" {...register("landmark")} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Pin Code (6 digits)</label>
                <Input type="text" placeholder="600001" {...register("pinCode")} />
                {errors.pinCode && <p className="text-[10px] text-red-600">{errors.pinCode.message}</p>}
              </div>
              <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">City</label>
                  <Input type="text" placeholder="Chennai" {...register("city")} />
                  {errors.city && <p className="text-[10px] text-red-600">{errors.city.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">District</label>
                  <Input type="text" placeholder="Chennai" {...register("district")} />
                  {errors.district && <p className="text-[10px] text-red-600">{errors.district.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">State</label>
                  <Input type="text" placeholder="Tamil Nadu" {...register("state")} />
                  {errors.state && <p className="text-[10px] text-red-600">{errors.state.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold font-heading uppercase text-text-primary tracking-wider border-b border-border-light pb-2">
              03. Payment Method
            </h3>
            <RadioGroup
              value={selectedPaymentMethod}
              onValueChange={(val) => setValue("paymentMethod", val as any)}
            >
              <div className="rounded-card border border-border-light p-4 space-y-4 bg-bg-secondary/40">
                <RadioGroupItem value="online">
                  <span className="font-heading font-semibold text-sm">Online Payment (Card/NetBanking)</span>
                  <span className="block text-[11px] text-text-secondary font-body mt-0.5">Pay the entire amount online securely. Faster dispatch.</span>
                </RadioGroupItem>
                <RadioGroupItem value="upi">
                  <span className="font-heading font-semibold text-sm">UPI Payment</span>
                  <span className="block text-[11px] text-text-secondary font-body mt-0.5">Instant secure payment via GooglePay, PhonePe, Paytm.</span>
                </RadioGroupItem>
                <RadioGroupItem value="cod_advance">
                  <span className="font-heading font-semibold text-sm">COD (Requires 20% Advance Payment)</span>
                  <span className="block text-[11px] text-text-secondary font-body mt-0.5">Pay a 20% advance of **{formatCurrency(totals.advanceMinor)}** now. Pay remaining balance **{formatCurrency(totals.balanceDueMinor)}** on delivery.</span>
                </RadioGroupItem>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Right Column: Order summary & Submit */}
        <div className="space-y-6">
          <div className="bg-bg-secondary p-6 rounded-card border border-border-light shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wide">
              Review Selections
            </h3>

            {/* Products summary list */}
            <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
              {comboGroups.map((group) => (
                <div key={group.id} className="text-xs space-y-1">
                  <p className="font-semibold font-heading text-text-primary uppercase">{group.comboName}</p>
                  <ul className="text-text-secondary list-disc pl-4 space-y-0.5">
                    {group.items.map((it) => (
                      <li key={it.lineId} className="truncate">
                        {it.productName} ({it.size}/{it.colorName})
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="border-t border-border-light pt-4 space-y-3 text-xs text-text-secondary font-body">
              <div className="flex justify-between">
                <span>Combo base subtotal:</span>
                <span>{formatCurrency(totals.subtotalMinor)}</span>
              </div>
              {totals.discountMinor > 0 && (
                <div className="flex justify-between text-brand-primary font-semibold">
                  <span>Deduction ({coupon?.code}):</span>
                  <span>-{formatCurrency(totals.discountMinor)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Courier Charges:</span>
                <span>{formatCurrency(totals.shippingMinor)}</span>
              </div>

              {selectedPaymentMethod === "cod_advance" ? (
                <>
                  <div className="border-t border-border-light pt-3 flex justify-between font-heading font-bold text-xs text-brand-primary">
                    <span>COD Advance Payable (20%):</span>
                    <span>{formatCurrency(totals.advanceMinor)}</span>
                  </div>
                  <div className="flex justify-between font-heading font-bold text-xs text-text-primary">
                    <span>Balance Due on Delivery:</span>
                    <span>{formatCurrency(totals.balanceDueMinor)}</span>
                  </div>
                </>
              ) : (
                <div className="border-t border-border-light pt-3 flex justify-between font-heading font-extrabold text-sm text-brand-primary">
                  <span>Payable Upfront:</span>
                  <span>{formatCurrency(totals.grandTotalMinor)}</span>
                </div>
              )}
            </div>

            {/* Return policy checkbox (mandatory) */}
            <div className="space-y-2 border-t border-border-light pt-4">
              <div className="flex gap-2 items-start">
                <Checkbox
                  id="policyAccepted"
                  onCheckedChange={(checked) => setValue("policyAccepted", checked === true)}
                />
                <label htmlFor="policyAccepted" className="text-[10px] text-text-secondary leading-normal select-none cursor-pointer">
                  I understand that there are **no regular exchanges**. Damaged items require a parcel opening video and are subject to management approval.
                </label>
              </div>
              {errors.policyAccepted && (
                <p className="text-[9px] text-red-600 font-semibold">{errors.policyAccepted.message}</p>
              )}
            </div>

            {/* Place Order Trigger */}
            <Button type="submit" size="lg" className="w-full h-12 gap-2 uppercase font-bold tracking-wider cursor-pointer" disabled={isSubmitting}>
              <Lock className="h-4.5 w-4.5" />
              <span>{isSubmitting ? "Processing..." : "Place Mock Order"}</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
