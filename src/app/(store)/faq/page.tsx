import Link from "next/link";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ArrowLeft, HelpCircle } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "Why are the clothing prices flat ₹999 for all combo tiers?",
      a: "Our core business model is selling clothing items in combo groups (packs of 2, 3, 5, 8, or 10 garments) directly from factory units. This allows us to offer bulk wholesale pricing. The base subtotal is always flat ₹999; only courier charges are billed separately depending on package weight.",
    },
    {
      q: "Can I mix Men's and Women's clothes in the same combo?",
      a: "Yes! Our active builder gives you total freedom to mix any Men's Shirts/Pants and Women's Ethnic/Western styles in the same pack. You can choose different sizes and colors for each slot.",
    },
    {
      q: "Why do you require a 20% advance payment for Cash on Delivery (COD)?",
      a: "To prevent fraudulent orders, fake details, and delivery refusals (which cost us heavy RTO courier fees), we require a 20% commitment advance payment. The remaining 80% plus shipping is paid at delivery.",
    },
    {
      q: "What is your return policy? Can I request a size exchange?",
      a: "Since products are highly discounted in wholesale combo sets, we do not accept regular size/color exchanges. We only accept return claims for packages damaged in transit. You must upload a continuous unboxing video showing the label and unpacking flow to file a claim.",
    },
    {
      q: "How can I track my package dispatch status?",
      a: "Visit our Track Order page in the header/footer navigation. Enter your Order ID (e.g. 999-123456) and registration phone number to see shipping milestone timelines.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 font-body">
      {/* Title & Back */}
      <div className="flex items-center gap-3 border-b border-border-light pb-4">
        <Link href="/" className="p-2 -ml-2 text-text-secondary hover:text-brand-primary active:scale-95 transition-transform">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-text-primary tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-text-secondary">
            Find answers to commonly asked questions about sizing, pricing, and policies.
          </p>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, idx) => (
          <AccordionItem key={idx} value={`faq-${idx}`}>
            <AccordionTrigger className="text-sm font-semibold font-heading text-left">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-xs text-text-secondary leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
