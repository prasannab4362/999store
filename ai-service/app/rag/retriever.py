import re
import numpy as np
from typing import List, Dict, Any, Optional

SEED_CATALOG = [
    # ==================== MEN'S SHIRTS ====================
    {
        "id": "var_101",
        "product_id": "prod_1",
        "name": "Classic Slim Fit Oxford Shirt",
        "category": "Men",
        "sub_category": "Shirts",
        "color": "White",
        "available_sizes": ["S", "M", "L", "XL"],
        "price": 499,
        "stock_qty": 25,
        "image_url": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop",
        "short_description": "Premium 100% breathable cotton slim fit formal white shirt. Perfect for office or casual combo.",
        "style_tags": ["Formal", "Casual", "Office", "Classic", "Men"],
        "complementary_categories": ["Trousers", "Jeans", "Belts"]
    },
    {
        "id": "var_102",
        "product_id": "prod_1",
        "name": "Classic Slim Fit Oxford Shirt",
        "category": "Men",
        "sub_category": "Shirts",
        "color": "Black",
        "available_sizes": ["M", "L", "XL"],
        "price": 499,
        "stock_qty": 18,
        "image_url": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop",
        "short_description": "Sleek double-stitched black casual cotton shirt. Easy-iron wrinkle-resistant fabric.",
        "style_tags": ["Casual", "Party", "Nightwear", "Men"],
        "complementary_categories": ["Jeans", "Chinos", "Belts"]
    },
    {
        "id": "var_109",
        "product_id": "prod_8",
        "name": "Classic Navy Blue Oxford Shirt",
        "category": "Men",
        "sub_category": "Shirts",
        "color": "Navy Blue",
        "available_sizes": ["S", "M", "L", "XL"],
        "price": 499,
        "stock_qty": 20,
        "image_url": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop",
        "short_description": "Versatile navy blue cotton oxford shirt for formal or casual combo outfits.",
        "style_tags": ["Formal", "Casual", "Office", "Classic", "Men"],
        "complementary_categories": ["Trousers", "Jeans", "Belts"]
    },
    {
        "id": "var_108",
        "product_id": "prod_7",
        "name": "Pastel Pink Linen Casual Shirt",
        "category": "Men",
        "sub_category": "Shirts",
        "color": "Pink",
        "available_sizes": ["S", "M", "L"],
        "price": 499,
        "stock_qty": 15,
        "image_url": "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&auto=format&fit=crop",
        "short_description": "Lightweight pastel pink linen shirt for summer casual outings.",
        "style_tags": ["Casual", "Summer", "Pastel", "Men"],
        "complementary_categories": ["Trousers", "Jeans", "Shorts"]
    },
    {
        "id": "var_110",
        "product_id": "prod_9",
        "name": "Beige Mandarin Collar Casual Shirt",
        "category": "Men",
        "sub_category": "Shirts",
        "color": "Beige",
        "available_sizes": ["S", "M", "L", "XL"],
        "price": 549,
        "stock_qty": 14,
        "image_url": "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=500&auto=format&fit=crop",
        "short_description": "Relaxed fit beige mandarin collar shirt in breathable cotton-linen blend. Great for brunch or weekend outings.",
        "style_tags": ["Casual", "Summer", "Relaxed", "Men"],
        "complementary_categories": ["Trousers", "Jeans", "Shorts"]
    },
    {
        "id": "var_111",
        "product_id": "prod_10",
        "name": "Sky Blue Spread Collar Formal Shirt",
        "category": "Men",
        "sub_category": "Shirts",
        "color": "Sky Blue",
        "available_sizes": ["S", "M", "L", "XL"],
        "price": 599,
        "stock_qty": 22,
        "image_url": "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&auto=format&fit=crop",
        "short_description": "Crisp sky blue spread collar formal shirt. Wrinkle-free Egyptian cotton for boardroom confidence.",
        "style_tags": ["Formal", "Office", "Business", "Men"],
        "complementary_categories": ["Trousers", "Belts", "Ties"]
    },
    {
        "id": "var_112",
        "product_id": "prod_11",
        "name": "Olive Green Utility Casual Shirt",
        "category": "Men",
        "sub_category": "Shirts",
        "color": "Olive Green",
        "available_sizes": ["M", "L", "XL", "XXL"],
        "price": 549,
        "stock_qty": 16,
        "image_url": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop",
        "short_description": "Rugged olive green utility shirt with double chest pockets. Perfect for adventure and casual wear.",
        "style_tags": ["Casual", "Utility", "Adventure", "Men"],
        "complementary_categories": ["Jeans", "Shorts", "Belts"]
    },
    {
        "id": "var_113",
        "product_id": "prod_12",
        "name": "Maroon Slim Fit Party Shirt",
        "category": "Men",
        "sub_category": "Shirts",
        "color": "Maroon",
        "available_sizes": ["S", "M", "L", "XL"],
        "price": 699,
        "stock_qty": 10,
        "image_url": "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=500&auto=format&fit=crop",
        "short_description": "Bold maroon slim fit satin-touch party shirt. Stand out at evening events and celebrations.",
        "style_tags": ["Party", "Festive", "Evening", "Men"],
        "complementary_categories": ["Trousers", "Belts", "Shoes"]
    },
    {
        "id": "var_114",
        "product_id": "prod_13",
        "name": "Grey Checked Cotton Casual Shirt",
        "category": "Men",
        "sub_category": "Shirts",
        "color": "Grey",
        "available_sizes": ["S", "M", "L", "XL"],
        "price": 449,
        "stock_qty": 28,
        "image_url": "https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=500&auto=format&fit=crop",
        "short_description": "Soft grey checked pattern cotton shirt. Versatile for layering or standalone casual look.",
        "style_tags": ["Casual", "Layering", "Daily Wear", "Men"],
        "complementary_categories": ["Jeans", "Trousers", "Jackets"]
    },
    {
        "id": "var_115",
        "product_id": "prod_14",
        "name": "Premium White Formal Double Cuff Shirt",
        "category": "Men",
        "sub_category": "Shirts",
        "color": "White",
        "available_sizes": ["M", "L", "XL"],
        "price": 799,
        "stock_qty": 8,
        "image_url": "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=500&auto=format&fit=crop",
        "short_description": "Luxury premium white double-cuff formal shirt. 100% Supima cotton with French cuff detail.",
        "style_tags": ["Formal", "Premium", "Office", "Wedding", "Men"],
        "complementary_categories": ["Trousers", "Belts", "Cufflinks"]
    },
    {
        "id": "var_116",
        "product_id": "prod_15",
        "name": "Floral Print Beach Casual Shirt",
        "category": "Men",
        "sub_category": "Shirts",
        "color": "Navy Blue",
        "available_sizes": ["M", "L", "XL"],
        "price": 399,
        "stock_qty": 20,
        "image_url": "https://images.unsplash.com/photo-1580657018950-c7f7d6a6d990?w=500&auto=format&fit=crop",
        "short_description": "Trendy navy blue floral print relaxed-fit beach shirt. Rayon fabric for maximum summer comfort.",
        "style_tags": ["Casual", "Beach", "Summer", "Vacation", "Men"],
        "complementary_categories": ["Shorts", "Sunglasses", "Sandals"]
    },

    # ==================== MEN'S T-SHIRTS ====================
    {
        "id": "var_104",
        "product_id": "prod_3",
        "name": "Streetwear Graphic Oversized Tee",
        "category": "Men",
        "sub_category": "T-Shirts",
        "color": "Beige",
        "available_sizes": ["M", "L", "XL", "XXL"],
        "price": 399,
        "stock_qty": 30,
        "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop",
        "short_description": "Heavyweight 240 GSM organic cotton streetwear tee in trending beige tone.",
        "style_tags": ["Casual", "Streetwear", "Daily Wear", "Men"],
        "complementary_categories": ["Jeans", "Shorts", "Caps"]
    },
    {
        "id": "var_117",
        "product_id": "prod_16",
        "name": "Essential Round Neck Tee",
        "category": "Men",
        "sub_category": "T-Shirts",
        "color": "Black",
        "available_sizes": ["S", "M", "L", "XL", "XXL"],
        "price": 299,
        "stock_qty": 50,
        "image_url": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop",
        "short_description": "Everyday essential black round neck tee. 180 GSM bio-washed cotton for ultra-soft feel.",
        "style_tags": ["Casual", "Daily Wear", "Essential", "Men"],
        "complementary_categories": ["Jeans", "Shorts", "Jackets"]
    },
    {
        "id": "var_118",
        "product_id": "prod_16",
        "name": "Essential Round Neck Tee",
        "category": "Men",
        "sub_category": "T-Shirts",
        "color": "White",
        "available_sizes": ["S", "M", "L", "XL", "XXL"],
        "price": 299,
        "stock_qty": 45,
        "image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop",
        "short_description": "Classic white round neck tee. 180 GSM bio-washed cotton. Wardrobe essential for every man.",
        "style_tags": ["Casual", "Daily Wear", "Essential", "Layering", "Men"],
        "complementary_categories": ["Jeans", "Shorts", "Jackets"]
    },
    {
        "id": "var_119",
        "product_id": "prod_17",
        "name": "Polo Sport Collar T-Shirt",
        "category": "Men",
        "sub_category": "T-Shirts",
        "color": "Navy Blue",
        "available_sizes": ["S", "M", "L", "XL"],
        "price": 499,
        "stock_qty": 22,
        "image_url": "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&auto=format&fit=crop",
        "short_description": "Smart navy blue polo tee with ribbed collar and button placket. Cotton piqué for breathable comfort.",
        "style_tags": ["Casual", "Sport", "Smart Casual", "Men"],
        "complementary_categories": ["Chinos", "Jeans", "Sneakers"]
    },
    {
        "id": "var_120",
        "product_id": "prod_18",
        "name": "Acid Wash Vintage Oversized Tee",
        "category": "Men",
        "sub_category": "T-Shirts",
        "color": "Grey",
        "available_sizes": ["M", "L", "XL", "XXL"],
        "price": 449,
        "stock_qty": 18,
        "image_url": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop",
        "short_description": "Retro acid-wash grey oversized tee. Drop shoulders and relaxed fit for streetwear vibes.",
        "style_tags": ["Streetwear", "Vintage", "Casual", "Trendy", "Men"],
        "complementary_categories": ["Jeans", "Shorts", "Caps"]
    },
    {
        "id": "var_121",
        "product_id": "prod_19",
        "name": "Olive Henley Neck Tee",
        "category": "Men",
        "sub_category": "T-Shirts",
        "color": "Olive Green",
        "available_sizes": ["S", "M", "L", "XL"],
        "price": 399,
        "stock_qty": 25,
        "image_url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop",
        "short_description": "Olive green henley neck tee with button placket. Soft slub cotton for a textured casual look.",
        "style_tags": ["Casual", "Layering", "Smart Casual", "Men"],
        "complementary_categories": ["Jeans", "Chinos", "Jackets"]
    },
    {
        "id": "var_130",
        "product_id": "prod_26",
        "name": "Striped Crew Neck Tee",
        "category": "Men",
        "sub_category": "T-Shirts",
        "color": "White",
        "available_sizes": ["S", "M", "L", "XL"],
        "price": 349,
        "stock_qty": 35,
        "image_url": "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=500&auto=format&fit=crop",
        "short_description": "White crew neck tee with navy horizontal stripes. Nautical-inspired casual summer essential.",
        "style_tags": ["Casual", "Summer", "Nautical", "Men"],
        "complementary_categories": ["Shorts", "Jeans", "Sneakers"]
    },

    # ==================== MEN'S TROUSERS & CHINOS ====================
    {
        "id": "var_103",
        "product_id": "prod_2",
        "name": "Stretchable Chino Trousers",
        "category": "Men",
        "sub_category": "Trousers",
        "color": "Navy Blue",
        "available_sizes": ["30", "32", "34", "36"],
        "price": 699,
        "stock_qty": 12,
        "image_url": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&auto=format&fit=crop",
        "short_description": "Flex-stretch navy blue chino trousers. Ideal pairing item for white or pastel shirts.",
        "style_tags": ["Casual", "Office", "Smart Casual", "Men"],
        "complementary_categories": ["Shirts", "T-Shirts", "Belts"]
    },
    {
        "id": "var_122",
        "product_id": "prod_20",
        "name": "Slim Fit Formal Trousers",
        "category": "Men",
        "sub_category": "Trousers",
        "color": "Black",
        "available_sizes": ["28", "30", "32", "34", "36"],
        "price": 699,
        "stock_qty": 20,
        "image_url": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop",
        "short_description": "Sharp black slim-fit formal trousers. Flat front with pressed crease for a polished boardroom look.",
        "style_tags": ["Formal", "Office", "Business", "Men"],
        "complementary_categories": ["Shirts", "Belts", "Shoes"]
    },
    {
        "id": "var_123",
        "product_id": "prod_21",
        "name": "Relaxed Fit Cotton Chinos",
        "category": "Men",
        "sub_category": "Trousers",
        "color": "Beige",
        "available_sizes": ["30", "32", "34", "36"],
        "price": 599,
        "stock_qty": 18,
        "image_url": "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=500&auto=format&fit=crop",
        "short_description": "Comfortable beige relaxed-fit cotton chinos. Elasticated waistband for all-day ease.",
        "style_tags": ["Casual", "Relaxed", "Weekend", "Men"],
        "complementary_categories": ["Shirts", "T-Shirts", "Sneakers"]
    },
    {
        "id": "var_124",
        "product_id": "prod_22",
        "name": "Tapered Fit Smart Trousers",
        "category": "Men",
        "sub_category": "Trousers",
        "color": "Grey",
        "available_sizes": ["28", "30", "32", "34"],
        "price": 749,
        "stock_qty": 14,
        "image_url": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop",
        "short_description": "Modern grey tapered-fit smart trousers. Versatile for office-to-dinner transitions.",
        "style_tags": ["Smart Casual", "Office", "Versatile", "Men"],
        "complementary_categories": ["Shirts", "Belts", "Loafers"]
    },
    {
        "id": "var_125",
        "product_id": "prod_23",
        "name": "Cargo Utility Trousers",
        "category": "Men",
        "sub_category": "Trousers",
        "color": "Olive Green",
        "available_sizes": ["30", "32", "34", "36", "38"],
        "price": 799,
        "stock_qty": 10,
        "image_url": "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=500&auto=format&fit=crop",
        "short_description": "Tactical olive green cargo trousers with 6-pocket design. Durable twill cotton for rugged outdoor wear.",
        "style_tags": ["Casual", "Utility", "Adventure", "Outdoor", "Men"],
        "complementary_categories": ["T-Shirts", "Jackets", "Boots"]
    },
    {
        "id": "var_126",
        "product_id": "prod_24",
        "name": "Slim Fit Jogger Trousers",
        "category": "Men",
        "sub_category": "Trousers",
        "color": "Black",
        "available_sizes": ["S", "M", "L", "XL"],
        "price": 499,
        "stock_qty": 30,
        "image_url": "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&auto=format&fit=crop",
        "short_description": "Athleisure black slim-fit jogger trousers with zippered ankles. Stretch fabric for gym-to-street comfort.",
        "style_tags": ["Casual", "Athleisure", "Sport", "Men"],
        "complementary_categories": ["T-Shirts", "Sneakers", "Hoodies"]
    },
    {
        "id": "var_127",
        "product_id": "prod_2",
        "name": "Stretchable Chino Trousers",
        "category": "Men",
        "sub_category": "Trousers",
        "color": "White",
        "available_sizes": ["30", "32", "34"],
        "price": 699,
        "stock_qty": 8,
        "image_url": "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=500&auto=format&fit=crop",
        "short_description": "Clean white flex-stretch chino trousers. A bold summer staple for the fashion-forward man.",
        "style_tags": ["Casual", "Summer", "Smart Casual", "Men"],
        "complementary_categories": ["Shirts", "T-Shirts", "Belts"]
    },

    # ==================== WOMEN'S ====================
    {
        "id": "var_105",
        "product_id": "prod_4",
        "name": "Floral Print Summer Midi Dress",
        "category": "Women",
        "sub_category": "Dresses",
        "color": "Yellow",
        "available_sizes": ["XS", "S", "M"],
        "price": 599,
        "stock_qty": 0,
        "image_url": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop",
        "short_description": "Lightweight breathable yellow floral midi summer dress with adjustable waist tie.",
        "style_tags": ["Casual", "Vacation", "Summer", "Women"],
        "complementary_categories": ["Handbags", "Accessories"]
    },
    {
        "id": "var_106",
        "product_id": "prod_5",
        "name": "High-Waist Stretch Denim Jeans",
        "category": "Women",
        "sub_category": "Jeans",
        "color": "Light Blue",
        "available_sizes": ["26", "28", "30", "32"],
        "price": 799,
        "stock_qty": 8,
        "image_url": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop",
        "short_description": "Comfortable high waist stretch denim jeans in classic light blue wash.",
        "style_tags": ["Casual", "Daily Wear", "Trending", "Women"],
        "complementary_categories": ["Tops", "T-Shirts", "Jackets"]
    },

    # ==================== ACCESSORIES ====================
    {
        "id": "var_107",
        "product_id": "prod_6",
        "name": "Genuine Leather Pin Buckle Belt",
        "category": "Accessories",
        "sub_category": "Belts",
        "color": "Tan Brown",
        "available_sizes": ["Free Size"],
        "price": 299,
        "stock_qty": 40,
        "image_url": "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500&auto=format&fit=crop",
        "short_description": "Handcrafted tan brown genuine leather belt with polished zinc buckle.",
        "style_tags": ["Formal", "Casual", "Essential", "Men"],
        "complementary_categories": ["Shirts", "Trousers", "Jeans"]
    },
    {
        "id": "var_128",
        "product_id": "prod_25",
        "name": "Classic Black Leather Belt",
        "category": "Accessories",
        "sub_category": "Belts",
        "color": "Black",
        "available_sizes": ["Free Size"],
        "price": 349,
        "stock_qty": 35,
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop",
        "short_description": "Sleek black genuine leather belt with brushed nickel buckle. Reversible design for dual styling.",
        "style_tags": ["Formal", "Casual", "Essential", "Men"],
        "complementary_categories": ["Shirts", "Trousers", "Shoes"]
    }
]

CUSTOMER_PROFILES = {
    "usr_returning_101": {
        "user_id": "usr_returning_101",
        "name": "Rahul Sharma",
        "is_returning": True,
        "preferred_size": "M",
        "favorite_colors": ["White", "Navy Blue"],
        "preferred_styles": ["Smart Casual", "Office"],
        "last_purchased_items": [
            {
                "id": "var_101",
                "name": "Classic Slim Fit Oxford Shirt - White / M",
                "category": "Shirts",
                "color": "White",
                "price": 499,
                "image_url": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop"
            }
        ],
        "reward_points": 150
    }
}

class CatalogRetriever:
    """
    Dynamic RAG catalog retriever supporting strict attribute filtering and text relevance scoring.
    Enforces exact attribute matching for Color, Category, Size, and Price Range.
    """
    def __init__(self):
        self.catalog = SEED_CATALOG

    def search_catalog(
        self,
        query: str = "",
        category: Optional[str] = None,
        color: Optional[str] = None,
        size: Optional[str] = None,
        price_max: Optional[float] = None,
        top_k: int = 4
    ) -> List[Dict[str, Any]]:
        query_lower = query.lower() if query else ""

        # Auto-extract parameters from query text if not explicitly passed
        if not color:
            for c in ["sky blue", "navy blue", "olive green", "white", "black", "blue", "pink", "beige", "yellow", "tan", "grey", "gray", "olive", "maroon"]:
                if c in query_lower:
                    color = "Sky Blue" if c == "sky blue" else ("Navy Blue" if c in ["navy blue", "blue", "navy"] else ("Olive Green" if c in ["olive green", "olive"] else ("Grey" if c in ["grey", "gray"] else ("Maroon" if c == "maroon" else c.capitalize()))))
                    break

        if not size:
            for s in ["xs", "s", "m", "l", "xl", "xxl", "30", "32", "34", "36", "28", "26"]:
                if re.search(r'\b' + s + r'\b', query_lower):
                    size = s.upper()
                    break

        if not category:
            # Note: "t-shirt" must be checked BEFORE "shirt" to prevent false substring matches
            for cat in ["t-shirt", "tshirt", "shirt", "trouser", "chino", "dress", "jean", "belt"]:
                if cat in query_lower:
                    if cat in ["t-shirt", "tshirt"]:
                        category = "T-Shirts"
                    elif cat == "shirt":
                        category = "Shirts"
                    elif cat in ["trouser", "chino"]:
                        category = "Trousers"
                    elif cat == "dress":
                        category = "Dresses"
                    elif cat == "jean":
                        category = "Jeans"
                    elif cat == "belt":
                        category = "Belts"
                    break

        filtered_items = []
        for item in self.catalog:
            # Category strict filter (Exact sub_category matching to prevent "Shirts" from matching "T-Shirts")
            if category:
                cat_l = category.lower().strip()
                item_sub_l = item["sub_category"].lower().strip()
                item_cat_l = item["category"].lower().strip()

                if cat_l in ["shirt", "shirts"]:
                    if item_sub_l != "shirts":
                        continue
                elif cat_l in ["t-shirt", "t-shirts", "tshirt", "tshirts"]:
                    if item_sub_l != "t-shirts":
                        continue
                elif cat_l in ["trouser", "trousers", "chino", "chinos"]:
                    if item_sub_l != "trousers":
                        continue
                else:
                    if cat_l not in item_cat_l and cat_l not in item_sub_l:
                        continue

            # Color strict filter
            if color:
                color_l = color.lower()
                item_color_l = item["color"].lower()
                if color_l not in item_color_l and item_color_l not in color_l:
                    continue

            # Size strict filter
            if size:
                if not any(s.lower() == size.lower() for s in item["available_sizes"]):
                    continue

            # Price max strict filter
            if price_max and item["price"] > price_max:
                continue

            filtered_items.append(item)

        # If strict filtering found exact matching items, return them!
        if filtered_items:
            return filtered_items[:top_k]

        # Category-safe fallback: If exact color/size match is not in stock, stay strictly within the requested category!
        fallback_items = []
        for item in self.catalog:
            if category:
                cat_l = category.lower().strip()
                item_sub_l = item["sub_category"].lower().strip()
                if cat_l in ["shirt", "shirts"] and item_sub_l == "shirts":
                    fallback_items.append(item)
                elif cat_l in ["t-shirt", "t-shirts"] and item_sub_l == "t-shirts":
                    fallback_items.append(item)
                elif cat_l in ["trouser", "trousers"] and item_sub_l == "trousers":
                    fallback_items.append(item)
            elif color and color.lower() in item["color"].lower():
                fallback_items.append(item)
        
        return fallback_items[:top_k] if fallback_items else list(self.catalog[:top_k])

    def get_similar_products(self, product_id: str, limit: int = 3) -> List[Dict[str, Any]]:
        target = self.get_by_id(product_id)
        if not target:
            return []
        similar = [item for item in self.catalog if item["id"] != target["id"] and item["sub_category"] == target["sub_category"]]
        return similar[:limit]

    def get_complementary_products(self, product_id: str, limit: int = 3) -> List[Dict[str, Any]]:
        target = self.get_by_id(product_id)
        if not target:
            return []
        comp_categories = [c.lower() for c in target.get("complementary_categories", [])]
        complements = [item for item in self.catalog if item["id"] != target["id"] and item["sub_category"].lower() in comp_categories]
        return complements[:limit]

    def get_by_id(self, variant_id: str) -> Optional[Dict[str, Any]]:
        for item in self.catalog:
            if item["id"] == variant_id:
                return item
        return None

    def get_customer_profile(self, user_id: str) -> Dict[str, Any]:
        return CUSTOMER_PROFILES.get(user_id, {
            "user_id": user_id,
            "is_returning": False,
            "preferred_size": None,
            "favorite_colors": [],
            "preferred_styles": [],
            "last_purchased_items": []
        })

retriever = CatalogRetriever()
