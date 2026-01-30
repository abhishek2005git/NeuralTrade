from fastapi import FastAPI, HTTPException
import yfinance as yf
from prophet import Prophet
import pandas as pd

app = FastAPI()

@app.get("/predict/{ticker}")
def predict_stock(ticker: str):
    try:
        # 1. Download data (Last 2 years is best for Prophet)
        data = yf.download(ticker, period="2y", interval="1d")
        
        if data.empty:
            raise HTTPException(status_code=404, detail="Stock not found")

        # 2. Prepare data for Prophet
        # Prophet requires columns named 'ds' (date) and 'y' (value)
        df = data.reset_index()[['Date', 'Close']]
        df.columns = ['ds', 'y']
        
        # Remove timezone info (Prophet needs "naive" dates)
        df['ds'] = df['ds'].dt.tz_localize(None)

        # 3. Initialize and Train the Model
        model = Prophet(daily_seasonality=True)
        model.fit(df)

        # 4. Create future dates (7 days) and Predict
        future = model.make_future_dataframe(periods=7)
        forecast = model.predict(future)

        # 5. Extract only the future 7 days
        predictions = forecast[['ds', 'yhat']].tail(7)
        
        # Format the output for our MERN backend
        result = [
            {"date": row['ds'].strftime('%Y-%m-%d'), "price": round(row['yhat'], 2)}
            for index, row in predictions.iterrows()
        ]

        return {
            "ticker": ticker.upper(),
            "forecast": result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))