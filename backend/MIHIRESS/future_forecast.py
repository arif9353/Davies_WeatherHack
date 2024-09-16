from aqi_cal import ret
import joblib
import requests
import pandas as pd



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


# Function to load the ARIMA model and forecast for the next 8 hours
def load_and_forecast():
    # Load the current pollutant values using ret() function
    current_values = ret()["pollutants"]
    
    # List of pollutants we want to forecast
    pollutants = ['PM10', 'PM2.5', 'SO2', 'NO2', 'CO', 'O3']

    # Dictionary to store the forecasts
    forecasts = {}

    for pollutant in pollutants:
        try:
            # Load the corresponding ARIMA model for the pollutant
            model_filename = f"arima_model_{pollutant}.pkl"
            loaded_model = joblib.load(model_filename)
            
            # Get the current value for the pollutant
            current_value = current_values.get(pollutant, None)
            
            if current_value is not None:
                # Perform forecast for the next 8 hours
                forecast = loaded_model.forecast(steps=8)
                # Adjust the forecast to start from the current value using .iloc
                forecast = forecast + (current_value - forecast.iloc[0])
                forecasts[pollutant] = forecast
            else:
                forecasts[pollutant] = [0] * 8  # If no current value, return zeros

        except Exception as e:
            print(f"Error loading model for {pollutant}: {e}")
            forecasts[pollutant] = [0] * 8  # Use 0 to avoid generating None values
    print(f"\n\nfuture_fore/load/forecasts:\t\t {forecasts}\n\n")
    # Return the forecasts for each pollutant
    return forecasts

# Updated AQI Forecast Function
def forecast_aqi_for_8_hours():
    try:
        # Call the load_and_forecast function to get pollutant forecasts for the next 8 hours
        forecasts = load_and_forecast()

        # List of pollutants we are interested in
        pollutants = ['PM10', 'PM2.5', 'SO2', 'NO2', 'CO', 'O3']

        # List to store the final results for each of the next 8 hours
        forecast_aqi = []

        # Iterate over each hour's forecast
        for hour in range(8):
            # Prepare a dictionary of forecasted pollutant concentrations for this hour
            data = {}
            for pollutant in pollutants:
                # Extract the forecasted value using iloc to access by position
                forecast_series = forecasts[pollutant]
                if isinstance(forecast_series, pd.Series):
                    forecast_value = forecast_series.iloc[hour]  # Use .iloc to get the value by position
                    data[pollutant] = forecast_value
                else:
                    data[pollutant] = forecasts[pollutant][hour] if forecasts[pollutant][hour] != 0 else None

            # Skip the AQI calculation if all values are None
            if all(value is None for value in data.values()):
                continue
            
            print(f"\n\nData: {data}\n")
            # Calculate the AQI for each pollutant, skip if concentration is None
            aqi_val = {pollutant: calculate_aqi(concentration, breakpoints.get(pollutant, [])) for pollutant, concentration in data.items() if concentration is not None}

            if not aqi_val:  # If there are no valid AQI values
                continue

            # Find the overall AQI and associated health impact for this hour
            overall_aqi = max(aqi_val.values()) if aqi_val else None
            if overall_aqi:
                remark, health_impact = get_aqi_cat(overall_aqi)
                pollutant_res = max(aqi_val, key=aqi_val.get)

                # Add the results to the forecast_aqi list
                forecast_aqi.append({
                    "hour": hour + 1,
                    "pollutants": aqi_val,
                    "overall_aqi": overall_aqi,
                    "remark": remark,
                    "impact": health_impact,
                    "main_pollutant": pollutant_res
                })

        return forecast_aqi

    except Exception as e:
        print(f"Error in forecasting AQI: {e}")
        return {"error": str(e)}
