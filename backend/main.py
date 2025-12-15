from typing import Union
import shutil
import os
import json

from fastapi import FastAPI, File, UploadFile, Form
from pydantic import BaseModel

from backend.my_langgraph_chain import llm_app
from backend.data import data
from backend.rag import RAG

class PromptRequest(BaseModel):
    user_prompt: list
    collection_name: str

class ChromaRequest(BaseModel):
    chroma_collection: str
    
app = FastAPI()

@app.get("/")
def test():
    """See if it's working"""
    return {"Test": "Works"}

@app.post("/api/chatgpt")
def get_llm_response(request: PromptRequest):
    """Send user prompt data from jsx to py"""
    # [("user", request.user_prompt)] , {"configurable": {"thread_id": request.collection_name}}
    conversation_array = data.change_object_to_basemessage(request.user_prompt)
    fixed_collection_name = data.normalize_collection_name(request.collection_name)
    
    result = llm_app.invoke({"messages": conversation_array, "collection_name": fixed_collection_name})

    return {"sender": "AI", "content": result["messages"][-1].content}

@app.post("/api/chromadb")
def delete_collection(request: ChromaRequest):
    """Delete chroma collection"""
    fixed_collection_name = data.normalize_collection_name(request.chroma_collection)
    RAG.delete_collection(fixed_collection_name)

    return fixed_collection_name

@app.post("/api/file-input")
async def add_rag_data(file: UploadFile = File(...), activeChat: str = Form(...)):
    """Add rag context""" 
    contents = await file.read()

    response = data.data_pick_file(file_content_type=file.content_type, contents=contents, active_chat=activeChat)

    return response