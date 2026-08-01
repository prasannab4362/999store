import json
import re
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

CONVERSATION FLOW MANDATE:
1. Greeting: Welcome warmly and ask target audience (Men / Women / Accessories).
2. Category Selection: Ask for desired category (Shirts, T-Shirts, Trousers, Dresses).
3. Step-by-Step Requirement Collection:
   - 1st: Ask Style preference (Casual or Formal).
   - 2nd: Ask Size (S, M, L, XL or Size Advisor).
   - 3rd: Ask Preferred Color (White, Black, Navy Blue, Pink, Beige).
   - 4th: Ask Budget / Price Range (Under ₹500, ₹500 - ₹999, ₹1000+).
   Do NOT display product cards during requirement collection.
4. RAG Product Recommendation: Execute RAG search and display visual product cards only after requirements are gathered or when specific details are provided.
5. Cart & Combo Deal: Guide 3-for-₹999 combo deal upsell and checkout.
"""

class DynamicLangGraphShoppingAgent:
    """
    Production-ready AI Shopping Assistant for 999 Store enforcing sequential shopping journey:
    Greeting → Category Selection → Step-by-Step Requirement Collection (Style → Size → Color → Budget) → RAG Search & Product Cards → Cart & Combo Offer
    """
    def __init__(self):
        self.checkpoints: Dict[str, List[BaseMessage]] = {}
        self.user_carts: Dict[str, List[Dict[str, Any]]] = {}
        self.user_states: Dict[str, Dict[str, Any]] = {}

    def process_turn(self, user_id: str, channel: str, message: str, thread_id: str) -> Dict[str, Any]:
        history = self.checkpoints.get(thread_id, [SystemMessage(content=SYSTEM_PROMPT)])
        history.append(HumanMessage(content=message))
        
        msg_lower = message.lower().strip()
        msg_words = set(re.findall(r'\b\w+\b', msg_lower))
        cart = self.user_carts.get(user_id, [])
        state = self.user_states.get(user_id, {"step": "INIT", "category": None, "target": None, "style": None, "size": None, "color": None, "budget": None})
        
        retrieved_products = []
        options = []
        requires_human_handoff = False
        reply_text = ""

        profile = get_customer_profile_memory_tool.invoke({"user_id": user_id})

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
                {"label": "🛍️ Browse Products", "value": "I need shirts"},
                {"label": "🤝 Contact Support", "value": "I need human support agent"}
            ]

        # --- CART MANAGEMENT: ADD TO CART & COMBO UPSELL ---
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
                    {"label": "👔 Add 2 More Shirts", "value": "Casual Shirts"},
                    {"label": "👖 Add Trousers", "value": "I need trousers"},
                    {"label": "🛍️ Review Cart & Pay", "value": "View my cart"}
                ]
            else:
                remaining = max(0, 3 - cart_count)
                reply_text = f"🛒 **Added to Cart!** You now have **{cart_count} item(s)** in your ₹999 combo bundle.\n\n" + (f"Add **{remaining} more item** to complete your ₹999 combo!" if remaining > 0 else "🎉 Your 3-item ₹999 combo bundle is complete!")
                options = [
                    {"label": "🛍️ Review Cart & Pay", "value": "View my cart"},
                    {"label": "👕 Add More Items", "value": "I need shirts"}
                ]

        # --- CART MANAGEMENT: VIEW CART & CHECKOUT ---
        elif any(w in msg_lower for w in ["view my cart", "review cart", "cart", "checkout"]):
            if not cart:
                reply_text = "🛒 Your cart is currently empty! Let's pick some stylish outfits for your ₹999 combo bundle."
                options = [
                    {"label": "👔 Browse Shirts", "value": "I need shirts"},
                    {"label": "👕 Browse T-Shirts", "value": "I need t-shirts"},
                    {"label": "👖 Browse Trousers", "value": "I need trousers"}
                ]
            else:
                total_regular = sum(p.get("price", 499) for p in cart)
                final_combo_price = 999 if len(cart) >= 3 else total_regular
                items_str = "\n".join([f"{i+1}. **{p['name']}** ({p.get('color', 'Standard')}) - ₹{p.get('price', 499)}" for i, p in enumerate(cart)])
                
                reply_text = f"🛒 **Your 999 Store Cart Review**:\n\n{items_str}\n\n-------------------------------\n📦 **Total Items:** {len(cart)}\n💰 **Regular Price:** ₹{total_regular}\n🎉 **Combo Special Price:** **₹{final_combo_price}** + Free Express Shipping\n\nEverything is set! Click **Proceed to Checkout** below to finalize your order."
                options = [
                    {"label": "💳 Proceed to Checkout (₹999)", "value": "Proceeding to checkout payment"},
                    {"label": "➕ Add More Items", "value": "I need shirts"}
                ]

        # Payment Confirmation
        elif "proceeding to checkout" in msg_lower or ("pay" in msg_lower and len(cart) > 0):
            reply_text = "💳 **Redirecting to Secure Payment Gateway...**\n\nThank you for shopping with **999 Store**! Your order confirmation will be sent via SMS & WhatsApp."
            options = [{"label": "🛍️ Start New Shopping Journey", "value": "Hi"}]
            self.user_carts[user_id] = []

        # --- STEP 1: GREETING (Exact word token matching) ---
        elif set(["hi", "hello", "hey", "start", "welcome"]).intersection(msg_words) or any(phrase in msg_lower for phrase in ["good morning", "good evening"]):
            state["step"] = "AWAITING_TARGET"
            self.user_states[user_id] = state
            
            greeting_prefix = f"Welcome back, **{profile['name']}**! " if profile and profile.get("is_returning") else ""
            reply_text = f"Hello 👋 {greeting_prefix}Welcome to **999 Store**!\n\nI'm your **AI Shopping Assistant**. I'll help you find the perfect outfit.\n\nWho are you shopping for today?"
            options = [
                {"label": "👨 Men", "value": "I am shopping for Men"},
                {"label": "👩 Women", "value": "I am shopping for Women"},
                {"label": "🎒 Accessories", "value": "Show me accessories"}
            ]

        # --- STEP 1b: TARGET SELECTION (Men / Women / Accessories) ---
        elif any(target in msg_lower for target in ["shopping for men", "shopping for women", "accessories"]):
            target_group = "Men" if "men" in msg_lower else ("Women" if "women" in msg_lower else "Accessories")
            state["step"] = "AWAITING_CATEGORY"
            state["target"] = target_group
            self.user_states[user_id] = state

            reply_text = f"Awesome! What category of **{target_group}** clothing are you looking for today?"
            if target_group == "Men":
                options = [
                    {"label": "👔 Shirts (Formal & Casual)", "value": "I need shirts"},
                    {"label": "👕 T-Shirts (Streetwear)", "value": "I need t-shirts"},
                    {"label": "👖 Trousers & Chinos", "value": "I need trousers"}
                ]
            elif target_group == "Women":
                options = [
                    {"label": "👗 Dresses & Midis", "value": "I need dresses"},
                    {"label": "👖 High-Waist Denim Jeans", "value": "I need jeans"}
                ]
            else:
                options = [
                    {"label": "💼 Leather Belts", "value": "I need belts"},
                    {"label": "🛍️ All Accessories", "value": "Show me accessories"}
                ]

        # --- STEP 2a: CATEGORY SELECTION -> ASK 1ST PREFERENCE: STYLE (Casual or Formal) ---
        elif any(cat in msg_lower for cat in ["i need shirt", "i need shirts", "i want shirt", "i want shirts", "show me shirt", "show me shirts", "shirt", "shirts", "i need t-shirt", "i need t-shirts", "i want t-shirt", "i want t-shirts", "t-shirt", "t-shirts", "i need trouser", "i need trousers", "trouser", "trousers", "dress", "dresses", "jean", "jeans", "belt", "belts"]) and not any(spec in msg_lower for spec in ["casual", "formal", "party", "size", "white", "black", "blue", "pink", "beige", "under", "500", "999"]):
            category = "Shirts" if "shirt" in msg_lower else ("T-Shirts" if "t-shirt" in msg_lower else ("Trousers" if "trouser" in msg_lower else ("Dresses" if "dress" in msg_lower else "Accessories")))
            state["step"] = "AWAITING_STYLE"
            state["category"] = category
            self.user_states[user_id] = state
            
            retrieved_products = []
            reply_text = f"Great! Let's find your perfect **{category}**.\n\nFirst, do you prefer **Casual** or **Formal** {category.lower()}?"
            options = [
                {"label": "👔 Casual", "value": "Casual Shirts" if category == "Shirts" else f"Casual {category}"},
                {"label": "💼 Formal", "value": "Formal Shirts" if category == "Shirts" else f"Formal {category}"},
                {"label": "✨ Party / Festive", "value": f"Party Wear {category}"}
            ]

        # --- STEP 2b: STYLE SELECTED -> ASK 2ND PREFERENCE: SIZE ---
        elif any(st in msg_lower for st in ["casual", "formal", "party wear"]) and not any(sz in msg_lower for sz in ["size", "small", "medium", "large", "xl", "white", "black", "blue", "pink", "beige"]):
            style = "Casual" if "casual" in msg_lower else ("Formal" if "formal" in msg_lower else "Party Wear")
            category = state.get("category", "Shirts")
            state["step"] = "AWAITING_SIZE"
            state["style"] = style
            self.user_states[user_id] = state

            retrieved_products = []
            reply_text = f"Got it, **{style} {category}**!\n\nSecond, what **size** do you wear?"
            options = [
                {"label": "S (Small)", "value": "Size S"},
                {"label": "M (Medium)", "value": "Size M"},
                {"label": "L (Large)", "value": "Size L"},
                {"label": "XL (Extra Large)", "value": "Size XL"},
                {"label": "📏 Size & Fit Advisor", "value": "Help me pick my size"}
            ]

        # --- STEP 2b AUX: SIZE ADVISOR TOOL ---
        elif any(w in msg_lower for w in ["size advisor", "pick my size", "height", "weight", "measurement", "what size should i get"]):
            size_res = calculate_size_recommendation_tool.invoke({"height_cm": 175, "weight_kg": 70})
            category = state.get("category", "Shirts")
            rec_size = size_res['recommended_size']
            state["step"] = "AWAITING_COLOR"
            state["size"] = rec_size
            self.user_states[user_id] = state
            
            retrieved_products = []
            reply_text = f"📏 **AI Size & Fit Advisor Recommendation**:\n- Recommended Size: **{rec_size}** ({size_res['fit_description']})\n- Tip: {size_res['tip']}\n\nThird, what is your **preferred color** for {category}?"
            options = [
                {"label": "⚪ White", "value": f"White Size {rec_size}"},
                {"label": "⚫ Black", "value": f"Black Size {rec_size}"},
                {"label": "🔵 Navy Blue", "value": f"Navy Blue Size {rec_size}"},
                {"label": "🌸 Pink", "value": f"Pink Size {rec_size}"},
                {"label": "🌾 Beige", "value": f"Beige Size {rec_size}"}
            ]

        # --- STEP 2c: SIZE SELECTED -> ASK 3RD PREFERENCE: COLOR ---
        elif any(sz in msg_lower for sz in ["size s", "size m", "size l", "size xl", "small", "medium", "large"]) and not any(cl in msg_lower for cl in ["white", "black", "blue", "navy", "pink", "beige"]):
            size_val = "M" if "size m" in msg_lower or "medium" in msg_lower else ("L" if "size l" in msg_lower or "large" in msg_lower else ("S" if "size s" in msg_lower or "small" in msg_lower else "XL"))
            category = state.get("category", "Shirts")
            state["step"] = "AWAITING_COLOR"
            state["size"] = size_val
            self.user_states[user_id] = state

            retrieved_products = []
            reply_text = f"Perfect, **Size {size_val}**!\n\nThird, what is your **preferred color**?"
            options = [
                {"label": "⚪ White", "value": "White"},
                {"label": "⚫ Black", "value": "Black"},
                {"label": "🔵 Navy Blue", "value": "Navy Blue"},
                {"label": "🌸 Pink", "value": "Pink"},
                {"label": "🌾 Beige", "value": "Beige"}
            ]

        # --- STEP 2d: COLOR SELECTED -> ASK 4TH PREFERENCE: BUDGET / PRICE RANGE ---
        elif any(cl in msg_lower for cl in ["white", "black", "navy blue", "blue", "pink", "beige"]) and not any(bd in msg_lower for bd in ["under", "500", "999", "1000", "budget", "price"]):
            color_val = "White" if "white" in msg_lower else ("Black" if "black" in msg_lower else ("Navy Blue" if "blue" in msg_lower or "navy" in msg_lower else ("Pink" if "pink" in msg_lower else "Beige")))
            category = state.get("category", "Shirts")
            state["step"] = "AWAITING_BUDGET"
            state["color"] = color_val
            self.user_states[user_id] = state

            retrieved_products = []
            reply_text = f"Awesome, **{color_val}**!\n\nFourth, what is your **budget / price range**?"
            options = [
                {"label": "💰 Under ₹500", "value": "Under ₹500"},
                {"label": "🏷️ ₹500 - ₹999", "value": "₹500 - ₹999"},
                {"label": "🌟 ₹1000+ Premium", "value": "Over ₹1000"}
            ]

        # --- STEP 3: ALL REQUIREMENTS GATHERED OR DIRECT SEARCH -> RAG RETRIEVAL & SHOW PRODUCT CARDS ---
        else:
            state["step"] = "SHOWING_PRODUCTS"
            self.user_states[user_id] = state
            
            # Execute RAG catalog retrieval
            prods = retriever.search_catalog(query=message)
            retrieved_products = prods
            
            reply_text = "✨ **Here are top matching products based on your preferences**:\n\nClick **'+ Add to ₹999 Combo'** on any product below to build your combo deal!"
            options = [
                {"label": "🛍️ Review Cart & Pay", "value": "View my cart"},
                {"label": "🎨 Color Pairing Advice", "value": "What colors pair well with white shirt"},
                {"label": "👕 Browse More Items", "value": "I need shirts"}
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
