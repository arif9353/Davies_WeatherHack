from fastapi import FastAPI, Request, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import requests
from dotenv import load_dotenv
import os
from bs4 import BeautifulSoup

from aqi_cal import get_aqi_cat, calculate_aqi, ret, ret_future
from climate_fetch import base_ret
from forecast import forecast_aqi
from recommendation import recommend
from trend_analysis import fetch_trend_data

app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_header=["*"],
# )

api_key = os.getenv("NEWS_API_KEY")

@app.get('/weather_and_aqi')
async def get_aqi_and_climate_data():
    try:
        answer = ret()
        climate = base_ret()
        answer["temp"] = climate["temp"]
        answer["humidity"] = climate["humidity"]
        answer["wind"] = climate["wind"]
        answer["precipitation"] = climate["precipitation"]
        answer["recommendation"] = recommend()
        print(f"AQI Val: {answer['pollutants']}\nOverall AQI: {answer['aqi']}\nPollutant Responsible: {answer['pollutant_res']}\nRemark: {answer['remark']}\nImpact: {answer['impact']}")
        model_address = "../ARIF/AQI_Weather_Data.csv"
        future_df = forecast_aqi(model_address)
        future_df["AQI_CO"] /= 1000
        future = []
        for row in future_df.iterrows():
            future.append(ret_future(row[1]["AQI_PM2.5"], row[1]["AQI_PM10"], row[1]["AQI_NO2"], row[1]["AQI_CO"], row[1]["AQI_SO2"], (row[0].time()).hour))
        return JSONResponse(content={"message": answer, "future": future, "success": True}, status_code=200)
    except Exception as e:
        print(f"Error is {e}")
        return JSONResponse(content={"message": f"Error: {str(e)}", "success": False}, status_code=500)
    

# UNDER DEVELOPEMENT: Do not use as of now!
@app.get('/future_values')
async def future_prediction():
    try:
        model_address = "../ARIF/AQI_Weather_Data.csv"
        future_df = forecast_aqi(model_address)
        future_df["AQI_CO"] /= 1000
        future = []
        for row in future_df.iterrows():
            future.append(ret_future(row[1]["AQI_PM2.5"], row[1]["AQI_PM10"], row[1]["AQI_NO2"], row[1]["AQI_CO"], row[1]["AQI_SO2"], (row[0].time()).hour))
        return JSONResponse(content={"message": future, "success": True}, status_code=200)
    except Exception as e:
        print(f"Error: {e}")
        return JSONResponse(content={"message": e, "success": False}, status_code=500)
    

@app.get('/trend_analysis')
async def fetch_trend():
    try:
        file_path = './data/data_college.csv'
        data = fetch_trend_data(file_path)
        # print(data)
        return JSONResponse(content={"message": data, "success": True}, status_code=200)
    except Exception as e:
        print(f"Error: {e}")
        return JSONResponse(content={"message": e, "success": False}, status_code=500)
    

@app.get('/aqi_news')
async def get_aqi_news():
    try:
        # Use a more specific query to focus on AQI-related news
        query = '("Air Quality Index" OR "AQI" OR "air pollution" OR "air quality")'
        url = f'https://newsapi.org/v2/everything?q={query}&language=en&apiKey={api_key}&pageSize=20'
        response = requests.get(url)
        response.raise_for_status()  # Check if the request was successful

        data = response.json()

        if data['status'] == 'ok' and data['totalResults'] > 0:
            news_headlines = [{'title': article['title'], 'url': article['url']} for article in data['articles']]
            return JSONResponse(content={"message": news_headlines, "success": True}, status_code=200)
        else:
            return JSONResponse(content={"message": "No headlines found", "success": False}, status_code=200)

    except requests.exceptions.RequestException as e:
        print(f"Request Error: {e}")
        return JSONResponse(content={"message": "Failed to fetch news", "success": False}, status_code=500)
    except Exception as e:
        print(f"Error: {e}")
        return JSONResponse(content={"message": str(e), "success": False}, status_code=500)
