import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";

interface BulkRow {
  name: string;
  subcategory: string;
  gender: string;
  imageUrl: string;
  fabric: string;
  fit: string;
  comboTiers: string; // "combo-10|combo-5"
  colorName: string;
  colorHex: string;
  size: string;
  stock: number;
  pattern?: string;
  description?: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function generateCode(name: string) {
  const prefix = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w.slice(0, 2).toUpperCase())
    .join("");
  return `${prefix}-${Date.now().toString(36).toUpperCase().slice(-4)}`;
}

// POST /api/admin/products/bulk-upload
// Body: { rows: BulkRow[] }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rows: BulkRow[] = body.rows;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "No rows provided. Send { rows: [...] }." },
        { status: 400 }
      );
    }

    // Group rows by product name (multiple rows = multiple variants for same product)
    const productMap = new Map<string, { meta: BulkRow; variants: BulkRow[] }>();
    for (const row of rows) {
      if (!row.name) continue;
      const key = row.name.trim().toLowerCase();
      if (!productMap.has(key)) {
        productMap.set(key, { meta: row, variants: [] });
      }
      productMap.get(key)!.variants.push(row);
    }

    const created: string[] = [];
    const errors: string[] = [];

    for (const [, { meta, variants }] of productMap) {
      try {
        const productCode = generateCode(meta.name);
        const slug = `${slugify(meta.name)}-${productCode.toLowerCase()}`;
        const comboTierIds = meta.comboTiers
          ? meta.comboTiers.split("|").map((t) => t.trim()).filter(Boolean)
          : ["combo-10", "combo-8", "combo-5", "combo-3", "combo-2"];

        await prisma.product.create({
          data: {
            slug,
            productCode,
            name: meta.name.trim(),
            shortName: meta.name.trim().slice(0, 35),
            subcategory: meta.subcategory || "Clothing",
            gender: meta.gender || "unisex",
            fabric: meta.fabric || "100% Cotton",
            fit: meta.fit || "Regular Fit",
            pattern: meta.pattern || "Solid",
            description: meta.description || `Premium ${meta.name} from 999 Store.`,
            comboTierIds,
            variants: {
              create: variants.map((v) => ({
                sku: `${productCode}-${v.colorName.slice(0, 3).toUpperCase()}-${v.size}-${Date.now().toString(36)}`,
                colorName: v.colorName || "Black",
                colorHex: v.colorHex || "#000000",
                size: v.size || "M",
                stock: Number(v.stock) || 50,
                enabled: true,
              })),
            },
          },
        });

        created.push(meta.name);
      } catch (err: any) {
        errors.push(`${meta.name}: ${err?.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      created: created.length,
      failed: errors.length,
      createdNames: created,
      errors,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Bulk upload failed." },
      { status: 500 }
    );
  }
}

// GET /api/admin/products/bulk-upload — return CSV template
export async function GET() {
  const template = [
    "name,subcategory,gender,imageUrl,fabric,fit,comboTiers,colorName,colorHex,size,stock,pattern,description",
    "Slim Cargo Pants,Pants,men,https://images.unsplash.com/photo-1519238359922-989348752efb?w=600,100% Cotton,Regular Fit,combo-10|combo-5,Black,#000000,M,50,Solid,Premium cargo pants",
    "Slim Cargo Pants,Pants,men,https://images.unsplash.com/photo-1519238359922-989348752efb?w=600,100% Cotton,Regular Fit,combo-10|combo-5,Navy,#1E3A8A,L,40,Solid,Premium cargo pants",
    "Floral Wrap Dress,Dresses,women,https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600,Rayon,Relaxed Fit,combo-8|combo-5|combo-3,Red,#DC2626,S,30,Floral,Beautiful floral wrap dress",
  ].join("\n");

  return new Response(template, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="999store-products-template.csv"',
    },
  });
}
