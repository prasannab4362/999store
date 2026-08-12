import pytest
from app.agents.graph import agent
from app.agents.tools import (
    get_recommendations_and_outfit_matches_tool,
    start_or_update_combo_deal_tool
)
from app.rag.retriever import retriever

def test_women_and_accessories_flows():
    user_id = "test_women_user_301"
    thread_id = f"thread_{user_id}"

    # Women Target Selection
    res_w = agent.process_turn(user_id, "web", "I am shopping for Women", thread_id)
    assert "What category of **Women**" in res_w["reply"]
    assert any(opt["value"] == "I need dresses" for opt in res_w["options"])

    # Accessories Target Selection
    user_acc = "test_acc_user_302"
    thread_acc = f"thread_{user_acc}"
    res_a = agent.process_turn(user_acc, "web", "Show me accessories", thread_acc)
    assert "What category of **Accessories**" in res_a["reply"]
    assert any(opt["value"] == "I need belts" for opt in res_a["options"])

def test_outfit_recommendations_and_combo_deal_tools():
    # Test recommendations tool
    rec_res = get_recommendations_and_outfit_matches_tool.invoke({"product_id": "var_101"})
    assert rec_res["selected_product_id"] == "var_101"
    assert "similar_products" in rec_res
    assert "complementary_outfit_matches" in rec_res

    # Test combo deal tool
    combo_res = start_or_update_combo_deal_tool.invoke({"user_id": "usr_test", "combo_tier": 3, "current_item_ids": ["var_101", "var_102"]})
    assert combo_res["remaining_count"] == 1
    assert combo_res["is_complete"] is False

    combo_complete = start_or_update_combo_deal_tool.invoke({"user_id": "usr_test", "combo_tier": 3, "current_item_ids": ["var_101", "var_102", "var_103"]})
    assert combo_complete["remaining_count"] == 0
    assert combo_complete["is_complete"] is True

def test_multi_item_cart_bundle_addition():
    user_id = "test_multi_cart_401"
    thread_id = f"thread_{user_id}"
    agent.user_carts[user_id] = []

    # Add 4 items to cart
    agent.process_turn(user_id, "web", "Add Classic Slim Fit Oxford Shirt to my combo", thread_id)
    agent.process_turn(user_id, "web", "Add Classic Navy Blue Oxford Shirt to my combo", thread_id)
    agent.process_turn(user_id, "web", "Add Stretchable Chino Trousers to my combo", thread_id)
    res4 = agent.process_turn(user_id, "web", "Add Essential Round Neck Tee to my combo", thread_id)

    assert "You now have **4 item(s)**" in res4["reply"]
    assert len(res4["cart"]) == 4

def test_rag_retriever_get_by_id_and_similar():
    item = retriever.get_by_id("var_101")
    assert item is not None
    assert item["name"] == "Classic Slim Fit Oxford Shirt"

    similar = retriever.get_similar_products("var_101", limit=2)
    assert len(similar) > 0
    for s in similar:
        assert s["sub_category"] == "Shirts"
