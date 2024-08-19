import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model

def forecast_aqi(file_path, seq_length=24, future_steps=8):
    # Load and preprocess the dataset
    df = pd.read_csv(file_path)
    df.set_index('Date_Start Time', inplace=True)
    df.drop(['Sr.NO', 'End Time'], axis=1, inplace=True)

    # Ensure AQI columns are float
    aqi_columns = ['AQI_PM2.5', 'AQI_PM10', 'AQI_NO2', 'AQI_CO', 'AQI_SO2']
    for col in aqi_columns:
        df[col] = df[col].astype(float)

    # Normalize the data using MinMaxScaler
    scalers = {}
    scaled_data = {}
    for col in aqi_columns:
        scaler = MinMaxScaler()
        scaled_data[col] = scaler.fit_transform(df[[col]])
        scalers[col] = scaler

    # Function to forecast future AQI values
    def forecast_future(model, data, seq_length, future_steps):
        future_predictions = []
        current_seq = data[-seq_length:]  # Start from the last available sequence
        
        for _ in range(future_steps):
            pred = model.predict(current_seq[np.newaxis, :, :])  # Predict next step
            future_predictions.append(pred[0])
            current_seq = np.append(current_seq[1:], pred, axis=0)  # Update the sequence
        
        return np.array(future_predictions)

    # Load pre-trained models and forecast the next 'n' hours
    future_predictions = {}
    for col in aqi_columns:
        model = load_model(f'{col}_LSTM_model.h5')  # Load pre-trained LSTM model
        future_scaled_predictions = forecast_future(model, scaled_data[col], seq_length, future_steps)
        # Inverse transform to get the actual AQI values
        future_predictions[col] = scalers[col].inverse_transform(future_scaled_predictions).flatten()

    # Convert future predictions to a DataFrame with a proper timestamp index
    future_df = pd.DataFrame(future_predictions, index=pd.date_range(start=df.index[-1], periods=future_steps+1, freq='h')[1:])
    return future_df


