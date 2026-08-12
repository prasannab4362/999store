import pytest
import os
from app.db.storage import storage_manager

def test_persistent_storage_carts_and_states():
    # Test cart saving and loading
    test_carts = {"usr_test_999": [{"name": "Classic Slim Fit Oxford Shirt", "price": 499}]}
    storage_manager.save_carts(test_carts)
    loaded_carts = storage_manager.load_carts()
    assert "usr_test_999" in loaded_carts
    assert loaded_carts["usr_test_999"][0]["name"] == "Classic Slim Fit Oxford Shirt"

    # Test states saving and loading
    test_states = {"usr_test_999": {"step": "SHOWING_PRODUCTS", "category": "Shirts", "color": "White"}}
    storage_manager.save_states(test_states)
    loaded_states = storage_manager.load_states()
    assert loaded_states["usr_test_999"]["category"] == "Shirts"
