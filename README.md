# 🛍️ 999 Combo Store — AI Shopping Assistant ("Combo Guru AI")

[![Python Version](https://img.shields.io/badge/python-3.11%20%7C%203.14-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg)](https://fastapi.tiangolo.com/)
[![LangChain](https://img.shields.io/badge/LangChain-0.1.14-green.svg)](https://www.langchain.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.0.32-orange.svg)](https://langchain-ai.github.io/langgraph/)
[![Tests](https://img.shields.io/badge/tests-21%20passed-brightgreen.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

A production-ready **AI E-Commerce Shopping Assistant** designed for **999 Combo Store**. Built with **FastAPI**, **LangGraph**, **LangChain**, **Vector RAG (Retrieval-Augmented Generation)**, **Persistent Storage**, and a modern **HTML5/CSS3** web interface.

---

## ✨ Features

- 🤖 **Sequential 4-Step Interactive Shopping Journey**:
  - **Greeting & Target Selection** (Men / Women / Accessories)
  - **Category Requirements** (Shirts, T-Shirts, Trousers, Dresses)
  - **Guided Preferences** (Style → Size → Preferred Color → Budget Range)
  - **RAG Product Recommendation Cards**
- 🧠 **Hybrid Vector RAG Semantic Search**:
  - Dense text similarity ranking using `sentence-transformers` & Cosine Similarity.
  - Strict Category, Color, Size, and Price Max guardrails.
  - **Tier 2 Color-First Fallback**: Guarantees exact requested color photos are ALWAYS retrieved and displayed.
- 🎨 **100% Color-Variant Photo Accuracy**:
  - Dedicated high-resolution image URLs for all 27 color combinations (White, Black, Navy Blue, Pink, Beige, Sky Blue, Olive Green, Maroon, Grey).
- 💾 **Persistent Cart & Session Memory**:
  - File-backed JSON storage (`ai-service/data/storage.json`). User carts and conversation state automatically survive server restarts and browser refreshes.
- 🎴 **UI/UX Enhancements**:
  - **Product Card Size Selector**: Pick sizes (`S, M, L, XL`) directly on product cards before adding to cart.
  - **Full-Screen Image Lightbox Modal**: Click any product image to zoom and preview details.
  - **Animated Toast Alerts**: Floating toast notifications for cart actions.
- 📊 **Observability & Analytics REST API**:
  - `/api/v1/analytics` endpoint returning real-time active sessions, cart counts, and event logs.
- 🧪 **Exhaustive Automated Test Suite**:
  - 21 test scenarios covering end-to-end user flows, multi-item carts, combo pricing, checkout, AI tools, vector RAG ranking, and analytics.

---

## 🏗️ Project Architecture

```
999store/
├── docker-compose.yml           # One-command Docker Compose orchestration
├── README.md                    # Step-by-step setup documentation
├── .gitignore                   # Workspace gitignore
├── docs/
│   └── 2026-08-01/
│       └── daily_summary.md     # Engineering daily summary documentation
└── ai-service/
    ├── Dockerfile               # Backend container definition
    ├── pyproject.toml           # Python dependencies & metadata
    ├── index.html               # Web UI application (HTML5/CSS3/JS)
    ├── data/
    │   └── storage.json         # Persistent JSON database (Auto-generated)
    ├── app/
    │   ├── main.py              # FastAPI application entrypoint
    │   ├── config.py            # Application configuration & Pydantic settings
    │   ├── agents/
    │   │   ├── graph.py         # LangGraph state machine agent logic
    │   │   └── tools.py         # LangChain tools (Size Advisor, Color Matching, Order Lookup)
    │   ├── db/
    │   │   └── storage.py       # PersistentStorageManager JSON database engine
    │   ├── rag/
    │   │   └── retriever.py     # Hybrid Vector RAG catalog search engine
    │   ├── routes/
    │   │   ├── chat.py          # Chat REST API endpoint
    │   │   ├── health.py        # Health check endpoint
    │   │   └── analytics.py     # Analytics REST API endpoint
    │   └── services/
    └── tests/
        ├── test_agent_eval.py   # Core agent & RAG evaluation tests
        ├── test_cart_checkout.py # Cart management & checkout tests
        ├── test_flow_scenarios.py# Sequential shopping journey tests
        ├── test_persistence.py  # Storage persistence tests
        ├── test_tools_and_aux.py # LangChain tool tests
        ├── test_vector_rag.py   # Vector similarity ranking tests
        └── test_extended_scenarios.py # Women's, Accessories & RAG lookup tests
```

---

## 🚀 Quick Start Guide

You can run the project using **Docker** (Option A) or **Local Python Environment** (Option B).

---

### Option A: One-Command Docker Setup (Recommended)

If you have **Docker** and **Docker Compose** installed, you can start the entire stack in one command:

```bash
# 1. Clone the repository
git clone https://github.com/prasannab4362/999store.git
cd 999store

# 2. Build and start containers
docker-compose up --build
```

- **Web Application UI**: Open **[http://localhost:3000](http://localhost:3000)**
- **FastAPI Interactive Docs**: Open **[http://localhost:8000/docs](http://localhost:8000/docs)**
- **Analytics API**: Open **[http://localhost:8000/api/v1/analytics](http://localhost:8000/api/v1/analytics)**

---

### Option B: Step-by-Step Local Setup (Python)

Follow these step-by-step instructions to run the project locally on Windows, macOS, or Linux.

#### Step 1: Clone the Repository
```bash
git clone https://github.com/prasannab4362/999store.git
cd 999store/ai-service
```

#### Step 2: Create & Activate Virtual Environment

**On Windows (PowerShell):**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**On macOS / Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

#### Step 3: Install Dependencies

```bash
# Install uv package manager (recommended for fast installation)
pip install uv

# Install all project dependencies
uv pip install -e .
```

*Alternatively, install via standard pip:*
```bash
pip install fastapi uvicorn pydantic pydantic-settings langchain langchain-core langchain-community langgraph sentence-transformers numpy pytest pytest-asyncio httpx python-dotenv
```

---

#### Step 4: Run Application Servers

You need to start **2 processes** (Backend API and Frontend HTTP server):

**Terminal 1 — Start FastAPI Backend Server (Port 8000):**
```bash
uv run python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 — Start Frontend HTTP Server (Port 3000):**
```bash
uv run python -m http.server 3000 --bind 0.0.0.0
```

---

#### Step 5: Open Application in Browser

Open your web browser and navigate to:
👉 **[http://127.0.0.1:3000](http://127.0.0.1:3000)**

---

## 🧪 Running Automated Tests

The repository includes a comprehensive 21-scenario test suite using `pytest`.

```bash
cd 999store/ai-service

# Run all test cases with verbose output
uv run pytest tests/ -v
```

**Expected Output:**
```
======================== 21 passed in 5.80s ========================
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API Root Welcome |
| `GET` | `/health` | Service Health Status |
| `POST` | `/api/v1/chat` | Main Chat Endpoint (`user_id`, `message`, `thread_id`) |
| `GET` | `/api/v1/analytics` | Real-time System Metrics & Cart Conversion Data |
| `GET` | `/docs` | Interactive OpenAPI / Swagger UI |

---

## ❓ Troubleshooting & FAQs

#### Q1: "⚠️ Could not connect to AI Agent Service" error in browser
- **Cause**: The FastAPI backend on port 8000 is not running.
- **Fix**: Ensure `uv run python -m uvicorn app.main:app --host 0.0.0.0 --port 8000` is active in Terminal 1.

#### Q2: Port 8000 or 3000 is already in use (`Errno 10048`)
- **Fix**: Kill existing processes or specify a different port (e.g. `--port 8001`).

#### Q3: Changes in UI are not showing up
- **Fix**: Press `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac) in your browser to perform a **hard refresh** and bypass cached HTML/JS.

---

## 📄 License
This project is licensed under the **MIT License**.
