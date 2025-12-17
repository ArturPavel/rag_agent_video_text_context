from typing import Annotated, Sequence, TypedDict
from dotenv import load_dotenv  
from langchain_core.messages import BaseMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph.message import add_messages
from langgraph.graph import StateGraph, END
# from langgraph.checkpoint.memory import InMemorySaver  

from .rag import RAG

load_dotenv()

# checkpointer = InMemorySaver()

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    collection_name: str
    rag_info: str
    
model = ChatOpenAI(model="gpt-4.1-mini")

def llm_rag_node(state: AgentState) -> AgentState:
    """Passes the input into chormadb for similarity_search"""
    result = RAG.similarity_search(state["messages"][-1].content, state["collection_name"])
    try:
        state["rag_info"] = result[0].page_content
    except IndexError:
        state["rag_info"] = "|||No information found|||"
        print("No database set up for this part")

    return state

def llm_call_node(state: AgentState) -> AgentState:
    """This node sends a query to the llm"""
    system_prompt = SystemMessage(content=f"You are an agent specifically designed to speed up information recollection from films, audio and images. You must use the context provided for you in rag storage, except if it is |||No information found|||, then add $ to the start of your answer and answer in the best way possible without context. Your output should be a single string. RAG context: {state["rag_info"]}")

    response = model.invoke([system_prompt, *state["messages"]])
    return {"messages": [response]}

    
graph = StateGraph(AgentState)
graph.add_node("our_agent", llm_call_node)
graph.add_node("our_rag", llm_rag_node)
graph.set_entry_point("our_rag")
graph.add_edge("our_rag", "our_agent")
graph.set_finish_point("our_agent")

llm_app = graph.compile()

# checkpointer=checkpointer
# result = llm_app.invoke({"messages": [("user", "Hello my name is bob")], "collection_name": "Bob"}, {"configurable": {"thread_id": "Bob"}},)

# print(result)