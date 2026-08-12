from fastapi import APIRouter
from typing import Dict, Any, List
from app.db.storage import storage_manager

router = APIRouter(prefix="/api/v1", tags=["Analytics"])

@router.get("/analytics")
def get_analytics_metrics() -> Dict[str, Any]:
    """
    Returns real-time analytics metrics for AI shopping assistant:
    - Total persistent turns processed
    - Active carts count
    - Analytics log events summary
    """
    carts = storage_manager.load_carts()
    states = storage_manager.load_states()
    events = storage_manager.get_analytics()
    
    total_active_carts = len(carts)
    total_items_in_carts = sum(len(c) for c in carts.values())
    
    return {
        "status": "online",
        "metrics": {
            "total_active_sessions": len(states),
            "total_active_carts": total_active_carts,
            "total_cart_items": total_items_in_carts,
            "logged_events_count": len(events),
            "recent_events": events[-10:] if events else []
        }
    }
