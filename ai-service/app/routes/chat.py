from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.agents.graph import agent

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: str
    channel: str = "web"
    message: str
    thread_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    retrieved_products: List[Dict[str, Any]] = []
    requires_human_handoff: bool = False
    thread_id: str

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    thread_id = request.thread_id or f"thread_{request.user_id}"
    
    result = agent.process_turn(
        user_id=request.user_id,
        channel=request.channel,
        message=request.message,
        thread_id=thread_id
    )
    
    return ChatResponse(
        reply=result["reply"],
        retrieved_products=result["retrieved_products"],
        requires_human_handoff=result["requires_human_handoff"],
        thread_id=result["thread_id"]
    )
