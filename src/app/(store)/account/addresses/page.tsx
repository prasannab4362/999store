"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus, Check } from "lucide-react";
import { toast } from "sonner";

// Zod schema
const addressSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  addressLine1: z.string().min(5, "Address must be at least 5 characters"),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  state: z.string().min(2, "State is required"),
  pinCode: z.string().regex(/^\d{6}$/, "Pin code must be exactly 6 digits"),
  type: z.enum(["home", "work", "other"]),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface SavedAddress extends AddressFormValues {
  id: string;
  isDefault: boolean;
}

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = React.useState<SavedAddress[]>([]);
  const [isEditing, setIsEditing] = React.useState<string | null>(null); // address id or "new"
  const [session, setSession] = React.useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      district: "",
      state: "",
      pinCode: "",
      type: "home",
    },
  });

  // Load addresses & session
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = JSON.parse(localStorage.getItem("999-store-addresses") || "[]");
      setAddresses(stored);

      const storedSession = JSON.parse(localStorage.getItem("999-store-session") || "null");
      setSession(storedSession);
      if (storedSession && stored.length === 0) {
        // Prepopulate with a default address if empty
        const defaultAddr: SavedAddress = {
          id: "addr-default",
          fullName: storedSession.name,
          phone: storedSession.phone,
          addressLine1: "123 High Street, T-Nagar",
          addressLine2: "Apartment 4B",
          landmark: "Opposite Post Office",
          city: "Chennai",
          district: "Chennai",
          state: "Tamil Nadu",
          pinCode: "600017",
          type: "home",
          isDefault: true,
        };
        const initList = [defaultAddr];
        localStorage.setItem("999-store-addresses", JSON.stringify(initList));
        setAddresses(initList);
      }
    }
  }, []);

  const saveToLocalStorage = (list: SavedAddress[]) => {
    localStorage.setItem("999-store-addresses", JSON.stringify(list));
    setAddresses(list);
  };

  const handleEditClick = (addr: SavedAddress) => {
    setIsEditing(addr.id);
    setValue("fullName", addr.fullName);
    setValue("phone", addr.phone);
    setValue("addressLine1", addr.addressLine1);
    setValue("addressLine2", addr.addressLine2 || "");
    setValue("landmark", addr.landmark || "");
    setValue("city", addr.city);
    setValue("district", addr.district);
    setValue("state", addr.state);
    setValue("pinCode", addr.pinCode);
    setValue("type", addr.type);
  };

  const handleDelete = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    if (addresses.find((a) => a.id === id)?.isDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }
    saveToLocalStorage(updated);
    toast.success("Address deleted successfully!");
  };

  const handleSetDefault = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    saveToLocalStorage(updated);
    toast.success("Default address updated!");
  };

  const handleAddNewClick = () => {
    setIsEditing("new");
    reset({
      fullName: session?.name || "",
      phone: session?.phone || "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      district: "",
      state: "",
      pinCode: "",
      type: "home",
    });
  };

  const onSubmit = (data: AddressFormValues) => {
    let updatedList: SavedAddress[];

    if (isEditing === "new") {
      const newAddress: SavedAddress = {
        ...data,
        id: `addr-${Date.now()}`,
        isDefault: addresses.length === 0,
      };
      updatedList = [...addresses, newAddress];
      toast.success("New address added successfully!");
    } else {
      updatedList = addresses.map((a) =>
        a.id === isEditing
          ? {
              ...a,
              ...data,
            }
          : a
      );
      toast.success("Address details updated successfully!");
    }

    saveToLocalStorage(updatedList);
    setIsEditing(null);
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex items-center justify-between border-b border-border-light pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold font-heading text-text-primary uppercase tracking-tight">
            MY SAVED ADDRESSES
          </h1>
          <p className="text-xs text-text-secondary">
            Manage your default shipment address options.
          </p>
        </div>

        {isEditing === null && (
          <Button size="sm" onClick={handleAddNewClick} className="gap-1 cursor-pointer">
            <Plus className="h-4 w-4" />
            <span>Add New</span>
          </Button>
        )}
      </div>

      {isEditing !== null ? (
        /* Form view */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl bg-bg-secondary/20 p-5 rounded-promo border border-border-light">
          <h3 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wider mb-2">
            {isEditing === "new" ? "Add New Address" : "Edit Address Details"}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Full Name</label>
              <Input type="text" {...register("fullName")} />
              {errors.fullName && <p className="text-[10px] text-red-600">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Mobile Number (Indian)</label>
              <Input type="tel" {...register("phone")} />
              {errors.phone && <p className="text-[10px] text-red-600">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-text-secondary">Address Line 1</label>
              <Input type="text" {...register("addressLine1")} />
              {errors.addressLine1 && <p className="text-[10px] text-red-600">{errors.addressLine1.message}</p>}
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-text-secondary">Address Line 2 (Optional)</label>
              <Input type="text" {...register("addressLine2")} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Landmark (Optional)</label>
              <Input type="text" {...register("landmark")} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Pin Code (6 digits)</label>
              <Input type="text" {...register("pinCode")} />
              {errors.pinCode && <p className="text-[10px] text-red-600">{errors.pinCode.message}</p>}
            </div>
            <div className="grid grid-cols-3 gap-2 sm:col-span-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">City</label>
                <Input type="text" {...register("city")} />
                {errors.city && <p className="text-[10px] text-red-600">{errors.city.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">District</label>
                <Input type="text" {...register("district")} />
                {errors.district && <p className="text-[10px] text-red-600">{errors.district.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">State</label>
                <Input type="text" {...register("state")} />
                {errors.state && <p className="text-[10px] text-red-600">{errors.state.message}</p>}
              </div>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-text-secondary block">Address Type</label>
              <div className="flex gap-3 mt-1">
                {(["home", "work", "other"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setValue("type", t)}
                    className={`px-4 py-1.5 rounded-full border text-xs font-bold font-heading capitalize cursor-pointer transition-colors ${
                      watch("type") === t
                        ? "border-brand-primary bg-brand-primary-soft text-brand-primary"
                        : "border-border-light bg-transparent hover:bg-bg-secondary text-text-secondary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-border-light pt-4 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsEditing(null)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Address
            </Button>
          </div>
        </form>
      ) : (
        /* Address Cards list view */
        <div className="space-y-4">
          {addresses.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`border rounded-promo p-5 bg-white shadow-sm flex flex-col justify-between space-y-4 transition-all relative ${
                    addr.isDefault ? "border-brand-primary/40 ring-1 ring-brand-primary-soft" : "border-border-light hover:border-border-medium"
                  }`}
                >
                  <div className="space-y-1.5 text-xs text-text-secondary">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold font-heading uppercase tracking-wide bg-bg-secondary text-text-primary border border-border-light">
                        {addr.type}
                      </span>
                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-brand-primary bg-brand-primary-soft px-2 py-0.5 rounded-full font-heading">
                          <Check className="h-3 w-3" />
                          <span>DEFAULT</span>
                        </span>
                      )}
                    </div>
                    <p className="font-heading font-extrabold text-sm text-text-primary">{addr.fullName}</p>
                    <p>{addr.addressLine1}</p>
                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                    {addr.landmark && <p>Landmark: {addr.landmark}</p>}
                    <p>{addr.city}, {addr.state} - {addr.pinCode}</p>
                    <p>Phone: {addr.phone}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-border-light pt-3">
                    {!addr.isDefault ? (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-[10px] text-brand-primary hover:underline font-bold font-heading cursor-pointer"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-[10px] text-text-muted font-semibold select-none">
                        Default address
                      </span>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(addr)}
                        className="text-text-secondary hover:text-brand-primary p-1 cursor-pointer"
                        aria-label="Edit address"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        className="text-text-secondary hover:text-red-500 p-1 cursor-pointer"
                        aria-label="Delete address"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-promo border border-dashed border-border-medium p-12 text-center text-xs text-text-muted">
              No addresses saved yet. Add your default address below.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
