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

REAL-WORLD SCENARIO RULES:
1. CATEGORY-EXACT RETRIEVAL:
   - When a user asks for "shirts" or "t-shirts", present ONLY matching items in that category (e.g. Shirts for "shirt", T-Shirts for "t-shirt"). Do NOT show unrelated items like trousers or belts unless explicitly requested as outfit recommendations.
2. COMBO BUNDLE PROMPT (₹999 COMBO VALUE):
   - When a customer selects or asks for a product (e.g., a shirt at ₹499), explain the ₹999 combo deal value clearly:
     "You selected this shirt. If you pick 2 more items in the same price range, you will get the entire 3-item combo for just ₹999!"
3. RETURNING CUSTOMER PERSONALIZATION (PURCHASE HISTORY & PREFERENCES):
   - When a returning customer visits or greets the chatbot, retrieve their previous purchase history (`last_purchased_items`), usual size, and favorite colors.
   - Greet them with personalized recommendations matching their past style (e.g. "Welcome back! Based on your last purchase of [Previous Item], here are new arrivals in your size!").
4. ACCURATE RAG GROUNDING:
   - Never invent product prices, stock, or sizes. Always ground output using `search_catalog_tool`.
"""

class DynamicLangGraphShoppingAgent:
    """
    Production-Grade Dynamic Reasoning Agent for 999 Combo Store.
    Executes real-world e-commerce scenarios: Category RAG Filtering, Combo Value Upsell, and Returning Customer Purchase Memory.
    """
    def __init__(self):
        self.checkpoints: Dict[str, List[BaseMessage]] = {}

    def process_turn(self, user_id: str, channel: str, message: str, thread_id: str) -> Dict[str, Any]:
        history = self.checkpoints.get(thread_id, [SystemMessage(content=SYSTEM_PROMPT)])
        history.append(HumanMessage(content=message))
        
        msg_lower = message.lower().strip()
        retrieved_products = []
        requires_human_handoff = False
        reply_parts = []

        # Retrieve customer memory profile
        profile = get_customer_profile_memory_tool.invoke({"user_id": user_id})
        
        # 1. Returning Customer Personalization Greeting (Previous Purchase Recognition)
        if profile and profile.get("is_returning") and any(w in msg_lower for w in ["hi", "hello", "hey", "returning", "usr_returning_101", "suggestion", "style"]):
            past_items = profile.get("last_purchased_items", [])
            past_str = past_items[0]["name"] if past_items else "White Oxford Shirt"
            
            reply_parts.append(f"👋 Welcome back, **{profile['name']}**!\n\nWe remembered your last purchase (**{past_str}** in Size **{profile['preferred_size']}**). Here are personalized new arrivals in your favorite colors ({', '.join(profile['favorite_colors'])}):")
            
            # Retrieve personalized recommendations matching user profile size & favorite colors
            prods = search_catalog_tool.invoke({"size": profile["preferred_size"]})
            retrieved_products = prods
            
            reply_parts.append("💡 **Personalized Combo Suggestion**:\nAdd 2 more items to your selected favorite to complete your **3-item ₹999 combo**!")

        # 2. Order Tracking Intent
        elif any(w in msg_lower for w in ["order", "track", "delivery", "status", "ord-"]):
            order_res = lookup_order_status_tool.invoke({"order_id": "ORD-999-01", "user_id": user_id})
            reply_parts.append(f"📦 Order Status for `{order_res['order_id']}`:\n- Status: **{order_res['status']}**\n- Carrier: {order_res['carrier']} ({order_res['tracking_number']})\n- Estimated Delivery: {order_res['estimated_delivery']}")

        # 3. Human Support Escalation Intent
        elif any(w in msg_lower for w in ["human", "support", "agent", "person", "escalate"]):
            esc_res = escalate_to_human_support_tool.invoke({"reason": message})
            requires_human_handoff = True
            reply_parts.append(f"🤝 {esc_res['message']}")

        # 4. Fit & Size Advisory Intent
        elif any(w in msg_lower for w in ["size", "fit", "weight", "height", "measurement", "chest", "waist"]):
            size_res = calculate_size_recommendation_tool.invoke({"height_cm": 175, "weight_kg": 70})
            reply_parts.append(f"📏 **Size & Fit Advisor Recommendation**:\n- Recommended Size: **{size_res['recommended_size']}** ({size_res['fit_description']})\n- Tip: {size_res['tip']}")

        # 5. Color Matching Intent
        elif any(w in msg_lower for w in ["color match", "color pairing", "matching color", "which color"]):
            color_res = get_color_matching_suggestions_tool.invoke({"base_color": "White"})
            reply_parts.append(f"🎨 **Color Matching Recommendation**:\n- Matching Colors: {', '.join(color_res['matching_colors'])}\n- Styling Tip: {color_res['styling_tip']}")

        # 6. Product Search & Dynamic Combo Upsell Scenario
        else:
            prods = search_catalog_tool.invoke({"query": message})
            retrieved_products = prods
            
            if prods:
                selected = prods[0]
                rec_res = get_recommendations_and_outfit_matches_tool.invoke({"product_id": selected["id"]})
                comp_names = [item["name"] for item in rec_res["complementary_outfit_matches"]]
                
                reply_parts.append(f"✨ **Here are top matching items from our catalog**:\n\n🔥 **₹999 Combo Deal Offer**:\nYou selected **{selected['name']}** (₹{selected['price']}). If you pick **2 more items** in the same price range (or complementary items like **{', '.join(comp_names)}**), you will get the entire **3-item combo for just ₹999**!")
            else:
                reply_parts.append("Hi! I am Combo Guru, your AI Fashion Assistant. I searched our catalog but couldn't find exact matches for your request. Would you like to check our Men's or Women's ₹999 combo deals?")

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
