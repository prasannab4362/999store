from langchain.tools import tool
from typing import Optional, Dict, Any, List
from app.rag.retriever import retriever

@tool
def search_products(query: str, category: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Search the catalog for products using semantic search.
    Args:
        query: Description of what the customer is looking for (e.g. 'slim fit white shirt', 'blue jeans')
        category: Optional category filter ('Men', 'Women', 'Accessories')
    """
    results = retriever.search(query=query, category=category, top_k=4)
    return results

@tool
def check_stock(product_variant_id: str) -> Dict[str, Any]:
    """
    Check stock quantity and availability for a specific product variant ID.
    Args:
        product_variant_id: Unique variant identifier (e.g. 'var_101')
    """
    item = retriever.get_by_id(product_variant_id)
    if not item:
        return {"found": False, "error": f"Product variant '{product_variant_id}' not found."}
    
    in_stock = item["stock_qty"] > 0
    return {
        "found": True,
        "variant_id": item["id"],
        "name": item["name"],
        "stock_qty": item["stock_qty"],
        "in_stock": in_stock
    }

@tool
def get_order_status(order_id: str, user_id: str) -> Dict[str, Any]:
    """
    Fetch status for a specific order.
    Args:
        order_id: Unique order ID (e.g. 'ORD-999-01')
        user_id: Unique customer ID
    """
    # Mock order lookup
    if order_id.startswith("ORD"):
        return {
            "order_id": order_id,
            "status": "SHIPPED",
            "estimated_delivery": "2 Days",
            "items_count": 3,
            "total_amount": 999
        }
    return {
        "error": f"Order {order_id} not found."
    }

@tool
def start_combo_session(user_id: str, combo_size: int = 3) -> Dict[str, Any]:
    """
    Initiate a new 999 Combo deal building session.
    Args:
        user_id: Customer user ID
        combo_size: Number of items in the combo deal (e.g. 2, 3, or 5 items for ₹999)
    """
    if combo_size not in [2, 3, 5, 8, 10]:
        return {"error": "Invalid combo tier. Choose 2, 3, 5, 8, or 10 items."}
    
    session_id = f"cs_{user_id[:6]}_{combo_size}"
    return {
        "success": True,
        "combo_session_id": session_id,
        "target_count": combo_size,
        "price": 999,
        "message": f"Started {combo_size}-item combo deal for ₹999! Select your items."
    }

ALL_TOOLS = [search_products, check_stock, get_order_status, start_combo_session]
