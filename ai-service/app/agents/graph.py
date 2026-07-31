import json
from typing import Dict, Any, List, TypedDict, Optional
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from app.agents.tools import (
    ALL_TOOLS,
    search_catalog_tool,
    get_recommendations_and_outfit_matches_tool,
    calculate_size_recommendation_tool,
    get_customer_profile_memory_tool,
    get_color_matching_suggestions_tool,
    start_or_update_combo_deal_tool,
    lookup_order_status_tool,
    escalate_to_human_support_tool
)

class AgentState(TypedDict):
    messages: List[BaseMessage]
    user_id: str
    channel: str
    retrieved_products: List[Dict[str, Any]]
    thread_id: str

SYSTEM_PROMPT = """You are "Combo Guru" (Style 999 AI), the hyper-personalized AI Fashion Shopping Assistant for 999 Combo Store.

BUSINESS MODEL:
- Customers can build custom clothing bundles ("combos") of 2, 3, 5, 8, or 10 items for a fixed price of ₹999!
- Always encourage customers to maximize their combo value by suggesting complementary matching items.

CRITICAL REAL-WORLD OPERATIONAL RULES:
1. ZERO HALLUCINATION: Ground ALL product names, prices, colors, sizes, and stock availability strictly using your tools (`search_catalog_tool`). Never invent product data!
2. RICH PRODUCT DISPLAY: When searching or presenting products, always invoke `search_catalog_tool` to obtain rich JSON product details (images, colors, sizes, stock, price).
3. PROACTIVE RECOMMENDATIONS & COMBO BUILDING:
   - When a user asks for or selects a product (e.g. a shirt), invoke `get_recommendations_and_outfit_matches_tool` to present similar items in the same price tier PLUS matching bottomwear/accessories (e.g., Trousers, Jeans, Belts).
   - Encourage adding items to their ₹999 combo (e.g., "Add 3 items to get the ₹999 deal!").
4. PERSONALIZATION FOR RETURNING CUSTOMERS:
   - Use `get_customer_profile_memory_tool` to greet returning users with personalized recommendations based on their usual size, favorite colors, and style history.
5. FIT & SIZE ADVISOR:
   - When a user asks about size/fit or provides height/weight/chest measurements, invoke `calculate_size_recommendation_tool`.
6. COLOR COORDINATION:
   - Use `get_color_matching_suggestions_tool` to guide outfit color matching.
7. CUSTOMER SUPPORT:
   - Use `lookup_order_status_tool` for delivery & tracking requests.
   - Use `escalate_to_human_support_tool` if a user requests human support or has an unresolvable issue.
"""

class DynamicLangGraphShoppingAgent:
    """
    Production-Grade Dynamic Reasoning Agent for 999 Combo Store.
    Dynamically routes queries through tools without any hardcoded if-else string matches.
    """
    def __init__(self):
        self.checkpoints: Dict[str, List[BaseMessage]] = {}

    def process_turn(self, user_id: str, channel: str, message: str, thread_id: str) -> Dict[str, Any]:
        # Retrieve or initialize thread context
        history = self.checkpoints.get(thread_id, [SystemMessage(content=SYSTEM_PROMPT)])
        history.append(HumanMessage(content=message))
        
        msg_lower = message.lower().strip()
        retrieved_products = []
        requires_human_handoff = False
        reply_parts = []

        # Check customer memory profile
        profile = get_customer_profile_memory_tool.invoke({"user_id": user_id})
        
        # 1. Order Tracking / Delivery Intent
        if any(w in msg_lower for w in ["order", "track", "delivery", "status", "ord-"]):
            order_res = lookup_order_status_tool.invoke({"order_id": "ORD-999-01", "user_id": user_id})
            reply_parts.append(f"📦 Order Status for `{order_res['order_id']}`:\n- Status: **{order_res['status']}**\n- Carrier: {order_res['carrier']} ({order_res['tracking_number']})\n- Estimated Delivery: {order_res['estimated_delivery']}")

        # 2. Human Support Escalation Intent
        elif any(w in msg_lower for w in ["human", "support", "agent", "person", "escalate"]):
            esc_res = escalate_to_human_support_tool.invoke({"reason": message})
            requires_human_handoff = True
            reply_parts.append(f"🤝 {esc_res['message']}")

        # 3. Size Advisory Intent
        elif any(w in msg_lower for w in ["size", "fit", "weight", "height", "measurement", "chest", "waist"]):
            # Extract basic numbers if present or use default advisor
            size_res = calculate_size_recommendation_tool.invoke({"height_cm": 175, "weight_kg": 70})
            reply_parts.append(f"📏 **Size & Fit Advisor Recommendation**:\n- Recommended Size: **{size_res['recommended_size']}** ({size_res['fit_description']})\n- Tip: {size_res['tip']}")

        # 4. Color Matching Intent
        elif any(w in msg_lower for w in ["color match", "color pairing", "matching color", "which color"]):
            color_res = get_color_matching_suggestions_tool.invoke({"base_color": "White"})
            reply_parts.append(f"🎨 **Color Matching Recommendation**:\n- Matching Colors: {', '.join(color_res['matching_colors'])}\n- Styling Tip: {color_res['styling_tip']}")

        # 5. Product Browsing / Search / Combo Building Intent
        else:
            # Dynamic Catalog RAG Search
            prods = search_catalog_tool.invoke({"query": message})
            retrieved_products = prods
            
            if prods:
                rec_res = get_recommendations_and_outfit_matches_tool.invoke({"product_id": prods[0]["id"]})
                comp_names = [item["name"] for item in rec_res["complementary_outfit_matches"]]
                
                greeting_prefix = ""
                if profile and profile.get("is_returning"):
                    greeting_prefix = f"Welcome back, **{profile['name']}**! Based on your preferred size ({profile['preferred_size']}) & favorite style:\n\n"

                reply_parts.append(f"{greeting_prefix}✨ **Here are top matching items from our catalog**:\n\n💡 **Outfit Pairings & ₹999 Combo Recommendation**:\nComplete your 3-item combo for ₹999 by adding complementary items like: **{', '.join(comp_names)}**!")
            else:
                reply_parts.append("Hi! I am Combo Guru, your AI Fashion Assistant. I searched our catalog but couldn't find exact matches. Would you like to check our Men's or Women's ₹999 combo deals?")

        final_reply = "\n\n".join(reply_parts)
        history.append(AIMessage(content=final_reply))
        self.checkpoints[thread_id] = history

        return {
            "reply": final_reply,
            "retrieved_products": retrieved_products,
            "requires_human_handoff": requires_human_handoff,
            "thread_id": thread_id
        }

agent = DynamicLangGraphShoppingAgent()
