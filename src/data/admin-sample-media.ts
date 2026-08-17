export interface SampleMediaItem {
  id: string;
  title: string;
  category: "Shirts" | "T-Shirts" | "Chudidar Sets" | "Tops" | "Pants" | "Video";
  gender?: "men" | "women" | "unisex";
  url: string;
  thumbnail?: string;
  aspectRatio?: string;
  description?: string;
}

export const SAMPLE_IMAGES: SampleMediaItem[] = [
  // Men's Shirts
  {
    id: "img-shirt-1",
    title: "Emerald Check Casual Shirt",
    category: "Shirts",
    gender: "men",
    url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
    description: "Premium cotton emerald green button-down casual shirt",
  },
  {
    id: "img-shirt-2",
    title: "Classic Crisp White Formal Shirt",
    category: "Shirts",
    gender: "men",
    url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80",
    description: "Crisp white tailored Egyptian cotton formal shirt",
  },
  {
    id: "img-shirt-3",
    title: "Sandstone Linen Cotton Shirt",
    category: "Shirts",
    gender: "men",
    url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    description: "Breathable sand beige relaxed linen button shirt",
  },
  {
    id: "img-shirt-4",
    title: "Navy Blue Formal Oxford Shirt",
    category: "Shirts",
    gender: "men",
    url: "https://images.unsplash.com/photo-1620012253295-c15c429f66bf?w=800&q=80",
    description: "Royal navy spread collar textured formal shirt",
  },

  // Men's T-Shirts
  {
    id: "img-tee-1",
    title: "Midnight Black Graphic Tee",
    category: "T-Shirts",
    gender: "men",
    url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
    description: "Heavyweight drop-shoulder oversized graphic tee",
  },
  {
    id: "img-tee-2",
    title: "Classic White Crewneck Tee",
    category: "T-Shirts",
    gender: "men",
    url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
    description: "Minimalist combed organic cotton white t-shirt",
  },
  {
    id: "img-tee-3",
    title: "Classic Olive Green Polo Tee",
    category: "T-Shirts",
    gender: "men",
    url: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&q=80",
    description: "Pique knit collar olive green polo shirt",
  },

  // Women's Chudidar & Ethnic Sets
  {
    id: "img-chudidar-1",
    title: "Banarasi Silk Festive Chudidar Set",
    category: "Chudidar Sets",
    gender: "women",
    url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
    description: "Gold mustard jacquard silk kurta with embroidered dupatta",
  },
  {
    id: "img-chudidar-2",
    title: "Teal Green Rayon Chudidar Set",
    category: "Chudidar Sets",
    gender: "women",
    url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
    description: "Soft flowing teal rayon printed ethnic set with matching pants",
  },
  {
    id: "img-chudidar-3",
    title: "Pastel Pink Festive Kurta Set",
    category: "Chudidar Sets",
    gender: "women",
    url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80",
    description: "Soft rose pastel cotton kurta set with zari border work",
  },

  // Women's Tops
  {
    id: "img-top-1",
    title: "Rosewood Printed Rayon Top",
    category: "Tops",
    gender: "women",
    url: "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800&q=80",
    description: "Bohemian floral printed rayon casual summer top",
  },
  {
    id: "img-top-2",
    title: "Olive Linen Sleeveless Crop Top",
    category: "Tops",
    gender: "women",
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    description: "Chic minimalist olive linen crop top for warm weather",
  },
  {
    id: "img-top-3",
    title: "Ivory Schiffli Cotton Long Top",
    category: "Tops",
    gender: "women",
    url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80",
    description: "Delicate schiffli lace embroidery ivory longline top",
  },

  // Pants & Jeans
  {
    id: "img-pant-1",
    title: "Indigo Wide Leg Denim Jeans",
    category: "Pants",
    gender: "women",
    url: "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&q=80",
    description: "High-rise relaxed vintage wash indigo denim trousers",
  },
  {
    id: "img-pant-2",
    title: "Twill Khaki Stretch Chino Pant",
    category: "Pants",
    gender: "men",
    url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    description: "Comfort flexible stretch cotton twill casual trousers",
  },
  {
    id: "img-pant-3",
    title: "Classic Slate Formal Trousers",
    category: "Pants",
    gender: "men",
    url: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
    description: "Pleat-front tailored charcoal slate formal dress pant",
  },
];

export const SAMPLE_VIDEOS: SampleMediaItem[] = [
  {
    id: "vid-1",
    title: "Fashion Runway & Dress Showcase (Reel 1)",
    category: "Video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40166-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=400&q=80",
    description: "Dynamic 4K fashion model showcase video loop",
  },
  {
    id: "vid-2",
    title: "Urban Style & Outfit Motion Reel (Reel 2)",
    category: "Video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-modelling-a-yellow-and-black-outfit-39845-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
    description: "Trendy outfit styling and movement reel",
  },
  {
    id: "vid-3",
    title: "Streetwear & Jacket Posing Showcase (Reel 3)",
    category: "Video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-model-posing-in-a-leather-jacket-and-sunglasses-41005-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80",
    description: "Modern apparel 360 styling and posture video",
  },
  {
    id: "vid-4",
    title: "Traditional Ethnic Dress Motion (Reel 4)",
    category: "Video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-woman-in-a-traditional-dress-41315-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80",
    description: "Elegant festive attire drape and motion video",
  },
];

export const QUICK_SAMPLE_PRODUCTS = [
  {
    name: "Royal Emerald Check Cotton Casual Shirt",
    subcategory: "Shirts",
    gender: "men" as const,
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-model-posing-in-a-leather-jacket-and-sunglasses-41005-large.mp4",
    fabric: "100% Breathable Combed Cotton",
    fit: "Modern Slim Fit",
    description: "Engineered with 100% fine cotton weave with signature check detailing, curved hem, and mother-of-pearl buttons. Ideal for casual outings and smart workplace dressing.",
    variants: [
      { size: "S", colorName: "Emerald Green", colorHex: "#059669", stock: 50 },
      { size: "M", colorName: "Emerald Green", colorHex: "#059669", stock: 50 },
      { size: "L", colorName: "Emerald Green", colorHex: "#059669", stock: 50 },
      { size: "XL", colorName: "Emerald Green", colorHex: "#059669", stock: 50 },
      { size: "L", colorName: "Navy Check", colorHex: "#1E3A8A", stock: 40 },
    ],
  },
  {
    name: "Banarasi Silk Festive Chudidar Set",
    subcategory: "Chudidar Sets",
    gender: "women" as const,
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-woman-in-a-traditional-dress-41315-large.mp4",
    fabric: "Art Banarasi Silk & Zari Weave",
    fit: "Straight Festive Fit",
    description: "Regal 3-piece ethnic set including a rich gold jacquard woven kurta, comfortable tonal churidar bottoms, and a lightweight floral zari bordered dupatta.",
    variants: [
      { size: "S", colorName: "Mustard Gold", colorHex: "#D4AF37", stock: 45 },
      { size: "M", colorName: "Mustard Gold", colorHex: "#D4AF37", stock: 50 },
      { size: "L", colorName: "Mustard Gold", colorHex: "#D4AF37", stock: 50 },
      { size: "XL", colorName: "Mustard Gold", colorHex: "#D4AF37", stock: 35 },
      { size: "M", colorName: "Royal Ruby", colorHex: "#991B1B", stock: 40 },
    ],
  },
  {
    name: "Midnight Black Oversized Drop-Shoulder Tee",
    subcategory: "T-Shirts",
    gender: "men" as const,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-modelling-a-yellow-and-black-outfit-39845-large.mp4",
    fabric: "240 GSM Heavyweight Terry Cotton",
    fit: "Oversized Street Fit",
    description: "Ultra-comfortable 240 GSM pre-shrunk cotton tee featuring a relaxed drop shoulder silhouette and ribbed collar that retains shape wash after wash.",
    variants: [
      { size: "S", colorName: "Midnight Black", colorHex: "#000000", stock: 60 },
      { size: "M", colorName: "Midnight Black", colorHex: "#000000", stock: 60 },
      { size: "L", colorName: "Midnight Black", colorHex: "#000000", stock: 60 },
      { size: "XL", colorName: "Midnight Black", colorHex: "#000000", stock: 50 },
    ],
  },
  {
    name: "Rosewood Printed Rayon Boho Top",
    subcategory: "Tops",
    gender: "women" as const,
    imageUrl: "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40166-large.mp4",
    fabric: "100% Breathable Rayon Viscose",
    fit: "Relaxed Flowy Fit",
    description: "Effortlessly chic bohemian printed top tailored from airy rayon with delicate smocked cuffs and a notched neckline.",
    variants: [
      { size: "S", colorName: "Rosewood Floral", colorHex: "#9F1239", stock: 40 },
      { size: "M", colorName: "Rosewood Floral", colorHex: "#9F1239", stock: 50 },
      { size: "L", colorName: "Rosewood Floral", colorHex: "#9F1239", stock: 50 },
      { size: "XL", colorName: "Rosewood Floral", colorHex: "#9F1239", stock: 30 },
    ],
  },
];
