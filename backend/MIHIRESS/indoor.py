# AQI Breakpoints for PM2.5 (µg/m³)
pm2p5_breakpoints = [
    (0, 12, 0, 50),
    (12.1, 35.4, 51, 100),
    (35.5, 55.4, 101, 150),
    (55.5, 150.4, 151, 200),
    (150.5, 250.4, 201, 300),
    (250.5, 500.4, 301, 500)
]

# AQI Breakpoints for PM10 (µg/m³)
pm10_breakpoints = [
    (0, 54, 0, 50),
    (55, 154, 51, 100),
    (155, 254, 101, 150),
    (255, 354, 151, 200),
    (355, 424, 201, 300),
    (425, 604, 301, 500)
]

def calculate_aqi(concentration, breakpoints):
    for bp in breakpoints:
        if bp[0] <= concentration <= bp[1]:
            # AQI formula
            aqi = ((bp[3] - bp[2]) / (bp[1] - bp[0])) * (concentration - bp[0]) + bp[2]
            return round(aqi)
    return None

def indoor_aqi(pm2p5_value, pm10_value):
    # Calculate AQI for PM2.5 and PM10
    aqi_pm2p5 = calculate_aqi(pm2p5_value, pm2p5_breakpoints)
    aqi_pm10 = calculate_aqi(pm10_value, pm10_breakpoints)

    # Determine the higher AQI and the pollutant responsible
    if aqi_pm2p5 >= aqi_pm10:
        final_aqi = aqi_pm2p5
        responsible_pollutant = "PM2.5"
    else:
        final_aqi = aqi_pm10
        responsible_pollutant = "PM10"

    return final_aqi, responsible_pollutant

