import os
import asyncio
from openai import OpenAI, AsyncOpenAI
import google.generativeai as genai
from backend.models import RiskAssessment

async def generate_with_openai(prompt: str) -> str:
    openai_key = os.getenv("OPENAI_API_KEY")
    if not openai_key:
        raise Exception("OpenAI API Key missing")

    client = AsyncOpenAI(api_key=openai_key)
    print("Attempting OpenAI generation...")
    response = await asyncio.wait_for(
        client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        ),
        timeout=8.0 
    )
    return response.choices[0].message.content

async def generate_with_gemini(prompt: str) -> str:
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        raise Exception("Gemini API Key missing")

    genai.configure(api_key=gemini_key)
    model = genai.GenerativeModel('gemini-pro')
    
    loop = asyncio.get_event_loop()
    response = await loop.run_in_executor(
        None, 
        lambda: model.generate_content(prompt)
    )
    return response.text

async def generate_response(prompt: str, provider: str, risk: RiskAssessment, context: str = "") -> (str, str, bool):
    """
    Legacy wrapper for compatibility if needed, though main.py will likely use specific functions.
    """
    if risk.risk_level == "HIGH":
        return "I cannot fulfill this request due to high safety risk detection.", "none", False

    full_prompt = f"Context: {context}\n\nUser Query: {prompt}" if context else prompt
    
    if provider == "openai":
        try:
            content = await generate_with_openai(full_prompt)
            return content, "gpt-3.5-turbo", False
        except Exception as e:
            print(f"⚠️ OpenAI Failed: {e}")
            # Fall through to Gemini

    try:
        content = await generate_with_gemini(full_prompt)
        return content, "gemini-pro-fallback", True
    except Exception as e:
        print(f"Gemini also failed: {e}")
        return "System Error: All models unavailable.", "none", True
