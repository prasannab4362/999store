# Daily Engineering Summary Documentation - 2026-08-01

## 📌 Project Overview
**Application:** 999 Store AI Shopping Assistant ("Combo Guru AI")  
**Repository Branch:** `AI-Chatbot`  
**Date:** August 1, 2026  

---

## 🛠️ Issues Identified, Root Causes & Fixes Implemented Today

### 1. Substring Collision in Greeting Intent (`"hi"` inside `"shirts"`)
- **Issue:** Typing or selecting `"I need shirts"` re-triggered the greeting message (*"Hello 👋 Welcome to 999 Store..."*).
- **Root Cause:** Python's string `in` operator checked substring inclusion (`"hi" in "shirts"` returned `True`).
- **Fix:** Updated `app/agents/graph.py` to use regex word-boundary token set intersection (`re.findall(r'\b\w+\b', msg_lower)`) so greeting words (`hi`, `hello`, `hey`) match only complete words.

---

### 2. Sequential 4-Step Preference Collection Before Product Display
- **Issue:** Selecting a clothing category immediately displayed products without collecting customer requirements.
- **Root Cause:** RAG search was executing on category selection without asking for user preferences.
- **Fix:** Enforced a sequential 4-step interactive preference questionnaire in `app/agents/graph.py`:
  1. **Style Selection:** Casual / Formal / Party Wear
  2. **Size Selection:** S / M / L / XL / Size Advisor
  3. **Preferred Color:** White, Black, Navy Blue, Pink, Beige, Grey, Olive Green, Maroon, Sky Blue
  4. **Budget Range:** Under ₹500 / ₹500 - ₹999 / Over ₹1000  
  Product cards are suppressed (`retrieved_products = []`) until preferences are gathered or direct multi-attribute search is performed.

---

### 3. Add-to-Cart State Overwrite & Questionnaire Restart
- **Issue:** Clicking `+ Add to ₹999 Combo` added the item to cart, but the bot responded with *"Great! Let's find your perfect Shirts. First, do you prefer Casual or Formal..."* instead of confirming the cart addition.
- **Root Cause:** Unchained `if` statements evaluated `"shirt"` in `"Add Classic Slim Fit Oxford Shirt to my combo"` and overwrote `reply_text`.
- **Fix:** Refactored `process_turn()` into a single, mutually exclusive `if/elif/else` decision chain where cart actions (`Add to Cart`, `View Cart`, `Checkout`) update state and return **immediately**.

---

### 4. Checkout Infinite Loop
- **Issue:** Clicking `"Proceed to Checkout"` re-rendered the cart review over and over in an infinite loop.
- **Root Cause:** `"Proceeding to checkout payment"` contained `"checkout"`, which matched the Cart View branch before reaching Payment Confirmation.
- **Fix:** Reordered decision branches in `app/agents/graph.py` so Payment Confirmation is evaluated **before** Cart Review.

---

### 5. Cross-Category Leakage (`"shirt"` in `"t-shirt"`)
- **Issue:** Asking for Shirts returned T-Shirts, and asking for T-Shirts was categorized as Shirts.
- **Root Cause:** `"shirt" in "t-shirt"` evaluated to `True`, and `"shirt"` was checked before `"t-shirt"`.
- **Fix:**
  - Enforced exact `sub_category` matching in `CatalogRetriever.search_catalog` (`Shirts` strictly matches `sub_category == "Shirts"`).
  - Updated category parsing order in `app/agents/graph.py` so `"t-shirt"` and `"tshirt"` are evaluated **before** `"shirt"`.

---

### 6. Budget Filter Color-Dropping Fallback Leakage
- **Issue:** Requesting a specific color variant (e.g. Sky Blue) under a price limit (e.g. ₹500) where exact match price was > ₹500 caused fallback items to return a White shirt image.
- **Root Cause:** Fallback logic dropped the color filter when price/size constraints were not met.
- **Fix:**
  - Implemented **Tier 2 Color-First Fallback** in `CatalogRetriever.search_catalog`: if exact price/size matches are 0, it relaxes budget/size constraints FIRST to guarantee that the **exact requested color image** is always retrieved.
  - Standardized all Men's combo catalog prices to **₹499** in `retriever.py`.

---

### 7. Product Card Attribute Matching Display
- **Issue:** Product cards listed all available sizes (`Sizes: S, M, L, XL`) even when the user explicitly selected `Size XL`.
- **Root Cause:** Frontend template hardcoded `${p.available_sizes.join(", ")}`.
- **Fix:** Updated `app/agents/graph.py` and `index.html` to dynamically attach and display ONLY the customer's selected attributes (`Size: XL`, `Color: Grey`).

---

### 8. Frontend Input Field Pre-Filling
- **Issue:** Clicking option buttons filled the text input field with the button prompt.
- **Root Cause:** `sendPrompt()` was setting `inputEl.value = text`.
- **Fix:** Removed input pre-filling in `sendPrompt()` and updated `sendMessage()` in `index.html` to always clear the input field after sending.

---

### 9. 100% Complete Color-Variant Image RAG Catalog
- **Improvement:** Expanded `SEED_CATALOG` in [app/rag/retriever.py](file:///e:/Projects/999store/ai-service/app/rag/retriever.py) to **27 distinct color-variant entries** covering all 9 color options across Shirts, T-Shirts, and Trousers with dedicated, color-accurate Unsplash photo URLs:
  - **9 Shirts:** White, Black, Navy Blue, Pink, Beige, Sky Blue, Olive Green, Maroon, Grey
  - **9 T-Shirts:** White, Black, Navy Blue, Pink, Beige, Sky Blue, Olive Green, Maroon, Grey
  - **9 Trousers:** White, Black, Navy Blue, Pink, Beige, Sky Blue, Olive Green, Maroon, Grey

---

## 🧪 Automated Testing & Verification
- Executed `uv run pytest tests/test_agent_eval.py -v`:
  - `test_health_check` → **PASSED**
  - `test_dynamic_rag_product_search` → **PASSED**
  - `test_size_advisor_tool` → **PASSED**
  - `test_returning_customer_profile` → **PASSED**
  - `test_human_support_escalation` → **PASSED**
- **Result:** **5 passed, 0 failed** (100% pass rate).

---

## 📦 Version Control & Deployment Status
- **Git Repository:** `https://github.com/prasannab4362/999store.git`
- **Current Branch:** `AI-Chatbot`
- **Latest Commit:** `027edfd` (Pushed to `origin/AI-Chatbot`)
- **FastAPI Backend:** Active on `http://127.0.0.1:8000`
- **Frontend Web UI:** Active on `http://127.0.0.1:3000`
