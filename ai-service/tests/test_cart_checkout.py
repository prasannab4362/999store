import pytest
from app.agents.graph import agent
from app.db.storage import storage_manager

def test_cart_addition_and_combo_pricing():
    user_id = "test_cart_user_201"
    thread_id = f"thread_{user_id}"

    # Clear cart for user
    agent.user_carts[user_id] = []
    storage_manager.save_carts(agent.user_carts)

    # Add 1st Item
    res1 = agent.process_turn(user_id, "web", "Add Classic Slim Fit Oxford Shirt to my combo", thread_id)
    assert "Added 'Classic Slim Fit Oxford Shirt' to your Cart!" in res1["reply"]
    assert len(res1["cart"]) == 1

    # Add 2nd Item
    res2 = agent.process_turn(user_id, "web", "Add Classic Navy Blue Oxford Shirt to my combo", thread_id)
    assert "You now have **2 item(s)**" in res2["reply"]
    assert len(res2["cart"]) == 2

    # Add 3rd Item
    res3 = agent.process_turn(user_id, "web", "Add Stretchable Chino Trousers to my combo", thread_id)
    assert "Your 3-item ₹999 combo bundle is complete!" in res3["reply"]
    assert len(res3["cart"]) == 3

    # View Cart Review
    res_cart = agent.process_turn(user_id, "web", "View my cart", thread_id)
    assert "Combo Special Price:** **₹999**" in res_cart["reply"]
    assert "Total Items:** 3" in res_cart["reply"]

    # Proceed to Checkout Payment
    res_checkout = agent.process_turn(user_id, "web", "Proceeding to checkout payment", thread_id)
    assert "Redirecting to Secure Payment Gateway..." in res_checkout["reply"]
    # Cart should be reset after checkout
    assert len(agent.user_carts.get(user_id, [])) == 0

def test_empty_cart_review():
    user_id = "test_empty_cart_user_202"
    thread_id = f"thread_{user_id}"
    agent.user_carts[user_id] = []

    res = agent.process_turn(user_id, "web", "View my cart", thread_id)
    assert "cart is currently empty" in res["reply"]
