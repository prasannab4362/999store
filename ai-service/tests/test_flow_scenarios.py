import pytest
from app.agents.graph import agent

def test_full_sequential_shopping_flow():
    user_id = "test_seq_user_101"
    thread_id = f"thread_{user_id}"

    # Step 1: Greeting
    res1 = agent.process_turn(user_id, "web", "Hi", thread_id)
    assert "Welcome to **999 Store**" in res1["reply"]
    assert any(opt["value"] == "I am shopping for Men" for opt in res1["options"])

    # Step 1b: Target Selection
    res1b = agent.process_turn(user_id, "web", "I am shopping for Men", thread_id)
    assert "What category of **Men**" in res1b["reply"]
    assert any(opt["value"] == "I need shirts" for opt in res1b["options"])

    # Step 2a: Category Selection
    res2a = agent.process_turn(user_id, "web", "I need shirts", thread_id)
    assert "Let's find your perfect **Shirts**" in res2a["reply"]
    assert any("Casual" in opt["label"] for opt in res2a["options"])

    # Step 2b: Style Selection
    res2b = agent.process_turn(user_id, "web", "Casual Shirts", thread_id)
    assert "Got it, **Casual Shirts**" in res2b["reply"]
    assert any(opt["value"] == "Size M" for opt in res2b["options"])

    # Step 2c: Size Selection
    res2c = agent.process_turn(user_id, "web", "Size M", thread_id)
    assert "Perfect, **Size M**" in res2c["reply"]
    assert any(opt["value"] == "Navy Blue" for opt in res2c["options"])

    # Step 2d: Color Selection
    res2d = agent.process_turn(user_id, "web", "Navy Blue", thread_id)
    assert "Awesome, **Navy Blue**" in res2d["reply"]
    assert any(opt["value"] == "Under ₹500" for opt in res2d["options"])

    # Step 3: Budget Selection & Product Display
    res3 = agent.process_turn(user_id, "web", "Under ₹500", thread_id)
    assert len(res3["retrieved_products"]) > 0
    # Every product displayed must be a Navy Blue Shirt
    for prod in res3["retrieved_products"]:
        assert prod["sub_category"] == "Shirts"
        assert "Navy Blue" in prod["selected_color"]

def test_direct_multi_attribute_search():
    user_id = "test_direct_user_102"
    thread_id = f"thread_{user_id}"

    res = agent.process_turn(user_id, "web", "Show me white shirt size L under 500", thread_id)
    assert len(res["retrieved_products"]) > 0
    for prod in res["retrieved_products"]:
        assert prod["sub_category"] == "Shirts"
        assert prod["selected_color"] == "White"
        assert prod["selected_size"] == "L"
