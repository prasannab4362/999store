import json
import os
from typing import Dict, Any, List, Optional

STORAGE_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "storage.json")

class PersistentStorageManager:
    """
    Handles JSON file-backed persistent session storage for user carts, conversation states, and memory profiles.
    Ensures state survives server restarts and page refreshes.
    """
    def __init__(self, filepath: str = STORAGE_FILE):
        self.filepath = filepath
        self._ensure_storage_dir()

    def _ensure_storage_dir(self):
        os.makedirs(os.path.dirname(self.filepath), exist_ok=True)
        if not os.path.exists(self.filepath):
            self._save_all({"carts": {}, "states": {}, "analytics": []})

    def _load_all(self) -> Dict[str, Any]:
        try:
            if os.path.exists(self.filepath):
                with open(self.filepath, "r", encoding="utf-8") as f:
                    return json.load(f)
        except Exception:
            pass
        return {"carts": {}, "states": {}, "analytics": []}

    def _save_all(self, data: Dict[str, Any]):
        try:
            with open(self.filepath, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving storage data: {e}")

    def load_carts(self) -> Dict[str, List[Dict[str, Any]]]:
        data = self._load_all()
        return data.get("carts", {})

    def save_carts(self, carts: Dict[str, List[Dict[str, Any]]]):
        data = self._load_all()
        data["carts"] = carts
        self._save_all(data)

    def load_states(self) -> Dict[str, Dict[str, Any]]:
        data = self._load_all()
        return data.get("states", {})

    def save_states(self, states: Dict[str, Dict[str, Any]]):
        data = self._load_all()
        data["states"] = states
        self._save_all(data)

    def log_analytics_event(self, event: Dict[str, Any]):
        data = self._load_all()
        analytics = data.get("analytics", [])
        analytics.append(event)
        # Keep last 500 events
        data["analytics"] = analytics[-500:]
        self._save_all(data)

    def get_analytics(self) -> List[Dict[str, Any]]:
        data = self._load_all()
        return data.get("analytics", [])

storage_manager = PersistentStorageManager()
