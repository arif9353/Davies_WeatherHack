from fastapi import FastAPI, Request, Form,UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import json
import os, base64, subprocess
from aqi_cal import get_aqi_cat, calculate_aqi, ret, calculate_multiple_aqi, ret_future
from climate_fetch import base_ret
from forecast import forecast_aqi
from recommendation import recommend
from trend_analysis import fetch_trend_data
from future_forecast import forecast_aqi_for_8_hours, load_and_forecast
from recommendations import outdoor, indoor
from indoor import indoor_aqi
from chat_fin import outputfn
from bhashini import translation, text_to_speech, transcribe
app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_header=["*"],
# )
load_dotenv()

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
        # answer["recommendation"] = recommend()
        print(f"AQI Val: {answer['pollutants']}\nOverall AQI: {answer['aqi']}\nPollutant Responsible: {answer['pollutant_res']}\nRemark: {answer['remark']}\nImpact: {answer['impact']}")
        # model_address = "../ARIF/AQI_Weather_Data.csv"
        # future_df = forecast_aqi(model_address)
        # future_df["AQI_CO"] /= 1000
        # future = []
        # for row in future_df.iterrows():
        #     future.append(ret_future(row[1]["AQI_PM2.5"], row[1]["AQI_PM10"], row[1]["AQI_NO2"], row[1]["AQI_CO"], row[1]["AQI_SO2"], (row[0].time()).hour))
        return JSONResponse(content={"message": answer, "success": True}, status_code=200)
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
    
# @app.get('/forecast_aqi')
# async def get_forecasted_aqi():
#     try:
#         # Call the function to get the forecasted AQI values
#         forecast_aqi = forecast_aqi_for_8_hours()
#         # Return the forecasted AQI values as a nested JSON
#         return JSONResponse(content={"message": forecast_aqi, "success": True}, status_code=200)
    
#     except Exception as e:
#         print(f"Error: {e}")
#         return JSONResponse(content={"message": str(e), "success": False}, status_code=500)


@app.get('/forecast_aqi')
async def get_forecasted_aqi():
    try:
        forecasts = load_and_forecast()
        # forecasts = forecasts.to_json(orient='records') 
        for ele in forecasts:
            forecasts[ele] = forecasts[ele].tolist()
        forecasts = json.dumps(forecasts)        
        print(f"\n\nForecast_aqi/current_val: {type(forecasts)}")
        forecasts = forecasts.replace('\\"', '"')
        forecasts = json.loads(forecasts)
        aqis = calculate_multiple_aqi(forecasts)
        print(f"AQIsss: {aqis}")
        return JSONResponse(content={"message": aqis, "success": True}, status_code=200)
    except Exception as e:
        print(f"Error: {e}")
        return JSONResponse(content={"message": str(e), "success": False}, status_code=500)

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
        query = '("Air Quality Index of India" OR "AQI of India" OR "air pollution in India" OR "air quality in India" OR "Air Quality Index" OR "AQI" OR "air pollution" OR "air quality" OR "Air Quality Index of Mumbai" OR "AQI of Mumbai" OR "air pollution in Mumbai" OR "air quality in Mumbai")'
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



@app.post('/outdoor_recommendations')
async def outdoor_recom(request: Request):
    try:
        # Parse incoming data from request body
        body = await request.json()
        future_forecast_aqi = body.get("futureforecastAQI")
        user_details = body.get("userDetails")
        answer = ret()
        climate = base_ret()
        answer["temp"] = climate["temp"]
        answer["humidity"] = climate["humidity"]
        answer["wind"] = climate["wind"]
        answer["precipitation"] = climate["precipitation"]
        respo = outdoor(answer["aqi"], answer["pollutant_res"], answer["temp"], answer["humidity"], answer["wind"], user_details,future_forecast_aqi)
        print(respo)
        return JSONResponse(content={"message": respo, "success": True}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"message": e, "success": False}, status_code=500)


@app.post('/indoor')
async def indoor_recom(request: Request):
    try:
        endpoint = "https://blogcontent.site/projects/indooraqi.php"
        respo = requests.get(endpoint).json()
        answer = {}
        body = await request.json()
        future_forecast_aqi = body.get("futureforecastAQI")
        user_details = body.get("userDetails")
        answer["aqi"], answer["pollutant_res"] = indoor_aqi(int(respo["pm2p5"]), int(respo["pm10"]))
        climate = base_ret()
        answer["temp"] = climate["temp"]
        answer["humidity"] = climate["humidity"]
        answer["wind"] = climate["wind"]
        answer["precipitation"] = climate["precipitation"]
        respo = indoor(answer["aqi"], answer["pollutant_res"], answer["temp"], answer["humidity"], answer["wind"], user_details,future_forecast_aqi)
        print(respo)
        return JSONResponse(content={"message": answer, "future": respo, "success": True}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"message": e, "success": False}, status_code=500)
    
@app.post('/chattext')
async def chattext(request:Request):
    try:
        # text = await request.json()
        translate_text = None
        reponse = await request.json()
        text = reponse["message"]
        language = reponse["language"]
        user_details = reponse["userdetails"]
        realtime_val = reponse["AQI"]
        if language == "English":
            translate_text = text
        else:
            translate_response = await translation(language,"English",text)
            translate_text = translate_response["translated_content"]
        print("\n\n")
        print(translate_text)
        result = await outputfn(translate_text, language, user_details, realtime_val)
        return JSONResponse(content={"message":result, "success":True}, status_code=200)
    except Exception as e:
        print(str(e))
        return JSONResponse(content={"message":"Failure ho gaya", "success":False}, status_code=500)

@app.post('/chat_audio')
async def chataudio(language: str = Form(...), file: UploadFile = Form(...)):
    try:
        print(language)
        command = ["ffmpeg", "-i", "-", "-acodec", "libmp3lame", "-f", "mp3", "-"]
        process = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        file_content = await file.read()
        output, error = process.communicate(input=file_content)
        if process.returncode != 0:
            return JSONResponse(status_code=500, content={"message":f"FFmpeg error: {error.decode()}"})
        base64_encoded_data = base64.b64encode(output).decode('utf-8')
        source_text = await transcribe(language,base64_encoded_data)
        text = source_text["transcribed_content"]
        return JSONResponse(content={"message": text, "success": True}, status_code=200)
    except Exception as e:
        print(e)
        return JSONResponse(content={"message": "Try failure", "success": False}, status_code=500)