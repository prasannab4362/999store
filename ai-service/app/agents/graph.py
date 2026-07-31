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
    options: List[Dict[str, str]]
    cart: List[Dict[str, Any]]
    thread_id: str

SYSTEM_PROMPT = """You are "Combo Guru" (Style 999 AI), the official 4-step AI Fashion Shopping Assistant for 999 Combo Store.

4-STEP SHOPPING JOURNEY STEPS:
Step 1: GREETING & INTENT DISCOVERY
- Greet customer politely ("Welcome to 999 Combo Store!").
- Present guided category choices (Shirts, T-Shirts, Trousers, Jeans, Dresses).

Step 2: GUIDED SPECIFICATION (Size, Color, Price, Style)
- Ask specific preferences (Size, Color, Price Range, Style).

Step 3: FILTERED PRODUCT DISPLAY (Image + Details)
- Present matching product cards with Image + Details.

Step 4: ADD TO CART, ₹999 COMBO VALUE PROMPT & PAY
- When 1 item is added to cart: "You added this item! Pick 2 more items to get the 3-item bundle for ₹999!"
- Provide interactive "Review Cart & Pay" options.
"""

class DynamicLangGraphShoppingAgent:
    """
    4-Step Stateful E-Commerce Shopping Journey Agent.
    Manages session state, interactive option chips, product catalog RAG search, and live Cart state.
    """
    def __init__(self):
        self.checkpoints: Dict[str, List[BaseMessage]] = {}
        self.user_carts: Dict[str, List[Dict[str, Any]]] = {}

    def process_turn(self, user_id: str, channel: str, message: str, thread_id: str) -> Dict[str, Any]:
        history = self.checkpoints.get(thread_id, [SystemMessage(content=SYSTEM_PROMPT)])
        history.append(HumanMessage(content=message))
        
        msg_lower = message.lower().strip()
        cart = self.user_carts.get(user_id, [])
        retrieved_products = []
        options = []
        requires_human_handoff = False
        reply_text = ""

        # Retrieve customer memory profile
        profile = get_customer_profile_memory_tool.invoke({"user_id": user_id})

        # Step 4: Handle "Add to Combo Cart" action
        if msg_lower.startswith("add ") and ("to combo" in msg_lower or "cart" in msg_lower):
            item_name = message.replace("Add ", "").replace(" to my combo", "").replace(" to combo", "").strip()
            found_item = search_catalog_tool.invoke({"query": item_name})
            added_product = found_item[0] if found_item else {"name": item_name, "price": 499, "color": "Selected", "available_sizes": ["M"]}
            
            cart.append(added_product)
            self.user_carts[user_id] = cart
            cart_count = len(cart)
            
            if cart_count == 1:
                reply_text = f"🛒 **Added '{added_product['name']}' to your Cart!**\n\n🎉 **₹999 Combo Value Offer**:\nYou have 1 item in your cart. If you pick **2 more items** in the same price range, you will get the entire **3-item combo for just ₹999**!\n\nWould you like to browse more Shirts, T-Shirts, or Trousers to complete your combo?"
                options = [
                    {"label": "👔 Add 2 More Shirts", "value": "Show me casual shirts"},
                    {"label": "👖 Add Trousers", "value": "Show me trousers"},
                    {"label": "🛍️ Review Cart & Pay", "value": "View my cart"}
                ]
            else:
                remaining = max(0, 3 - cart_count)
                reply_text = f"🛒 **Added to Cart!** You now have **{cart_count} item(s)** in your ₹999 combo bundle.\n\n" + (f"Add **{remaining} more item** to complete your ₹999 combo!" if remaining > 0 else "🎉 Your 3-item ₹999 combo bundle is complete!")
                options = [
                    {"label": "🛍️ Review Cart & Pay", "value": "View my cart"},
                    {"label": "👕 Add More Items", "value": "Show me shirts"}
                ]

        # Step 4: Cart Review & Payment Checkout
        elif any(w in msg_lower for w in ["view my cart", "review cart", "checkout"]):
            if not cart:
                reply_text = "🛒 Your cart is currently empty! Let's pick some stylish clothes for your ₹999 combo bundle."
                options = [
                    {"label": "👔 Browse Shirts", "value": "Show me shirts"},
                    {"label": "👕 Browse T-Shirts", "value": "Show me t-shirts"}
                ]
            else:
                total_regular = sum(p.get("price", 499) for p in cart)
                final_combo_price = 999 if len(cart) >= 3 else total_regular
                items_str = "\n".join([f"{i+1}. **{p['name']}** ({p.get('color', 'Standard')}) - ₹{p.get('price', 499)}" for i, p in enumerate(cart)])
                
                reply_text = f"🛒 **Your Combo Cart Review**:\n\n{items_str}\n\n-------------------------------\n📦 **Total Items:** {len(cart)}\n💰 **Regular Price:** ₹{total_regular}\n🎉 **Combo Special Price:** **₹{final_combo_price}** + Courier Charges\n\nEverything is set! Click **Proceed to Pay** below to complete your order."
                options = [
                    {"label": "💳 Proceed to Pay (₹999)", "value": "Proceeding to checkout payment"},
                    {"label": "➕ Add More Items", "value": "Show me shirts"}
                ]

        # Payment Confirmation
        elif "proceeding to checkout" in msg_lower or "pay" in msg_lower and len(cart) > 0:
            reply_text = "💳 Redirecting to Secure Payment Gateway...\n\nThank you for shopping with **999 Combo Store**! Your order confirmation will be sent via SMS & WhatsApp."
            options = [{"label": "🛍️ Start New Order", "value": "Hi"}]

        # Step 1: Specific Product / Category Query (e.g. "Show me casual shirts for men", "white shirt") -> Execute RAG Search
        elif any(w in msg_lower for w in ["shirt", "t-shirt", "tshirt", "pant", "trouser", "jean", "dress", "belt"]):
            prods = search_catalog_tool.invoke({"query": message})
            retrieved_products = prods
            
            if prods:
                reply_text = f"✨ **Here are top matching products from our catalog**:\n\nSelect any item below to add it to your ₹999 combo cart!"
                options = [
                    {"label": "🛍️ Review Cart & Pay", "value": "View my cart"},
                    {"label": "🎨 Color Matching Suggestions", "value": "What colors pair well with white shirt"}
                ]
            else:
                reply_text = "I searched our catalog but couldn't find exact matches for your request. Would you like to browse our Men's or Women's ₹999 combo collections?"
                options = [
                    {"label": "👔 Browse Shirts", "value": "Show me shirts"},
                    {"label": "👕 Browse T-Shirts", "value": "Show me t-shirts"}
                ]

        # Returning Customer Persona Greeting
        elif profile and profile.get("is_returning") and any(w in msg_lower for w in ["returning", "usr_returning_101", "match my style"]):
            past_items = profile.get("last_purchased_items", [])
            past_str = past_items[0]["name"] if past_items else "White Oxford Shirt"
            
            reply_text = f"👋 Welcome back, **{profile['name']}**!\n\nWe remembered your last purchase (**{past_str}** in Size **{profile['preferred_size']}**). Here are personalized recommendations in your favorite size & style!"
            prods = search_catalog_tool.invoke({"size": profile["preferred_size"]})
            retrieved_products = prods
            options = [
                {"label": "👔 Browse All Shirts", "value": "Show me shirts"},
                {"label": "🛍️ Review Cart", "value": "View my cart"}
            ]

        # Step 1: General Greeting
        elif any(w in msg_lower for w in ["hi", "hello", "hey", "start", "welcome"]):
            greeting_prefix = ""
            if profile and profile.get("is_returning"):
                greeting_prefix = f"Welcome back, **{profile['name']}**! "
                
            reply_text = f"👋 **{greeting_prefix}Welcome to 999 Combo Store!** I am **Combo Guru**, your AI Shopping Assistant.\n\nWhat type of clothing are you looking for today?"
            options = [
                {"label": "👔 Formal & Casual Shirts", "value": "I am looking for shirts"},
                {"label": "👕 Streetwear T-Shirts", "value": "I am looking for t-shirts"},
                {"label": "👖 Chinos & Trousers", "value": "I am looking for trousers"},
                {"label": "👗 Women Dresses & Jeans", "value": "I am looking for women clothing"}
            ]

        # Step 2: Category Request Prompt
        elif any(w in msg_lower for w in ["looking for shirts", "looking for t-shirts", "looking for trousers", "looking for women"]):
            category = "Shirts" if "shirts" in msg_lower else ("T-Shirts" if "t-shirts" in msg_lower else ("Trousers" if "trousers" in msg_lower else "Women"))
            reply_text = f"Great choice! Let's narrow down your **{category}** preferences.\n\nPlease select your preferred **Size** and **Color** below:"
            options = [
                {"label": "⚪ White (Size M)", "value": f"Show me white {category} size M"},
                {"label": "⚫ Black (Size L)", "value": f"Show me black {category} size L"},
                {"label": "🔵 Navy Blue (Size L)", "value": f"Show me navy blue {category}"},
                {"label": "📏 Use Size Advisor", "value": "Help me pick my size"}
            ]

        # Step 2: Size Advisor Tool
        elif any(w in msg_lower for w in ["size advisor", "pick my size", "height", "weight", "measurement"]):
            size_res = calculate_size_recommendation_tool.invoke({"height_cm": 175, "weight_kg": 70})
            reply_text = f"📏 **Size & Fit Advisor Recommendation**:\n- Recommended Size: **{size_res['recommended_size']}** ({size_res['fit_description']})\n- Tip: {size_res['tip']}\n\nNow, let's view matching products in Size **{size_res['recommended_size']}**!"
            options = [
                {"label": "👔 Show Shirts in Size " + size_res['recommended_size'], "value": f"Show me shirts size {size_res['recommended_size']}"},
                {"label": "👕 Show T-Shirts in Size " + size_res['recommended_size'], "value": f"Show me t-shirts size {size_res['recommended_size']}"}
            ]

        # Human Support Escalation
        elif any(w in msg_lower for w in ["human", "support", "agent", "escalate"]):
            esc_res = escalate_to_human_support_tool.invoke({"reason": message})
            requires_human_handoff = True
            reply_text = f"🤝 {esc_res['message']}"

        # Order Tracking
        elif any(w in msg_lower for w in ["order", "track", "ord-"]):
            order_res = lookup_order_status_tool.invoke({"order_id": "ORD-999-01", "user_id": user_id})
            reply_text = f"📦 Order Status for `{order_res['order_id']}`:\n- Status: **{order_res['status']}**\n- Estimated Delivery: {order_res['estimated_delivery']}"

        # Default RAG Search Fallback
        else:
            prods = search_catalog_tool.invoke({"query": message})
            retrieved_products = prods
            if prods:
                reply_text = f"✨ **Here are top matching products from our catalog**:"
                options = [
                    {"label": "🛍️ Review Cart & Pay", "value": "View my cart"}
                ]
            else:
                reply_text = "I searched our catalog but couldn't find exact matches. Would you like to browse our Men's or Women's ₹999 combo collections?"
                options = [
                    {"label": "👔 Browse Shirts", "value": "Show me shirts"},
                    {"label": "👕 Browse T-Shirts", "value": "Show me t-shirts"}
                ]

        final_reply = reply_text
        history.append(AIMessage(content=final_reply))
        self.checkpoints[thread_id] = history

        return {
            "reply": final_reply,
            "retrieved_products": retrieved_products,
            "options": options,
            "cart": cart,
            "requires_human_handoff": requires_human_handoff,
            "thread_id": thread_id
        }

agent = DynamicLangGraphShoppingAgent()
