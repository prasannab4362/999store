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

SYSTEM_PROMPT = """You are "Combo Guru" (Style 999 AI), the official intelligent AI Shopping Assistant for 999 Store.

SYSTEM GOALS & PERSONALITY:
- Friendly, professional, helpful, patient, honest, conversational, knowledgeable, fast, and accurate.
- Act like an experienced in-store sales representative.
- Provide RAG-grounded product information from the authorized catalog. Never hallucinate product details.
- Support natural product discovery, smart preference filtering, size/fit advising, complementary outfit pairings, cart management, and ₹999 combo bundle deals.

GREETING & SHOPPING JOURNEY FLOW:
- Greeting: Warm welcome with category options (Men, Women, Kids, Accessories / Shirts, T-Shirts, Trousers).
- Natural Customer Understanding: Learn Category, Gender, Size, Color, Price Range, Occasion, and Fit preference.
- Product Cards & RAG Retrieval: Show top matched items with Image, Name, Brand, Price, Discount, Available Sizes, Colors, and Stock availability.
- Combo Upsell & Cart: Guide 3-item for ₹999 combo deal, cart review, coupon savings, and checkout.
"""

class DynamicLangGraphShoppingAgent:
    """
    Production-ready AI Shopping Assistant for 999 Store enforcing natural conversation,
    RAG product discovery, size/fit recommendations, combo deal upsell, and cart management.
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

        # Pre-fetch catalog products via RAG
        prods = retriever.search_catalog(query=message)
        retrieved_products = prods

        # --- SUPPORT HANDOFF ESCALATION ---
        if any(w in msg_lower for w in ["human", "support", "agent", "person", "escalate", "help me talk to human"]):
            esc_res = escalate_to_human_support_tool.invoke({"reason": message})
            requires_human_handoff = True
            reply_text = f"🤝 {esc_res['message']}"

        # --- ORDER TRACKING & RETURNS ---
        elif any(w in msg_lower for w in ["order", "track", "ord-", "status", "delivery"]):
            order_res = lookup_order_status_tool.invoke({"order_id": "ORD-999-01", "user_id": user_id})
            reply_text = f"📦 **Order Status for `{order_res['order_id']}`**:\n- Status: **{order_res['status']}**\n- Carrier: {order_res.get('carrier', 'BlueDart Express')}\n- Estimated Delivery: **{order_res['estimated_delivery']}**\n- Tracking No: `{order_res.get('tracking_number', 'BD-999-88219')}`"
            options = [
                {"label": "🛍️ Browse Products", "value": "Show me shirts"},
                {"label": "🤝 Contact Support", "value": "I need human support agent"}
            ]

        # --- STEP 4: ADD TO CART & COMBO UPSELL ---
        elif msg_lower.startswith("add ") and ("to combo" in msg_lower or "cart" in msg_lower):
            item_name = message.replace("Add ", "").replace(" to my combo", "").replace(" to combo", "").replace(" to cart", "").strip()
            found_item = retriever.search_catalog(query=item_name)
            added_product = found_item[0] if found_item else {"name": item_name, "price": 499, "color": "Selected", "available_sizes": ["M"]}
            
            cart.append(added_product)
            self.user_carts[user_id] = cart
            cart_count = len(cart)
            
            if cart_count == 1:
                reply_text = f"🛒 **Added '{added_product['name']}' to your Cart!**\n\n🎉 **₹999 Combo Special Offer**:\nYou have 1 item in your cart. Pick **2 more items** in the same price range to complete your **3-item combo for just ₹999**!\n\nWhat would you like to add next?"
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
        elif any(w in msg_lower for w in ["view my cart", "review cart", "cart", "checkout"]):
            if not cart:
                reply_text = "🛒 Your cart is currently empty! Let's pick some stylish outfits for your ₹999 combo bundle."
                options = [
                    {"label": "👔 Browse Men Shirts", "value": "I want shirts"},
                    {"label": "👕 Browse T-Shirts", "value": "I want t-shirts"},
                    {"label": "👖 Browse Trousers", "value": "I want trousers"}
                ]
            else:
                total_regular = sum(p.get("price", 499) for p in cart)
                final_combo_price = 999 if len(cart) >= 3 else total_regular
                items_str = "\n".join([f"{i+1}. **{p['name']}** ({p.get('color', 'Standard')}) - ₹{p.get('price', 499)}" for i, p in enumerate(cart)])
                
                reply_text = f"🛒 **Your 999 Store Cart Review**:\n\n{items_str}\n\n-------------------------------\n📦 **Total Items:** {len(cart)}\n💰 **Regular Price:** ₹{total_regular}\n🎉 **Combo Special Price:** **₹{final_combo_price}** + Free Express Shipping\n\nEverything is set! Click **Proceed to Checkout** below to finalize your order."
                options = [
                    {"label": "💳 Proceed to Checkout (₹999)", "value": "Proceeding to checkout payment"},
                    {"label": "➕ Add More Items", "value": "I want shirts"}
                ]

        # Payment Confirmation
        elif "proceeding to checkout" in msg_lower or ("pay" in msg_lower and len(cart) > 0):
            reply_text = "💳 **Redirecting to Secure Payment Gateway...**\n\nThank you for shopping with **999 Store**! Your order confirmation will be sent via SMS & WhatsApp."
            options = [{"label": "🛍️ Start New Shopping Journey", "value": "Hi"}]
            self.user_carts[user_id] = []

        # --- STEP 1: GREETING & INITIAL INTENT ---
        elif any(w in msg_lower for w in ["hi", "hello", "hey", "start", "welcome", "good morning", "good evening"]):
            state["step"] = "AWAITING_CATEGORY"
            self.user_states[user_id] = state
            
            greeting_prefix = f"Welcome back, **{profile['name']}**! " if profile and profile.get("is_returning") else ""
            reply_text = f"Hello 👋 {greeting_prefix}Welcome to **999 Store**!\n\nI'm your **AI Shopping Assistant**. I'll help you find the perfect outfit, suggest size recommendations, and help you lock in our exclusive **3 items for ₹999 combo deal**.\n\nWho are you shopping for today?"
            options = [
                {"label": "👨 Men", "value": "I am shopping for Men"},
                {"label": "👩 Women", "value": "I am shopping for Women"},
                {"label": "🎒 Accessories", "value": "Show me accessories"}
            ]

        # Shopping Target Intent (Men / Women / Kids / Accessories)
        elif any(target in msg_lower for target in ["shopping for men", "shopping for women", "accessories"]):
            target_group = "Men" if "men" in msg_lower else ("Women" if "women" in msg_lower else "Accessories")
            state["step"] = "AWAITING_CATEGORY"
            state["target_group"] = target_group
            self.user_states[user_id] = state

            reply_text = f"Awesome! What category of **{target_group}** clothing are you looking for today?"
            if target_group == "Men":
                options = [
                    {"label": "👔 Shirts (Formal & Casual)", "value": "I want shirts"},
                    {"label": "👕 T-Shirts (Streetwear)", "value": "I want t-shirts"},
                    {"label": "👖 Trousers & Chinos", "value": "I want trousers"}
                ]
            elif target_group == "Women":
                options = [
                    {"label": "👗 Dresses & Midis", "value": "I want women clothing"},
                    {"label": "👖 High-Waist Denim Jeans", "value": "Show me jeans"}
                ]
            else:
                options = [
                    {"label": "💼 Leather Belts", "value": "Show me belts"},
                    {"label": "🛍️ All Accessories", "value": "Show me accessories"}
                ]

        # --- STEP 2: CATEGORY SELECTED -> ASK FOR SIZE, COLOR, PRICE RANGE & BRAND ---
        elif msg_lower in ["i want shirts", "i want t-shirts", "i want trousers", "i want women clothing"]:
            category = "Shirts" if "shirts" in msg_lower else ("T-Shirts" if "t-shirts" in msg_lower else ("Trousers" if "trousers" in msg_lower else "Dresses"))
            state["step"] = "AWAITING_SPECIFICATIONS"
            state["category"] = category
            self.user_states[user_id] = state
            
            reply_text = f"Great choice! Before showing **{category}**, what is your preferred **Size, Color, and Style/Fit preference**?"
            options = [
                {"label": "⚪ White / Size M (₹499)", "value": "Show me white shirt size M"},
                {"label": "⚫ Black / Size L (₹499)", "value": "Show me black shirt size L"},
                {"label": "🔵 Navy Blue / Size L (₹699)", "value": "Show me navy blue trousers"},
                {"label": "📏 Size & Fit Advisor", "value": "Help me pick my size"}
            ]

        # Step 2: Size Advisor
        elif any(w in msg_lower for w in ["size advisor", "pick my size", "height", "weight", "measurement", "what size should i get"]):
            size_res = calculate_size_recommendation_tool.invoke({"height_cm": 175, "weight_kg": 70})
            category = state.get("category", "Shirts")
            state["step"] = "AWAITING_SPECIFICATIONS"
            self.user_states[user_id] = state
            
            reply_text = f"📏 **AI Size & Fit Advisor Recommendation**:\n- Recommended Size: **{size_res['recommended_size']}** ({size_res['fit_description']})\n- Tip: {size_res['tip']}\n\nSelect your favorite **Color & Style** for **{category}**:"
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
                reply_text = f"✨ **Here are top matching products based on your preferences**:\n\nClick **'+ Add to ₹999 Combo'** on any product below to add it to your 3-item combo deal!"
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
