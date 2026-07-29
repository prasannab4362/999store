import json
from typing import Dict, Any, List, TypedDict, Annotated
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from app.agents.tools import ALL_TOOLS, search_products, check_stock, get_order_status, start_combo_session

class AgentState(TypedDict):
    messages: List[BaseMessage]
    user_id: str
    channel: str
    retrieved_products: List[Dict[str, Any]]
    thread_id: str

SYSTEM_PROMPT = """You are the official AI Shopping Assistant for 999 Combo Store.
Your job is to help customers find products, check stock, look up order statuses, and build ₹999 combo deals!

RULES:
1. ALWAYS verify stock and product info using your tools (`search_products`, `check_stock`). NEVER invent product prices or stock numbers.
2. If a user asks to search or browse items, call `search_products`.
3. If a user wants a combo, suggest our 2, 3, or 5 items for ₹999 deals and call `start_combo_session`.
4. Never take direct credit card/payment details in chat. Direct the user to complete checkout on the website interface.
5. Be polite, helpful, concise, and enthusiastic about deals!
"""

class LangGraphShoppingAgent:
    """
    Stateful conversational agent executing state transitions for customer shopping queries.
    """
    def __init__(self):
        self.tools_map = {t.name: t for t in ALL_TOOLS}
        # In-memory thread checkpointing dictionary
        self.checkpoints: Dict[str, List[BaseMessage]] = {}

    def process_turn(self, user_id: str, channel: str, message: str, thread_id: str) -> Dict[str, Any]:
        # Fetch or initialize conversation history
        history = self.checkpoints.get(thread_id, [SystemMessage(content=SYSTEM_PROMPT)])
        history.append(HumanMessage(content=message))
        
        msg_lower = message.lower()
        tool_results = []
        retrieved_products = []
        requires_human_handoff = False
        
        # Rule-based / tool routing agent execution loop logic
        if "order" in msg_lower or "track" in msg_lower or "status" in msg_lower:
            res = get_order_status.invoke({"order_id": "ORD-999-01", "user_id": user_id})
            reply_text = f"📦 Your order `{res['order_id']}` is currently **{res['status']}**. Estimated delivery is {res['estimated_delivery']}!"
        elif "combo" in msg_lower or "deal" in msg_lower or "999" in msg_lower:
            res = start_combo_session.invoke({"user_id": user_id, "combo_size": 3})
            reply_text = f"🎉 Great choice! {res['message']} What products would you like to add to your ₹999 combo bundle?"
        elif "shirt" in msg_lower or "pant" in msg_lower or "trousers" in msg_lower or "dress" in msg_lower or "search" in msg_lower or "buy" in msg_lower:
            prods = search_products.invoke({"query": message})
            retrieved_products = prods
            if prods:
                prod_list_str = "\n".join([f"• **{p['name']}** - ₹{p['price']} ({'In Stock: ' + str(p['stock_qty']) if p['stock_qty'] > 0 else 'OUT OF STOCK'})" for p in prods])
                reply_text = f"Here are the best matching items from our store catalog:\n\n{prod_list_str}\n\nWould you like to add any of these to a ₹999 combo?"
            else:
                reply_text = "I searched our catalog but couldn't find exact matches. Would you like to check our Men's or Women's combo categories?"
        elif "stock" in msg_lower or "var_" in msg_lower:
            res = check_stock.invoke({"product_variant_id": "var_101"})
            reply_text = f"Stock status for **{res['name']}**: {'Available (' + str(res['stock_qty']) + ' left)' if res['in_stock'] else 'Currently Out of Stock'}."
        elif "human" in msg_lower or "agent" in msg_lower or "support" in msg_lower:
            requires_human_handoff = True
            reply_text = "I am connecting you with a human customer support agent right now. Please hold on a moment."
        else:
            reply_text = "Hello! I am your 999 Combo Store Assistant. How can I help you today? You can ask me to search products, check stock, track an order, or start a ₹999 combo deal!"

        # Save response to turn history
        history.append(AIMessage(content=reply_text))
        self.checkpoints[thread_id] = history

        return {
            "reply": reply_text,
            "retrieved_products": retrieved_products,
            "requires_human_handoff": requires_human_handoff,
            "thread_id": thread_id
        }

agent = LangGraphShoppingAgent()
