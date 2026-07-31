import numpy as np
from typing import List, Dict, Any, Optional

# Enriched product catalog representing real 999 Combo Store inventory
SEED_CATALOG = [
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
        "style_tags": ["Formal", "Casual", "Office", "Classic"],
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
        "style_tags": ["Casual", "Party", "Nightwear"],
        "complementary_categories": ["Jeans", "Chinos", "Belts"]
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
        "style_tags": ["Casual", "Summer", "Pastel"],
        "complementary_categories": ["Trousers", "Jeans", "Shorts"]
    },
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
        "style_tags": ["Casual", "Office", "Smart Casual"],
        "complementary_categories": ["Shirts", "T-Shirts", "Belts"]
    },
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
        "style_tags": ["Casual", "Streetwear", "Daily Wear"],
        "complementary_categories": ["Jeans", "Shorts", "Caps"]
    },
    {
        "id": "var_105",
        "product_id": "prod_4",
        "name": "Floral Print Summer Midi Dress",
        "category": "Women",
        "sub_category": "Dresses",
        "color": "Yellow",
        "available_sizes": ["XS", "S", "M"],
        "price": 599,
        "stock_qty": 0,  # Out of stock
        "image_url": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop",
        "short_description": "Lightweight breathable yellow floral midi summer dress with adjustable waist tie.",
        "style_tags": ["Casual", "Vacation", "Summer"],
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
        "style_tags": ["Casual", "Daily Wear", "Trending"],
        "complementary_categories": ["Tops", "T-Shirts", "Jackets"]
    },
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
        "style_tags": ["Formal", "Casual", "Essential"],
        "complementary_categories": ["Shirts", "Trousers", "Jeans"]
    }
]

# Customer Profile Memory Store (Real-world purchase history and preferences)
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
    Dynamic RAG catalog retriever with category-exact filtering, outfit matching, and returning customer purchase history memory.
    """
    def __init__(self):
        self.catalog = SEED_CATALOG

    def search_catalog(self, query: str = "", category: Optional[str] = None, color: Optional[str] = None, size: Optional[str] = None, top_k: int = 4) -> List[Dict[str, Any]]:
        query_lower = query.lower().strip()
        query_words = set(query_lower.split()) if query_lower else set()
        
        # Category Intent Detection (Shirts vs T-Shirts vs Trousers vs Dresses vs Belts)
        detected_subcat = None
        if "t-shirt" in query_lower or "tshirt" in query_lower or "tee" in query_lower:
            detected_subcat = "T-Shirts"
        elif "shirt" in query_lower:
            detected_subcat = "Shirts"
        elif "trouser" in query_lower or "pant" in query_lower or "chino" in query_lower:
            detected_subcat = "Trousers"
        elif "jean" in query_lower or "denim" in query_lower:
            detected_subcat = "Jeans"
        elif "dress" in query_lower:
            detected_subcat = "Dresses"
        elif "belt" in query_lower:
            detected_subcat = "Belts"

        matches = []
        for item in self.catalog:
            # Filter by subcategory if intent detected or passed
            if detected_subcat and item["sub_category"].lower() != detected_subcat.lower():
                continue
            if category and category.lower() not in item["category"].lower() and category.lower() not in item["sub_category"].lower():
                continue
            if color and color.lower() not in item["color"].lower():
                continue
            if size and size not in item["available_sizes"]:
                continue
                
            item_text = f"{item['name']} {item['category']} {item['sub_category']} {item['color']} {' '.join(item['style_tags'])} {item['short_description']}".lower()
            item_words = set(item_text.split())
            
            if query_words:
                overlap = len(query_words.intersection(item_words))
                score = overlap / (len(query_words) + 0.1)
            else:
                score = 1.0
                
            matches.append((score, item))
            
        matches.sort(key=lambda x: x[0], reverse=True)
        return [item for score, item in matches[:top_k]]

    def get_similar_products(self, product_id: str, limit: int = 3) -> List[Dict[str, Any]]:
        target = self.get_by_id(product_id)
        if not target:
            return []
            
        similar = []
        for item in self.catalog:
            if item["id"] != target["id"] and item["sub_category"] == target["sub_category"]:
                similar.append(item)
        return similar[:limit]

    def get_complementary_products(self, product_id: str, limit: int = 3) -> List[Dict[str, Any]]:
        target = self.get_by_id(product_id)
        if not target:
            return []
            
        comp_categories = [c.lower() for c in target.get("complementary_categories", [])]
        complements = []
        for item in self.catalog:
            if item["id"] != target["id"] and item["sub_category"].lower() in comp_categories:
                complements.append(item)
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
