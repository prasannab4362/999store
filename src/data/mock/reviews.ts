export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  images?: string[];
}

export const mockReviews: Review[] = [
  {
    id: "rev-1",
    productId: "prod-m-shirt-1",
    customerName: "Prasanna",
    rating: 5,
    comment: "The emerald check shirt fits perfectly! The fabric is high-quality combed cotton and feels premium. Added it to my 3-item combo and couldn't be happier.",
    date: "2026-06-12",
    verifiedPurchase: true,
  },
  {
    id: "rev-2",
    productId: "prod-m-shirt-1",
    customerName: "Rohan Sharma",
    rating: 4,
    comment: "Very nice fabric, color is exactly as shown. Only thing is sleeve length is slightly long for me, but overall great for casual wear.",
    date: "2026-06-25",
    verifiedPurchase: true,
  },
  {
    id: "rev-3",
    productId: "prod-m-tshirt-1",
    customerName: "Aditya Sen",
    rating: 5,
    comment: "This graphic tee is super heavy! 240 GSM is real, print quality is top-notch. Def buying another combo to pick other designs.",
    date: "2026-07-02",
    verifiedPurchase: true,
  },
  {
    id: "rev-4",
    productId: "prod-w-top-1",
    customerName: "Priya Nair",
    rating: 4,
    comment: "Soft rayon, super flowy. Looks great on leggings. True to size, keyhole neck is a nice detail.",
    date: "2026-06-18",
    verifiedPurchase: true,
  },
  {
    id: "rev-5",
    productId: "prod-w-jeans-1",
    customerName: "Meera Patel",
    rating: 5,
    comment: "Finally wide leg jeans that actually fit my waist properly! Pure cotton rigid denim, does not feel cheap. Outstanding value in the 5-item combo.",
    date: "2026-06-30",
    verifiedPurchase: true,
  },
  {
    id: "rev-6",
    productId: "prod-m-vesti-1",
    customerName: "Karthik Srinivasan",
    rating: 5,
    comment: "Bought this set for Diwali. The gold border is neat and the cotton fabric is lightweight. Shirt fit is regular and comfortable.",
    date: "2026-07-05",
    verifiedPurchase: true,
  },
];
export const mockHomeReviews = [
  {
    id: "hrev-1",
    customerName: "Sanjay D.",
    rating: 5,
    comment: "I combined 3 shirts for work and 2 track pants for gym in the 5-item combo. Extremely affordable at ₹999. Best concept ever!",
    date: "2026-07-10",
    comboPurchased: "5 Items Combo",
  },
  {
    id: "hrev-2",
    customerName: "Deepika R.",
    rating: 5,
    comment: "No return policy for minor changes made me hesitant, but when my parcel arrived with a small tear, I sent my parcel opening video and they immediately processed my claim! Solid management review.",
    date: "2026-07-08",
    comboPurchased: "10 Items Combo",
  },
  {
    id: "hrev-3",
    customerName: "Vijay S.",
    rating: 4,
    comment: "Excellent shirts and vestis. COD option requires 20% advance which is fair. Highly satisfied with the shipping speed.",
    date: "2026-07-01",
    comboPurchased: "3 Items Combo",
  },
];
