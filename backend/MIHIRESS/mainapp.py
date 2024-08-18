from fastapi import FastAPI, Request, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import requests

from aqi_cal import get_aqi_cat, calculate_aqi, ret

app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_header=["*"],
# )


@app.get('/aqi_recommendation')
async def aqi_rec_ret():
    try:
        answer = ret()
        print(f"AQI Val: {answer['pollutants']}\nOverall AQI: {answer['aqi']}\nPollutant Responsible: {answer['pollutant_res']}\nRemark: {answer['remark']}\nImpact: {answer['impact']}")
        return JSONResponse(content={"message": answer, "success": True}, status_code=200)
    except Exception as e:
        print(f"Error is {e}")
        return JSONResponse(content={"message": f"Error: {str(e)}", "success": False}, status_code=500)