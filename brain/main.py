from fastapi import FastAPI, HTTPException
import yfinance as yf
from prophet import Prophet
import pandas as pd

app = FastAPI()

# @app.get("/predict/{ticker}")
# def predict_stock(ticker: str):
#     try:
#         # 1. Download data (Last 2 years is best for Prophet)
#         data = yf.download(ticker, period="2y", interval="1d")
        
#         if data.empty:
#             raise HTTPException(status_code=404, detail="Stock not found")

#         # 2. Prepare data for Prophet
#         # Prophet requires columns named 'ds' (date) and 'y' (value)
#         df = data.reset_index()[['Date', 'Close']]
#         df.columns = ['ds', 'y']
        
#         # Remove timezone info (Prophet needs "naive" dates)
#         df['ds'] = df['ds'].dt.tz_localize(None)

#         # 3. Initialize and Train the Model
#         model = Prophet(daily_seasonality=True)
#         model.fit(df)

#         # 4. Create future dates (7 days) and Predict
#         future = model.make_future_dataframe(periods=7)
#         forecast = model.predict(future)

#         # 5. Extract only the future 7 days
#         predictions = forecast[['ds', 'yhat']].tail(7)
        
#         # Format the output for our MERN backend
#         result = [
#             {"date": row['ds'].strftime('%Y-%m-%d'), "price": round(row['yhat'], 2)}
#             for index, row in predictions.iterrows()
#         ]

#         return {
#             "ticker": ticker.upper(),
#             "forecast": result
#         }

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    

    
@app.get("/predict/{ticker}")
def predict_stock(ticker: str):
    try:
        print(f"📡 Fetching data for: {ticker}")
        
        # 🟢 Use a longer period and disable multi-threading for stability
        data = yf.download(ticker, period="max", interval="1d", threads=False)
        
        # Check if data actually has values
        if data is None or data.empty or len(data) < 10:
            print(f"❌ No data found for {ticker}")
            raise HTTPException(status_code=404, detail=f"Stock {ticker} not found or has no history.")

        # 🟢 FIX: Handle Multi-Index columns (yfinance sometimes returns them)
        if isinstance(data.columns, pd.MultiIndex):
            data.columns = data.columns.get_level_values(0)

        df = data.reset_index()[['Date', 'Close']]
        df.columns = ['ds', 'y']
        df['ds'] = df['ds'].dt.tz_localize(None)

        model = Prophet(daily_seasonality=True)
        model.fit(df)

        future = model.make_future_dataframe(periods=24, freq='h', include_history=False)
        forecast = model.predict(future)

        prediction_list = forecast['yhat'].round(2).tolist()

        return {
            "ticker": ticker.upper(),
            "forecast": prediction_list
        }

    except Exception as e:
        print(f"🔥 Python Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))