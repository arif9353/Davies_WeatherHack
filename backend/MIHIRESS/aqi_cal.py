import requests
import dotenv

aqi_categories = [
    (0, 50, "Good", "Minimal impact"),
    (51, 100, "Satisfactory", "Minor breathing discomfort to sensitive people"),
    (101, 200, "Moderate", "Breathing discomfort to the people with lungs, asthma, and heart diseases"),
    (201, 300, "Poor", "Breathing discomfort to most people on prolonged exposure"),
    (301, 400, "Very Poor", "Respiratory illness on prolonged exposure"),
    (401, 500, "Severe", "Affects healthy people and seriously impacts those with existing diseases")
]
breakpoints = {
    'PM2.5': [(0, 30, 0, 50), (31, 60, 51, 100), (61, 90, 101, 200), (91, 120, 201, 300), (121, 250, 301, 400), (251, 500, 401, 500)],
    'PM10': [(0, 50, 0, 50), (51, 100, 51, 100), (101, 250, 101, 200), (251, 350, 201, 300), (351, 430, 301, 400), (431, 500, 401, 500)],
    'NO2': [(0, 40, 0, 50), (41, 80, 51, 100), (81, 180, 101, 200), (181, 280, 201, 300), (281, 400, 301, 400), (401, 1000, 401, 500)],
    'SO2': [(0, 40, 0, 50), (41, 80, 51, 100), (81, 380, 101, 200), (381, 800, 201, 300), (801, 1600, 301, 400), (1601, 2100, 401, 500)],
    'CO': [(0, 1, 0, 50), (1.1, 2, 51, 100), (2.1, 10, 101, 200), (10.1, 17, 201, 300), (17.1, 34, 301, 400), (34.1, 50, 401, 500)],
    'O3': [(0, 50, 0, 50), (51, 100, 51, 100), (101, 168, 101, 200), (169, 208, 201, 300), (209, 748, 301, 400), (749, 1000, 401, 500)],
    'NH3': [(0, 200, 0, 50), (201, 400, 51, 100), (401, 800, 101, 200), (801, 1200, 201, 300), (1201, 1800, 301, 400), (1801, 2000, 401, 500)],
    # 'NO' : [(0, 40, 0, 50), (41, 80, 51, 100), (81, 180, 101, 200), (181, 280, 201, 300), (281, 400, 301, 400), (401, 1000, 401, 500)]
}

breakpoints_future = {
    'PM2.5': [(0, 30, 0, 50), (31, 60, 51, 100), (61, 90, 101, 200), (91, 120, 201, 300), (121, 250, 301, 400), (251, 500, 401, 500)],
    'PM10': [(0, 50, 0, 50), (51, 100, 51, 100), (101, 250, 101, 200), (251, 350, 201, 300), (351, 430, 301, 400), (431, 500, 401, 500)],
    'NO2': [(0, 40, 0, 50), (41, 80, 51, 100), (81, 180, 101, 200), (181, 280, 201, 300), (281, 400, 301, 400), (401, 1000, 401, 500)],
    'SO2': [(0, 40, 0, 50), (41, 80, 51, 100), (81, 380, 101, 200), (381, 800, 201, 300), (801, 1600, 301, 400), (1601, 2100, 401, 500)],
    'CO': [(0, 1, 0, 50), (1.1, 2, 51, 100), (2.1, 10, 101, 200), (10.1, 17, 201, 300), (17.1, 34, 301, 400), (34.1, 50, 401, 500)],
}

def calculate_aqi(concentration, breakpoints):
    for (BP_LO, BP_HI, I_LO, I_HI) in breakpoints:
        if BP_LO <= concentration <= BP_HI:
            Ip = ((I_HI - I_LO) / (BP_HI - BP_LO)) * (concentration - BP_LO) + I_LO
            return round(Ip, 3)
    return None

def get_aqi_cat(aqi):
    for(low, high, remark, impact) in aqi_categories:
        if low <= aqi <= high:
            return remark, impact
    return None, None

def ret():
    try:
        endpoint = "https://blogcontent.site/projects/aqinew.php"
        respo = requests.get(endpoint).json()
        # print(respo)
        data = {}
        data["PM10"] = int(float(respo["calulated_values"]["PM10"]))
        data["NO2"] = int(float(respo["calulated_values"]["O3"]))
        data["O3"] = int(float(respo["calulated_values"]["NO2"]))
        data["SO2"] = int(float(respo["calulated_values"]["SO2"]))
        data["NH3"] = 0
        # data["NO"] = 0
        data["PM2.5"] = int(float(respo["calulated_values"]["PM2.5"]))
        data["CO"] = int(round(float(respo["calulated_values"]["CO"]) / 1000, 2))
        aqi_val = {pollutant: calculate_aqi(concentration, breakpoints[pollutant]) for pollutant, concentration in data.items()}
        print(f"\n\nret/aqi_val: {aqi_val}")
        overall_aqi = max(aqi_val.values())
        # print(overall_aqi)
        remark, health_impact = get_aqi_cat(overall_aqi)
        # print(f"Remark: {remark}\n Impact: {health_impact}")
        pollutant_res = list(filter(lambda x: aqi_val[x] == overall_aqi, aqi_val))[0]
        return {"pollutants": data, "aqi": round(overall_aqi, 0), "remark": remark, "impact": health_impact, "pollutant_res": pollutant_res}
    except Exception as e:
        print(f"Exception in api_cal's ret method: {e}")
        return (e)
    


def calculate_multiple_aqi(input_data):
    try:
        # List to store AQI results for each set
        aqi_results = []

        # Get the number of sets (assuming all pollutant lists have the same length)
        num_sets = len(input_data['PM10'])

        print(f"aqi_cal/Num_sets: {num_sets}")

        # Iterate through each set of pollutants (by index)
        for i in range(num_sets):
            # Get the i-th concentration for each pollutant
            pollutants_set = {
                "PM10": input_data["PM10"][i],
                "PM2.5": input_data["PM2.5"][i],
                "SO2": input_data["SO2"][i],
                "NO2": input_data["NO2"][i],
                "CO": input_data["CO"][i],
                "O3": input_data["O3"][i],
            }

            print(f"aqi_cal/pollutants set: {pollutants_set}")

            # Calculate AQI for each pollutant in the current set, handling None cases
            aqi_val = {}
            for pollutant, concentration in pollutants_set.items():
                aqi_val[pollutant] = calculate_aqi(concentration, breakpoints[pollutant])
                
                # If AQI is None, assign a default low AQI value, or skip
                if aqi_val[pollutant] is None:
                    print(f"Warning: AQI calculation returned None for pollutant: {pollutant}")
                    aqi_val[pollutant] = 0  # You can change this to a suitable default

            # Find the overall AQI (the max of individual AQI values)
            overall_aqi = max(aqi_val.values())

            # Get the remark and health impact based on the overall AQI
            remark, health_impact = get_aqi_cat(overall_aqi)

            # Find the pollutant responsible for the highest AQI
            pollutant_res = list(filter(lambda x: aqi_val[x] == overall_aqi, aqi_val))[0]

            # Store the result for this set
            aqi_results.append({
                "aqi": overall_aqi,
                "pollutant_res": pollutant_res
            })

        return aqi_results

    except Exception as e:
        print(f"Exception in calculate_multiple_aqi: {e}")
        return []
    

def ret_future(pm2_5, pm10, no2, co, so2, time):
    try:
        data = {
            "PM2.5": pm2_5,
            "PM10": pm10,
            "NO2": no2,
            "CO": co,
            "SO2": so2
        }
        aqi_val = {}
        for pollutant, concentration in data.items():
            if pollutant in ['PM2.5', 'PM10', 'NO2', 'CO', 'SO2']:
                aqi_val[f'{pollutant}'] = calculate_aqi(concentration, breakpoints_future[pollutant])
        overall_aqi = max(aqi_val.values())
        remark, health_impact = get_aqi_cat(overall_aqi)
        pollutant_res = list(filter(lambda x: aqi_val[x] == overall_aqi, aqi_val))[0]
        return {
            "aqi": overall_aqi,
            "remark": remark,
            "impact": health_impact,
            "pollutant_res": pollutant_res,
            "time" : time
        }
    except Exception as e:
        print(f"Exception in ret method: {e}")
        return str(e)
