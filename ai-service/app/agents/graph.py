import json
from typing import Dict, Any, List, TypedDict, Optional
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from app.rag.retriever import retriever
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

STRICT 4-STEP SHOPPING FLOW MANDATE:
Step 1: Greeting -> Welcome customer and ask category. Provide options (Shirts, T-Shirts, Trousers, Dresses).
Step 2: Interactive Specification Prompt -> Ask for Size, Color, Price Range & Brand preferences BEFORE fetching catalog items, unless user explicitly specifies all details.
Step 3: Filtered Product Display -> Show matching visual product cards with image + details.
Step 4: Add to Cart & ₹999 Combo Upsell -> Explain 3-item combo for ₹999 deal value, provide Review Cart & Pay button.
"""

class DynamicLangGraphShoppingAgent:
    """
    Stateful E-Commerce Agent enforcing sequential 4-Step Guided Shopping Flow:
    1. Greeting -> 2. Ask Preferences (Size/Color/Price/Brand) -> 3. Show Products -> 4. Cart & Pay
    """
    def __init__(self):
        self.checkpoints: Dict[str, List[BaseMessage]] = {}
        self.user_carts: Dict[str, List[Dict[str, Any]]] = {}
        self.user_states: Dict[str, Dict[str, Any]] = {}

    def process_turn(self, user_id: str, channel: str, message: str, thread_id: str) -> Dict[str, Any]:
        history = self.checkpoints.get(thread_id, [SystemMessage(content=SYSTEM_PROMPT)])
        history.append(HumanMessage(content=message))
        
        msg_lower = message.lower().strip()
        cart = self.user_carts.get(user_id, [])
        state = self.user_states.get(user_id, {"step": "INIT", "category": None})
        
        options = []
        requires_human_handoff = False
        reply_text = ""

        profile = get_customer_profile_memory_tool.invoke({"user_id": user_id})

        # Pre-fetch catalog products for product queries
        prods = retriever.search_catalog(query=message)
        retrieved_products = prods

        # --- SUPPORT HANDOFF ESCALATION ---
        if any(w in msg_lower for w in ["human", "support", "agent", "person", "escalate"]):
            esc_res = escalate_to_human_support_tool.invoke({"reason": message})
            requires_human_handoff = True
            reply_text = f"🤝 {esc_res['message']}"

        # --- ORDER TRACKING ---
        elif any(w in msg_lower for w in ["order", "track", "ord-"]):
            order_res = lookup_order_status_tool.invoke({"order_id": "ORD-999-01", "user_id": user_id})
            reply_text = f"📦 Order Status for `{order_res['order_id']}`:\n- Status: **{order_res['status']}**\n- Estimated Delivery: {order_res['estimated_delivery']}"

        # --- STEP 4: ADD TO CART & COMBO UPSELL ---
        elif msg_lower.startswith("add ") and ("to combo" in msg_lower or "cart" in msg_lower):
            item_name = message.replace("Add ", "").replace(" to my combo", "").replace(" to combo", "").strip()
            found_item = retriever.search_catalog(query=item_name)
            added_product = found_item[0] if found_item else {"name": item_name, "price": 499, "color": "Selected", "available_sizes": ["M"]}
            
            cart.append(added_product)
            self.user_carts[user_id] = cart
            cart_count = len(cart)
            
            if cart_count == 1:
                reply_text = f"🛒 **Added '{added_product['name']}' to your Cart!**\n\n🎉 **₹999 Combo Value Offer**:\nYou have 1 item in your cart. If you pick **2 more items** in the same price range, you will get the entire **3-item combo for just ₹999**!\n\nWould you like to browse more Shirts, T-Shirts, or Trousers to complete your combo?"
                options = [
                    {"label": "👔 Add 2 More Shirts", "value": "Show me white shirt size M"},
                    {"label": "👖 Add Trousers", "value": "Show me trousers"},
                    {"label": "🛍️ Review Cart & Pay", "value": "View my cart"}
                ]
            else:
                remaining = max(0, 3 - cart_count)
                reply_text = f"🛒 **Added to Cart!** You now have **{cart_count} item(s)** in your ₹999 combo bundle.\n\n" + (f"Add **{remaining} more item** to complete your ₹999 combo!" if remaining > 0 else "🎉 Your 3-item ₹999 combo bundle is complete!")
                options = [
                    {"label": "🛍️ Review Cart & Pay", "value": "View my cart"},
                    {"label": "👕 Add More Items", "value": "I want shirts"}
                ]

        # --- STEP 4: CART REVIEW & PAY ---
        elif any(w in msg_lower for w in ["view my cart", "review cart", "checkout"]):
            if not cart:
                reply_text = "🛒 Your cart is currently empty! Let's pick some stylish clothes for your ₹999 combo bundle."
                options = [
                    {"label": "👔 Browse Shirts", "value": "I want shirts"},
                    {"label": "👕 Browse T-Shirts", "value": "I want t-shirts"}
                ]
            else:
                total_regular = sum(p.get("price", 499) for p in cart)
                final_combo_price = 999 if len(cart) >= 3 else total_regular
                items_str = "\n".join([f"{i+1}. **{p['name']}** ({p.get('color', 'Standard')}) - ₹{p.get('price', 499)}" for i, p in enumerate(cart)])
                
                reply_text = f"🛒 **Your Combo Cart Review**:\n\n{items_str}\n\n-------------------------------\n📦 **Total Items:** {len(cart)}\n💰 **Regular Price:** ₹{total_regular}\n🎉 **Combo Special Price:** **₹{final_combo_price}** + Courier Charges\n\nEverything is set! Click **Proceed to Pay** below to complete your order."
                options = [
                    {"label": "💳 Proceed to Pay (₹999)", "value": "Proceeding to checkout payment"},
                    {"label": "➕ Add More Items", "value": "I want shirts"}
                ]

        # Payment Confirmation
        elif "proceeding to checkout" in msg_lower or ("pay" in msg_lower and len(cart) > 0):
            reply_text = "💳 Redirecting to Secure Payment Gateway...\n\nThank you for shopping with **999 Combo Store**! Your order confirmation will be sent via SMS & WhatsApp."
            options = [{"label": "🛍️ Start New Order", "value": "Hi"}]
            self.user_carts[user_id] = []

        # --- STEP 1: GREETING & INITIAL INTENT ---
        elif any(w in msg_lower for w in ["hi", "hello", "hey", "start", "welcome"]):
            state["step"] = "AWAITING_CATEGORY"
            self.user_states[user_id] = state
            
            greeting_prefix = f"Welcome back, **{profile['name']}**! " if profile and profile.get("is_returning") else ""
            reply_text = f"👋 **{greeting_prefix}Welcome to 999 Combo Store!** I am **Combo Guru**, your AI Shopping Assistant.\n\nWhat type of clothing are you looking for today?"
            options = [
                {"label": "👔 Shirts (Formal & Casual)", "value": "I want shirts"},
                {"label": "👕 T-Shirts (Streetwear)", "value": "I want t-shirts"},
                {"label": "👖 Trousers & Chinos", "value": "I want trousers"},
                {"label": "👗 Women Dresses & Jeans", "value": "I want women clothing"}
            ]

        # --- STEP 2: CATEGORY SELECTED -> ASK FOR SIZE, COLOR, PRICE RANGE & BRAND ---
        elif msg_lower in ["i want shirts", "i want t-shirts", "i want trousers", "i want women clothing"]:
            category = "Shirts" if "shirts" in msg_lower else ("T-Shirts" if "t-shirts" in msg_lower else ("Trousers" if "trousers" in msg_lower else "Women Clothing"))
            state["step"] = "AWAITING_SPECIFICATIONS"
            state["category"] = category
            self.user_states[user_id] = state
            
            reply_text = f"Great! Before showing **{category}**, please select your preferred **Size, Color, Price Range, and Style/Brand** below:"
            options = [
                {"label": "⚪ White / Size M (₹499)", "value": "Show me white shirt size M"},
                {"label": "⚫ Black / Size L (₹499)", "value": "Show me black shirt size L"},
                {"label": "🔵 Navy Blue / Size L (₹699)", "value": "Show me navy blue trousers"},
                {"label": "📏 Size & Fit Advisor", "value": "Help me pick my size"}
            ]

        # Step 2: Size Advisor
        elif any(w in msg_lower for w in ["size advisor", "pick my size", "height", "weight", "measurement"]):
            size_res = calculate_size_recommendation_tool.invoke({"height_cm": 175, "weight_kg": 70})
            category = state.get("category", "Shirts")
            state["step"] = "AWAITING_SPECIFICATIONS"
            self.user_states[user_id] = state
            
            reply_text = f"📏 **Size & Fit Advisor Recommendation**:\n- Recommended Size: **{size_res['recommended_size']}** ({size_res['fit_description']})\n- Tip: {size_res['tip']}\n\nNow select your favorite **Color & Style** for **{category}**:"
            options = [
                {"label": f"⚪ White {category} (Size {size_res['recommended_size']})", "value": f"Show me white shirt size {size_res['recommended_size']}"},
                {"label": f"⚫ Black {category} (Size {size_res['recommended_size']})", "value": f"Show me black shirt size {size_res['recommended_size']}"}
            ]

        # --- STEP 3: SPECIFICATIONS GIVEN OR DIRECT PRODUCT SEARCH -> DISPLAY FILTERED PRODUCT CARDS ---
        else:
            state["step"] = "SHOWING_PRODUCTS"
            self.user_states[user_id] = state
            
            if any(attr in msg_lower for attr in ["casual shirts", "formal shirts", "shirts for men"]):
                reply_text = "Great choice! Before showing matching **Shirts**, please select your preferred **Size, Color, Price Range, and Style/Brand**:"
                options = [
                    {"label": "⚪ White / Size M (₹499)", "value": "Show me white shirt size M"},
                    {"label": "⚫ Black / Size L (₹499)", "value": "Show me black shirt size L"},
                    {"label": "📏 Use Size Advisor", "value": "Help me pick my size"}
                ]
            else:
                reply_text = f"✨ **Here are top matching products based on your preferences**:\n\nClick **'+ Add to ₹999 Combo'** on any shirt below to build your combo deal!"
                options = [
                    {"label": "🛍️ Review Cart & Pay", "value": "View my cart"},
                    {"label": "🎨 Color Pairing Advice", "value": "What colors pair well with white shirt"}
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
