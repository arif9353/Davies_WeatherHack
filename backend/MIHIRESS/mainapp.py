from fastapi import FastAPI, Request, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import requests

from aqi_cal import get_aqi_cat, calculate_aqi, ret
from climate_fetch import base_ret

app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_header=["*"],
# )


@app.get('/weather_and_aqi')
async def get_aqi_and_climate_data():
    try:
        answer = ret()
        climate = base_ret()
        answer["temp"] = climate["temp"]
        answer["humidity"] = climate["humidity"]
        answer["wind"] = climate["wind"]
        answer["precipitation"] = climate["precipitation"]
        print(f"AQI Val: {answer['pollutants']}\nOverall AQI: {answer['aqi']}\nPollutant Responsible: {answer['pollutant_res']}\nRemark: {answer['remark']}\nImpact: {answer['impact']}")
        return JSONResponse(content={"message": answer, "success": True}, status_code=200)
    except Exception as e:
        print(f"Error is {e}")
        return JSONResponse(content={"message": f"Error: {str(e)}", "success": False}, status_code=500)
    

# UNDER DEVELOPEMENT: Do not use as of now!
@app.get('/future_values')
async def future_prediction():
    try:
        aqi_columns = ['AQI_PM2.5', 'AQI_PM10', 'AQI_NO2', 'AQI_CO', 'AQI_SO2']
        future_predictions = []
        # current_seq = data[-seq_length:]
        return JSONResponse(content={"message": "hi", "success": True}, status_code=200)
    except Exception as e:
        print(f"Error: {e}")
        return JSONResponse(content={"message": e, "success": False}, status_code=500)