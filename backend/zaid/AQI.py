from datetime import datetime
import pytz


india_timezone = pytz.timezone('Asia/Kolkata')
current_datetime = datetime.now(india_timezone).strftime("%A, %d %b %Y %I:%M %p")
# Define the breakpoint table for each pollutant
breakpoints = {
    'PM2.5': [(0, 30, 0, 50), (31, 60, 51, 100), (61, 90, 101, 200), (91, 120, 201, 300), (121, 250, 301, 400), (251, 500, 401, 500)],
    'PM10': [(0, 50, 0, 50), (51, 100, 51, 100), (101, 250, 101, 200), (251, 350, 201, 300), (351, 430, 301, 400), (431, 500, 401, 500)],
    'NO2': [(0, 40, 0, 50), (41, 80, 51, 100), (81, 180, 101, 200), (181, 280, 201, 300), (281, 400, 301, 400), (401, 1000, 401, 500)],
    'SO2': [(0, 40, 0, 50), (41, 80, 51, 100), (81, 380, 101, 200), (381, 800, 201, 300), (801, 1600, 301, 400), (1601, 2100, 401, 500)],
    'CO': [(0, 1, 0, 50), (1.1, 2, 51, 100), (2.1, 10, 101, 200), (10.1, 17, 201, 300), (17.1, 34, 301, 400), (34.1, 50, 401, 500)],
    'O3': [(0, 50, 0, 50), (51, 100, 51, 100), (101, 168, 101, 200), (169, 208, 201, 300), (209, 748, 301, 400), (749, 1000, 401, 500)],
    'NH3': [(0, 200, 0, 50), (201, 400, 51, 100), (401, 800, 101, 200), (801, 1200, 201, 300), (1201, 1800, 301, 400), (1801, 2000, 401, 500)]
}

# AQI categories and health impacts
aqi_categories = [
    (0, 50, "Good", "Minimal impact"),
    (51, 100, "Satisfactory", "Minor breathing discomfort to sensitive people"),
    (101, 200, "Moderate", "Breathing discomfort to the people with lungs, asthma, and heart diseases"),
    (201, 300, "Poor", "Breathing discomfort to most people on prolonged exposure"),
    (301, 400, "Very Poor", "Respiratory illness on prolonged exposure"),
    (401, 500, "Severe", "Affects healthy people and seriously impacts those with existing diseases")
]

def calculate_aqi(concentration, breakpoints):
    for (BP_LO, BP_HI, I_LO, I_HI) in breakpoints:
        if BP_LO <= concentration <= BP_HI:
            Ip = ((I_HI - I_LO) / (BP_HI - BP_LO)) * (concentration - BP_LO) + I_LO
            return round(Ip, 3)
    return None  # If the concentration is out of the provided breakpoints

def get_aqi_category(aqi):
    for (low, high, remark, impact) in aqi_categories:
        if low <= aqi <= high:
            return remark, impact
    return None, None

#  data 
data = {
    'PM2.5': 7.83,
    'PM10': 11.72,
    'NO2': 4.63,
    'O3': 33.26,
    'SO2': 4.77,
    'CO': 257.02,  # in µg/m³, but needs to be converted to mg/m³
    'NH3': 1.24  # Example concentration in µg/m³
}


data['CO'] = data['CO'] / 1000  # Now CO is in mg/m³

aqi_values = {pollutant: calculate_aqi(concentration, breakpoints[pollutant]) for pollutant, concentration in data.items()}

overall_aqi = max(aqi_values.values())
remark, health_impact = get_aqi_category(overall_aqi)

print("Individual AQI values:", aqi_values)
print("Overall AQI:", overall_aqi)
print("Remark:", remark)
print("Possible Health Impacts:", health_impact)

# output
print("\nDetailed Pollutant Summary:")
for pollutant, concentration in data.items():
    pollutant_aqi = aqi_values[pollutant]
    print(f"{pollutant}: Concentration = {concentration} µg/m³, AQI = {pollutant_aqi}")

# summary
station_summary = {
    'Location': 'Nerul, Navi Mumbai - MPCB',
    'Date and Time': current_datetime,
    'Overall AQI': overall_aqi,
    'Prominent Pollutant': max(aqi_values, key=aqi_values.get),
    'Remark': remark,
    'Possible Health Impacts': health_impact,
}

print("\nAQI Station Summary:")
for key, value in station_summary.items():
    print(f"{key}: {value}")
