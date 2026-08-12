import pytest
from app.agents.tools import (
    calculate_size_recommendation_tool,
    get_color_matching_suggestions_tool,
    lookup_order_status_tool,
    escalate_to_human_support_tool,
    get_customer_profile_memory_tool
)

def test_size_recommendation_tool_scenarios():
    res_m = calculate_size_recommendation_tool.invoke({"height_cm": 175, "weight_kg": 70})
    assert res_m["recommended_size"] == "M"

    res_s = calculate_size_recommendation_tool.invoke({"height_cm": 160, "weight_kg": 55})
    assert res_s["recommended_size"] == "S"

    res_xl = calculate_size_recommendation_tool.invoke({"height_cm": 185, "weight_kg": 90})
    assert res_xl["recommended_size"] == "XL"

def test_color_matching_suggestions_tool():
    res = get_color_matching_suggestions_tool.invoke({"item_color": "White", "item_category": "Shirts"})
    assert "suggested_pairings" in res
    assert len(res["suggested_pairings"]) > 0

def test_order_status_lookup_tool():
    res_valid = lookup_order_status_tool.invoke({"order_id": "ORD-999-8812"})
    assert res_valid["status"] == "Shipped"
    assert "tracking_number" in res_valid

    res_invalid = lookup_order_status_tool.invoke({"order_id": "INVALID-123"})
    assert "not found" in res_invalid["message"].lower()

def test_escalate_to_human_support_tool():
    res = escalate_to_human_support_tool.invoke({"user_id": "usr_test", "issue_summary": "Shipping delay"})
    assert res["status"] == "ESCALATED"
    assert res["requires_human_handoff"] is True

def test_customer_profile_memory_tool():
    res = get_customer_profile_memory_tool.invoke({"user_id": "usr_returning_101"})
    assert res["name"] == "Rahul Sharma"
    assert res["is_returning"] is True
