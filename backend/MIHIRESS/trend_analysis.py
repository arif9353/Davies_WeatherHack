import pandas as pd

def fetch_trend_data(file_path):
    try:
        # Load data from CSV
        df = pd.read_csv(file_path)

        # Clean up column names (strip leading/trailing spaces)
        df.columns = df.columns.str.strip()

        # Convert 'Date & Time' to datetime
        df['Date & Time'] = pd.to_datetime(df['Date & Time']).dt.strftime('%Y-%m-%d %H:%M:%S')

        # Step 1: Get the row with the highest AQI for each unique 'Date & Time'
        new_df = df.loc[df.groupby("Date & Time")["AQI"].idxmax()]

        # Step 2: Sort the DataFrame by index (or alternatively by 'Date & Time')
        new_df = new_df.sort_index()

        # Step 3: Calculate the AQI Ratio
        new_df["Ratio"] = round((new_df["AQI"] / new_df["AQI"].max()) * 100, 2)

        # Step 4: Rename the ' Time' column to 'Time' (remove leading spaces)
        new_df.rename(columns={"Time": "Time"}, inplace=True)

        # Step: to fromat Date
        new_df["Date"] = new_df["Date"].apply(lambda x: x[-8:-5])

        # Step 5: Limit the data (e.g., last 100 rows)
        limited_df = new_df.tail(100)

        # Step 6: Convert to dictionary for returning
        trend_data = limited_df[['Date', 'Date & Time', 'AQI', 'Ratio']].to_dict(orient='records')

        return trend_data

    except Exception as e:
        print(f"Error in trend analysis fetch function: {e}")
        return None


# Example usage
# file_path = './data/data_college.csv'
# trend_data = fetch_trend_data(file_path)
