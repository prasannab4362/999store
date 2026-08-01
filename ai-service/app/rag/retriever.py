import re
import numpy as np
from typing import List, Dict, Any, Optional

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
    Dynamic RAG catalog retriever supporting attribute filtering, tag matching, and text relevance scoring.
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
        results = []

        for item in self.catalog:
            score = 0
            
            # Dynamic category matching
            if category:
                cat_lower = category.lower()
                if cat_lower in item["category"].lower() or cat_lower in item["sub_category"].lower():
                    score += 4

            # Dynamic color matching
            if color and color.lower() in item["color"].lower():
                score += 4

            # Dynamic size matching
            if size and any(s.lower() == size.lower() for s in item["available_sizes"]):
                score += 3

            # Dynamic price range matching
            if price_max and item["price"] <= price_max:
                score += 2

            # Dynamic text query token matching
            if query_lower:
                tokens = [t for t in re.findall(r'\b\w+\b', query_lower) if len(t) > 2]
                for token in tokens:
                    if token in item["name"].lower():
                        score += 3
                    if token in item["short_description"].lower():
                        score += 2
                    if token in item["color"].lower():
                        score += 3
                    if any(token in tag.lower() for tag in item.get("style_tags", [])):
                        score += 2
                    if token in item["sub_category"].lower():
                        score += 3

            if score > 0 or not query_lower:
                results.append((score, item))

        results.sort(key=lambda x: x[0], reverse=True)
        matched_items = [item for score, item in results]
        return matched_items[:top_k] if matched_items else list(self.catalog[:top_k])

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
