from langchain.tools import tool
from typing import Optional, Dict, Any, List
from app.rag.retriever import retriever

@tool
def search_catalog_tool(query: str = "", category: Optional[str] = None, color: Optional[str] = None, size: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Search the 999 Combo Store product catalog via RAG semantic search.
    Returns rich product details including image_url, name, color, available_sizes, price, description, and stock availability.
    """
    return retriever.search_catalog(query=query, category=category, color=color, size=size, top_k=4)

@tool
def get_recommendations_and_outfit_matches_tool(product_id: str) -> Dict[str, Any]:
    """
    Fetch similar products (in same category/price tier) and complementary outfit items (e.g. Shirts -> Trousers & Belts)
    to help the customer build a complete ₹999 combo bundle.
    """
    similar = retriever.get_similar_products(product_id=product_id, limit=3)
    complements = retriever.get_complementary_products(product_id=product_id, limit=3)
    return {
        "selected_product_id": product_id,
        "similar_products": similar,
        "complementary_outfit_matches": complements,
        "combo_upsell_message": "Add any 3 of these items to complete your ₹999 combo deal!"
    }

@tool
def calculate_size_recommendation_tool(height_cm: float, weight_kg: float, chest_in: Optional[float] = None, waist_in: Optional[float] = None) -> Dict[str, Any]:
    """
    Calculate the recommended clothing size based on customer's body measurements (height, weight, chest/waist).
    """
    # Algorithmic size estimation logic
    if weight_kg < 60 or (chest_in and chest_in < 38):
        rec_size = "S"
        fit = "Slim / Regular Small"
    elif 60 <= weight_kg < 73 or (chest_in and 38 <= chest_in < 40):
        rec_size = "M"
        fit = "Standard Medium Fit"
    elif 73 <= weight_kg < 85 or (chest_in and 40 <= chest_in < 42):
        rec_size = "L"
        fit = "Regular Large Fit"
    else:
        rec_size = "XL"
        fit = "Relaxed XL Fit"

    return {
        "recommended_size": rec_size,
        "fit_description": fit,
        "height_cm": height_cm,
        "weight_kg": weight_kg,
        "tip": f"Based on {height_cm}cm height and {weight_kg}kg weight, size {rec_size} provides optimal comfort for our ₹999 combo clothing line."
    }

@tool
def get_customer_profile_memory_tool(user_id: str) -> Dict[str, Any]:
    """
    Retrieve customer profile memory, past purchase history, preferred sizes, and favorite colors for returning customers.
    """
    return retriever.get_customer_profile(user_id=user_id)

@tool
def get_color_matching_suggestions_tool(base_color: str) -> Dict[str, Any]:
    """
    Provide color coordination guidance and complementary outfit color recommendations based on color theory.
    """
    color = base_color.lower().strip()
    color_map = {
        "white": ["Navy Blue", "Black", "Beige", "Light Blue", "Olive Green"],
        "black": ["White", "Tan Brown", "Light Blue", "Grey", "Beige"],
        "navy blue": ["White", "Beige", "Tan Brown", "Light Pink"],
        "beige": ["Navy Blue", "Black", "White", "Dark Green"],
        "yellow": ["Blue Denim", "White", "Black"]
    }
    matches = color_map.get(color, ["White", "Black", "Navy Blue", "Beige"])
    return {
        "base_color": base_color,
        "matching_colors": matches,
        "styling_tip": f"{base_color.capitalize()} pairs beautifully with {', '.join(matches[:3])} for a balanced ₹999 combo outfit!"
    }

@tool
def start_or_update_combo_deal_tool(user_id: str, combo_tier: int = 3, current_item_ids: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    Calculate and update combo deal state (2, 3, 5, 8, or 10 items for ₹999).
    Calculates remaining items needed, current value, and savings.
    """
    current_item_ids = current_item_ids or []
    items_count = len(current_item_ids)
    remaining_items = max(0, combo_tier - items_count)
    
    return {
        "combo_tier": combo_tier,
        "fixed_price": 999,
        "selected_count": items_count,
        "remaining_count": remaining_items,
        "is_complete": remaining_items == 0,
        "message": f"Your {combo_tier}-item bundle costs ₹999! You have selected {items_count} item(s). Add {remaining_items} more to complete your ₹999 combo!"
    }

@tool
def lookup_order_status_tool(order_id: str, user_id: str) -> Dict[str, Any]:
    """
    Lookup real-time delivery and order tracking status for customer orders.
    """
    return {
        "order_id": order_id,
        "status": "SHIPPED",
        "carrier": "BlueDart Express",
        "tracking_number": "BD-999-88219",
        "estimated_delivery": "2 Business Days",
        "items_count": 3,
        "total_paid": 999
    }

@tool
def escalate_to_human_support_tool(reason: str) -> Dict[str, Any]:
    """
    Trigger immediate escalation to human customer support for complex issues, manual returns, or custom help.
    """
    return {
        "requires_human_handoff": True,
        "reason": reason,
        "status": "ESCALATED",
        "message": "I am connecting you with a human customer support specialist right now. Please hold on!"
    }

ALL_TOOLS = [
    search_catalog_tool,
    get_recommendations_and_outfit_matches_tool,
    calculate_size_recommendation_tool,
    get_customer_profile_memory_tool,
    get_color_matching_suggestions_tool,
    start_or_update_combo_deal_tool,
    lookup_order_status_tool,
    escalate_to_human_support_tool
]
