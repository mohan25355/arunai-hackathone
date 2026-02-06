import asyncio

from backend.rag_engine import rag_engine

async def retrieve_context(prompt: str) -> dict:
    # Use the in-memory RAG engine
    results = rag_engine.search(prompt)
    
    if not results:
        return {"text": "", "sources": []}
        
    # Format context for LLM
    context_str = "Relevant Context:\n"
    for res in results:
        context_str += f"- [{res['title']}]: {res['content'][:200]}...\n"
        
    return {"text": context_str, "sources": results}
