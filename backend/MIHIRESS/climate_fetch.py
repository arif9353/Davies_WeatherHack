import requests
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("WEATHER_API_KEY")
location = "Nerul"

def base_ret():
    try:
        url = f"http://api.weatherapi.com/v1/current.json?key={api_key}&q={location}"
        response = requests.get(url).json()
        temp = response["current"]["temp_c"]
        humidity = response["current"]["humidity"]
        wind_speed = response["current"]["wind_kph"]
        precipitation = response["current"]["precip_mm"]
        return {"temp": temp, "humidity": humidity, "wind": wind_speed, "precipitation": precipitation}
    except Exception as e:
        print(f"Error in climate_fetch's base_ret: {e}")
        return e
    

# Refer Followig for response of the api
# {
#   'location': {
#     'name': 'Nerul',
#     'region': 'Goa',
#     'country': 'India',
#     'lat': 15.5,
#     'lon': 73.78,
#     'tz_id': 'Asia/Kolkata',
#     'localtime_epoch': 1724003856,
#     'localtime': '2024-08-18 23:27'
#   },
#   'current': {
#     'last_updated_epoch': 1724003100,
#     'last_updated': '2024-08-18 23:15',
#     'temp_c': 27.1,
#     'temp_f': 80.8,
#     'is_day': 0,
#     'condition': {
#       'text': 'Light rain shower',
#       'icon': '//cdn.weatherapi.com/weather/64x64/night/353.png',
#       'code': 1240
#     },
#     'wind_mph': 4.9,
#     'wind_kph': 7.9,
#     'wind_degree': 305,
#     'wind_dir': 'NW',
#     'pressure_mb': 1008.0,
#     'pressure_in': 29.75,
#     'precip_mm': 0.76,
#     'precip_in': 0.03,
#     'humidity': 91,
#     'cloud': 63,
#     'feelslike_c': 32.0,
#     'feelslike_f': 89.6,
#     'windchill_c': 27.1,
#     'windchill_f': 80.8,
#     'heatindex_c': 32.0,
#     'heatindex_f': 89.6,
#     'dewpoint_c': 25.5,
#     'dewpoint_f': 77.8,
#     'vis_km': 10.0,
#     'vis_miles': 6.0,
#     'uv': 1.0,
#     'gust_mph': 7.7,
#     'gust_kph': 12.4
#   }
# }