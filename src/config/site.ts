export const siteConfig = {
  name: "999 Combo Store",
  shortName: "999 Combo",
  description: "Build your own men's, women's or mixed fashion combo. Choose your styles, sizes and available colours.",
  currency: "INR",
  locale: "en-IN",
  country: "India",
  supportEmail: "support@999combostore.com",
  supportPhone: "+91 99999 99999",
  whatsappNumber: "+91 99999 99999",
  socialLinks: {
    facebook: "https://facebook.com/999combostore",
    instagram: "https://instagram.com/999combostore",
    twitter: "https://twitter.com/999combostore",
  },
  cod: {
    enabled: true,
    advancePercentage: 20,
    advanceBasis: "subtotal_after_discount" as const,
  },
  policies: {
    regularExchangeAllowed: false,
    damageVideoRequired: true,
    damageClaimManagementApprovalRequired: true,
    courierExtra: true,
    defaultShippingChargeMinor: 12000, // ₹120 in minor units
  },
};

export type SiteConfig = typeof siteConfig;
