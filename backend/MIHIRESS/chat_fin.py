import google.generativeai as genai
from google.generativeai import GenerationConfig,GenerativeModel
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro-latest")

async def outputfn(question):
    try:
        prompt = f"""
        You are an educational chatbot which is well versed in Air Quality related information. The user will ask with any Air Quallity related 
        queries and you will have to answer them, if the query is not related to air quality then simply return I don't have enough knowledge to answer this question.
        \nThis is user's question:\n{question}
        """
        generated_config = GenerationConfig(temperature=0.7)
        response = model.generate_content(prompt,generation_config=generated_config)
        generated_text = response.text
        print(generated_text)
        return generated_text
    except Exception as e:
        print(e)
        return str(e)