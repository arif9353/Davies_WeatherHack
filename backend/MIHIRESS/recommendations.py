import google.generativeai as genai
import json

# Step 1: Initialize the API key
genai.configure(api_key="AIzaSyCyM56FJ679pGZsUZ5aYNi2gOZEtoUWxAw")

# Step 2: Initialize the model directly
model = genai.GenerativeModel("gemini-1.5-flash")

# Step 3: Function to generate AQI-based recommendations using the working generate_content method
def outdoor(aqi, pollutant, temperature, humidity, wind_speed, userdetails, future_forecast):
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

    Additionally, the forecast for PM10 levels over the next 8 hours is as follows:
    {future_forecast}
    
    User Details: {userdetails} (this includes information like their type (individual/organization), age group, occupation, any health conditions, etc.).

    Based on the current and forecasted air quality data, and taking into account the user's details, please provide **exactly 16 recommendations** for outdoor activities and precautions with a focus on the user's context:

    - If the user is an **individual** with health conditions (e.g., respiratory issues or other conditions), provide recommendations to help reduce health risks. These recommendations should include steps they can take to minimize exposure to pollutants, stay safe outdoors, and maintain their well-being.
    
    - If the user is a **government official**, focus on strategies or steps the government can implement to lessen pollution in the area. Provide practical policies or initiatives that would improve air quality and reduce pollutant levels.

    - If the user is an **organization**, recommend strategies or practices that can be implemented organization-wide. These might include reducing emissions, promoting air quality awareness, or creating safer work environments for employees.

    Each recommendation should include:
    - A **title** and a **description**.
    - Suggestions for **personal protective equipment (PPE)** where applicable.
    - Ensure recommendations are tailored to the user's health, type (individual/organization/government), and forecasted PM10 data for the next 8 hours.

    The output should be formatted as a **nested JSON object** with two fields: `title` and `description` for each recommendation. Recommendations should be concise and to the point, addressing both **minimizing health risks** and maintaining **comfort** based on the environmental data.

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
    NOTE: Provide a valid JSON format without adding JSON bash commands.
"""

    
    # Generate response using the generate_content method from the working model
    response = model.generate_content(prompt)
    
    # Extract and return the recommendations from the response
    recommendations = response.text.strip()  # Strip any excess whitespace
    recommendations = recommendations.replace("```json", "").replace("```", "").strip()
    recommendations = json.loads(recommendations)
    return recommendations


def indoor(aqi, pollutant, temperature, humidity, wind_speed, userdetails, future_forecast):
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
    The current indoor Air Quality Index (AQI) is {aqi}, with the primary indoor pollutant being {pollutant}. 
    The temperature indoors is {temperature}°C, humidity is {humidity}%, and wind speed is {wind_speed}.

    Additionally, the forecast for indoor air quality over the next 8 hours is as follows:
    {future_forecast}
    
    User Details: {userdetails} (this includes information like their type (individual/organization), age group, occupation, any health conditions, etc.).

    Based on the current and forecasted indoor air quality data, and taking into account the user's details, please provide **exactly 16 recommendations** related to indoor air quality, with a focus on maintaining a healthy indoor environment:

    - If the user is an **individual** with health conditions (e.g., respiratory issues or other conditions), provide recommendations that can help reduce their exposure to indoor pollutants. Include advice on how to improve indoor air quality, such as using air purifiers, managing humidity, or improving ventilation.

    - If the user is a **government official**, focus on strategies or regulations the government could implement to ensure better indoor air quality in public spaces and offices. Provide practical measures or policies that would improve air quality in schools, hospitals, government buildings, and other public facilities.

    - If the user is an **organization**, recommend strategies or best practices that can be implemented across the workplace to improve indoor air quality for employees. These could include better HVAC management, encouraging indoor air quality monitoring, or setting air quality standards for indoor environments.

    Each recommendation should include:
    - A **title** and a **description**.
    - Suggestions for **equipment** (like air purifiers, dehumidifiers, or ventilation improvements) where applicable.
    - Recommendations should be tailored to the user's health, type (individual/organization/government), and forecasted indoor AQI data for the next 8 hours.

    The output should be formatted as a **nested JSON object** with two fields: `title` and `description` for each recommendation. Recommendations should be concise and to the point, addressing both **minimizing health risks** and maintaining **comfort** based on the indoor environmental data.

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
    NOTE: Provide a valid JSON format without adding JSON bash commands.
"""

    
    # Generate response using the generate_content method from the working model
    response = model.generate_content(prompt)
    
    # Extract and return the recommendations from the response
    recommendations = response.text.strip()  # Strip any excess whitespace
    recommendations = recommendations.replace("```json", "").replace("```", "").strip()
    recommendations = json.loads(recommendations)
    return recommendations


