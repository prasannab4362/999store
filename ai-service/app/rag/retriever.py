import numpy as np
from typing import List, Dict, Any

# Mock catalog data representing seed products for 999 Combo Store
SEED_PRODUCTS = [
    {
        "id": "var_101",
        "product_id": "prod_1",
        "name": "Classic Slim Fit Cotton Shirt - White / M",
        "category": "Men",
        "price": 499,
        "stock_qty": 25,
        "description": "Premium 100% cotton slim fit formal white shirt for men, size M. Breathable fabric."
    },
    {
        "id": "var_102",
        "product_id": "prod_1",
        "name": "Classic Slim Fit Cotton Shirt - Black / L",
        "category": "Men",
        "price": 499,
        "stock_qty": 18,
        "description": "Black casual cotton shirt for men slim fit size L. Easy iron, double-stitched."
    },
    {
        "id": "var_103",
        "product_id": "prod_2",
        "name": "Chino Trousers - Navy Blue / 32",
        "category": "Men",
        "price": 699,
        "stock_qty": 12,
        "description": "Stretchable navy blue chino trousers size 32 waist. Perfect combo pairing item."
    },
    {
        "id": "var_104",
        "product_id": "prod_3",
        "name": "Graphic Print Oversized T-Shirt - Beige / L",
        "category": "Men",
        "price": 399,
        "stock_qty": 30,
        "description": "Streetwear style beige oversized graphic tee for men. Heavyweight 240 GSM cotton."
    },
    {
        "id": "var_105",
        "product_id": "prod_4",
        "name": "Floral Summer Dress - Yellow / S",
        "category": "Women",
        "price": 599,
        "stock_qty": 0,  # Out of stock example
        "description": "Lightweight yellow floral print midi summer dress for women size S."
    },
    {
        "id": "var_106",
        "product_id": "prod_5",
        "name": "High-Waist Denim Jeans - Light Blue / 28",
        "category": "Women",
        "price": 799,
        "stock_qty": 8,
        "description": "Women high waist stretch light blue denim jeans size 28."
    },
    {
        "id": "var_107",
        "product_id": "prod_6",
        "name": "Leather Dress Belt - Tan / Free Size",
        "category": "Accessories",
        "price": 299,
        "stock_qty": 40,
        "description": "Genuine leather tan brown pin buckle belt for men and women."
    }
]

class VectorStoreRetriever:
    """
    In-memory Vector Store retriever supporting cosine similarity for pgvector simulation / prototyping.
    Uses lightweight TF-IDF / keyword similarity embedding fallback for rapid deterministic execution.
    """
    def __init__(self):
        self.products = SEED_PRODUCTS

    def search(self, query: str, category: str = None, top_k: int = 4) -> List[Dict[str, Any]]:
        query_words = set(query.lower().split())
        scored_results = []
        
        for item in self.products:
            if category and item["category"].lower() != category.lower():
                continue
                
            item_text = f"{item['name']} {item['category']} {item['description']}".lower()
            item_words = set(item_text.split())
            
            # Simple keyword match score calculation
            overlap = len(query_words.intersection(item_words))
            score = overlap / (len(query_words) + 0.1)
            
            scored_results.append((score, item))
            
        # Sort by score descending
        scored_results.sort(key=lambda x: x[0], reverse=True)
        return [item for score, item in scored_results[:top_k]]

    def get_by_id(self, variant_id: str) -> Dict[str, Any]:
        for item in self.products:
            if item["id"] == variant_id:
                return item
        return None

retriever = VectorStoreRetriever()
