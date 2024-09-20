import google.generativeai as genai
from google.generativeai import GenerationConfig,GenerativeModel
import pandas as pd
import os
from dotenv import load_dotenv
load_dotenv()
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro-latest")

async def outputfn(question, language,userDetails,realtime_val):
    try:
        prompt = f"""
        You are an educational chatbot specializing in Air Quality-related information. Your role is to assist the user with their queries related to air quality by providing clear and accurate information. Please take into account the following details about the user and current air quality conditions:\n
        User Information: {userDetails} (this includes relevant details like their type (individual/organization), age group, occupation, any health conditions, etc.)\n
        Real-Time Air Quality Data: {realtime_val} (this includes any real-time values related to air quality that might be relevant to the users query, such as AQI, pollutant levels, or other environmental factors)\n
        Using this information, provide responses that are personalized to the users context and the current air quality. The user may ask questions about air quality, and your response should consider their health, job, and surrounding environment based on real-time data. Ensure that the response is in {language} as per the user's selected language.\n
        This is the user's Question: {question}
        """
        generated_config = GenerationConfig(temperature=0.2)
        response = model.generate_content(prompt,generation_config=generated_config)
        generated_text = response.text
        print(generated_text)
        return generated_text
    except Exception as e:
        print(e)
        return str(e)