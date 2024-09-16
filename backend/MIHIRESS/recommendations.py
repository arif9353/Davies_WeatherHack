import google.generativeai as genai
import json

# Step 1: Initialize the API key
genai.configure(api_key="AIzaSyCyM56FJ679pGZsUZ5aYNi2gOZEtoUWxAw")

# Step 2: Initialize the model directly
model = genai.GenerativeModel("gemini-1.5-flash")

# Step 3: Function to generate AQI-based recommendations using the working generate_content method
def outdoor(aqi, pollutant, temperature, humidity, wind_speed):
    """
    Generate recommendations based on AQI, pollutant, and environmental conditions.
    :param aqi: Current AQI value.
    :param pollutant: Pollutant responsible for AQI.
    :param temperature: Current temperature in °C.
    :param humidity: Current humidity in %.
    :param wind_speed: Current wind speed in m/s.
    :return: Recommendations for outdoor or indoor activity.
    """
    
    # Construct a detailed prompt for the LLM
    prompt = f"""
    The current Air Quality Index (AQI) is {aqi}, with the primary pollutant being {pollutant}. 
    The temperature is {temperature}°C, humidity is {humidity}%, and wind speed is {wind_speed} m/s.
    
    Based on this data, please provide **exactly 16 recommendations** for outdoor activities, 
    with a focus on health precautions, for various groups such as children, the elderly, 
    , people with respiratory conditions, working adults, teens, etc.
    
    Each recommendation should include a **title** and a **description**. 
    Additionally, suggest appropriate **personal protective equipment (PPE)** where applicable. 
    
    The output should be formatted as a **nested JSON object** with two fields: `title` and `description` for each recommendation. 
    Recommendations should be concise and to the point, addressing both **minimizing health risks** and maintaining **comfort** based on the environmental data.

    Example JSON structure:
    {{
        "recommendations": [
            {{
                "title": "Title of the recommendation 1",
                "description": "Brief explanation of the recommendation."
            }},
            {{
                "title": "Title of the recommendation 2",
                "description": "Brief explanation of the recommendation."
            }}
        ]
    }}

    Ensure there are exactly 16 recommendations in the same structure.
    NOTE: Dont add json bash give a proper json itself
    """
    
    # Generate response using the generate_content method from the working model
    response = model.generate_content(prompt)
    
    # Extract and return the recommendations from the response
    recommendations = response.text.strip()  # Strip any excess whitespace
    recommendations = recommendations.replace("```json", "").replace("```", "").strip()
    recommendations = json.loads(recommendations)
    return recommendations


def indoor(aqi, pollutant, temperature, humidity, wind_speed):
    """
    Generate recommendations based on AQI, pollutant, and environmental conditions.
    :param aqi: Current AQI value.
    :param pollutant: Pollutant responsible for AQI.
    :param temperature: Current temperature in °C.
    :param humidity: Current humidity in %.
    :param wind_speed: Current wind speed in m/s.
    :return: Recommendations for outdoor or indoor activity.
    """
    
    # Construct a detailed prompt for the LLM
    prompt = f"""
    The current Air Quality Index (AQI) is {aqi}, with the primary pollutant being {pollutant}. 
    The temperature is {temperature}°C, humidity is {humidity}%, and wind speed is {wind_speed} m/s.
    
    Based on this data, please provide **exactly 16 recommendations** for indoor activities, 
    with a focus on health precautions, for various groups such as children, the elderly, 
    , people with respiratory conditions, working adults, teens, etc.
    
    Each recommendation should include a **title** and a **description**. 
    Additionally, suggest appropriate **personal protective equipment (PPE)** where applicable. 
    
    The output should be formatted as a **nested JSON object** with two fields: `title` and `description` for each recommendation. 
    Recommendations should be concise and to the point, addressing both **minimizing health risks** and maintaining **comfort** based on the environmental data.

    Example JSON structure:
    {{
        "recommendations": [
            {{
                "title": "Title of the recommendation 1",
                "description": "Brief explanation of the recommendation."
            }},
            {{
                "title": "Title of the recommendation 2",
                "description": "Brief explanation of the recommendation."
            }}
        ]
    }}

    Ensure there are exactly 16 recommendations in the same structure.
    NOTE: Dont add json bash give a proper json itself
    """
    
    # Generate response using the generate_content method from the working model
    response = model.generate_content(prompt)
    
    # Extract and return the recommendations from the response
    recommendations = response.text.strip()  # Strip any excess whitespace
    recommendations = recommendations.replace("```json", "").replace("```", "").strip()
    recommendations = json.loads(recommendations)
    return recommendations


