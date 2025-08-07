# src/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import google.generativeai as genai
import requests
import json
import datetime
import time
from datetime import datetime, timedelta

load_dotenv()

# Simple in-memory cache with a TTL of 15 minutes
cache = {}
CACHE_TTL_SECONDS = 15 * 60  # 15 minutes

# Get API keys
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

# Configure Google Generative AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

app = FastAPI()

# Allow CORS for the frontend to access the API
origins = ["http://localhost:5173"] # Replace with your frontend's URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/market-pulse")
async def get_market_pulse(ticker: str):
    if not ticker:
        raise HTTPException(status_code=400, detail="Ticker is required.")
    
    # Check if the ticker is in the cache and hasn't expired
    cache_key = ticker.upper()
    if cache_key in cache and datetime.now() - cache[cache_key]['timestamp'] < timedelta(seconds=CACHE_TTL_SECONDS):
        return cache[cache_key]['data']
    
    # Validate API keys
    if not ALPHA_VANTAGE_API_KEY:
        raise HTTPException(status_code=500, detail="Alpha Vantage API key not configured.")
    if not NEWS_API_KEY:
        raise HTTPException(status_code=500, detail="News API key not configured.")
    
    
    async def fetch_price_momentum(ticker):
        # Check if API key is available
        api_key = os.getenv('ALPHA_VANTAGE_API_KEY')
        if not api_key:
            print("Alpha Vantage API key not found in environment variables")
            return {"returns": [], "score": 0.0}
            
        url = (
        f"https://www.alphavantage.co/query?"
        f"function=TIME_SERIES_DAILY&"
        f"symbol={ticker}&"
        f"apikey={api_key}"
    )
        print(f"Fetching Alpha Vantage data for {ticker}...")
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()  # Raises an exception for 4xx/5xx responses
            data = response.json()
            print(f"Alpha Vantage response keys: {list(data.keys())}")
        except requests.exceptions.RequestException as e:
            print(f"HTTP error occurred while fetching Alpha Vantage data: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response status: {e.response.status_code}")
                print(f"Response content: {e.response.text}")
            return {"returns": [], "score": 0.0}
        except json.JSONDecodeError:
            print("Failed to decode JSON from Alpha Vantage response.")
            return {"returns": [], "score": 0.0}
        except Exception as e:
            print(f"Unexpected error fetching Alpha Vantage data: {e}")
            return {"returns": [], "score": 0.0}
            
            
        time_series = data.get("Time Series (Daily)", {})
        if not time_series:
            # Check if there's an error message from Alpha Vantage
            if "Error Message" in data:
                print(f"Alpha Vantage API error: {data['Error Message']}")
            elif "Note" in data:
                print(f"Alpha Vantage API limit reached: {data['Note']}")
            else:
                print("Alpha Vantage data for ticker not found or API call failed.")
            return {"returns": [], "score": 0.0}

        dates = sorted(time_series.keys(), reverse=True)
        if len(dates) < 2:
            print("Insufficient data points for momentum calculation.")
            return {"returns": [], "score": 0.0}
            
        last_five_days = dates[:5]
        returns = []
        prices = [float(time_series[day]['4. close']) for day in last_five_days]
        # Calculate returns for the last 4 periods
        for i in range(len(prices) - 1):
            prev_price = prices[i+1]
            current_price = prices[i]
            if prev_price != 0:
                daily_return = ((current_price - prev_price) / prev_price) * 100
                returns.append(round(daily_return, 2))

        # A simple momentum score: average of the returns
        momentum_score = sum(returns) / len(returns) if returns else 0.0

        return {
            "returns": returns,
            "score": round(momentum_score, 2)
        }


    # 2. Fetch News Feed Data
    
    async def fetch_news_feed(ticker_symbol):
        api_key = os.getenv('NEWS_API_KEY')
        if not api_key:
            print("News API key not found in environment variables")
            return []
            
        url = (
        f"https://newsapi.org/v2/everything?"
        f"q={ticker_symbol}&"
        f"sortBy=publishedAt&"
        f"pageSize=5&"
        f"apiKey={api_key}"
    )
        print(f"Fetching News API data for {ticker_symbol}...")
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            print(f"News API response status: {data.get('status', 'unknown')}")
        except requests.exceptions.RequestException as e:
            print(f"HTTP error occurred while fetching NewsAPI data: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response content: {e.response.text}")
            return []
        except json.JSONDecodeError:
            print("Failed to decode JSON from News API response.")
            return []
        except Exception as e:
            print(f"Unexpected error fetching News API data: {e}")
            return []

        # Check if the API call was successful and returned articles
        if data.get("status") != "ok":
            print(f"News API returned error status: {data.get('status')}")
            print(f"Error message: {data.get('message', 'No error message provided')}")
            return []
            
        articles = data.get("articles", [])
        if not articles:
            print("No articles found for this ticker symbol.")
            return []
            
        headlines = []
        
        for article in articles:
            # Only include articles with valid titles
            title = article.get("title")
            if title and title.strip():
                headlines.append({
                    "title": title,
                    "description": article.get("description"),
                    "url": article.get("url")
                })

        return headlines

    momentum_data = await fetch_price_momentum(ticker)
    news_data = await fetch_news_feed(ticker)
    
    # 3. Format the news data for output
    momentum_returns = momentum_data['returns']
    momentum_score = momentum_data['score']
    
    # Handle cases where news data might be empty or malformed
    if news_data:
        news_text = "\n".join([
            f"- Title: {n.get('title', 'N/A')}\n  Description: {n.get('description', 'N/A')}" 
            for n in news_data if n.get('title')
        ])
    else:
        news_text = "No recent news headlines available."
    prompt = f"""
            You are a financial analyst micro-service. Analyze the provided stock data to determine if the stock is "bullish", "bearish", or "neutral" for tomorrow. Provide a brief explanation.

            **Context:**
            - Stock Ticker: {ticker.upper()}
            - Momentum Score: {momentum_score}
            - Last 5 Trading Day Returns: {momentum_returns}
            - Latest News Headlines:
            {news_text}

            **Instructions:**
            - Provide your response as a single JSON object.
            - The JSON object must have two fields:
            - `pulse`: A string with the value "bullish", "bearish", or "neutral".
            - `llm_explanation`: A brief, concise explanation (1-2 sentences) of your decision, referencing both the momentum score and the news headlines. Do not use any other fields or text.
            """

    try:
        response = await model.generate_content_async(prompt)
        llm_output_text = response.text
        
        # Clean the response more thoroughly
        llm_output_text = llm_output_text.strip()
        if llm_output_text.startswith('```json'):
            llm_output_text = llm_output_text[7:]
        if llm_output_text.startswith('```'):
            llm_output_text = llm_output_text[3:]
        if llm_output_text.endswith('```'):
            llm_output_text = llm_output_text[:-3]
        llm_output_text = llm_output_text.strip()
        
        # Find JSON object in the text
        start_idx = llm_output_text.find('{')
        end_idx = llm_output_text.rfind('}') + 1
        if start_idx != -1 and end_idx != 0:
            llm_output_text = llm_output_text[start_idx:end_idx]
        
        try:
            llm_response_json = json.loads(llm_output_text)
            pulse = llm_response_json.get("pulse", "neutral")
            explanation = llm_response_json.get("llm_explanation", "Could not generate an explanation.")
        except json.JSONDecodeError as json_err:
            print(f"JSON parsing error: {json_err}")
            print(f"Raw LLM output: {llm_output_text}")
            pulse = "neutral"
            explanation = "Error parsing AI response - invalid JSON format."

    except Exception as e:
        # Handle potential errors from the LLM, like content safety filters or API issues
        print(f"Error calling LLM: {e}")
        pulse = "neutral"
        explanation = "Error generating a market pulse due to an issue with the AI service."

    # After getting a successful response from Gemini, store it in the cache
    response_data = {
        "ticker": ticker.upper(),
        "as_of": datetime.now().strftime("%Y-%m-%d"),
        "momentum": { "returns": momentum_returns, "score": momentum_score },
        "news": news_data,
        "pulse": pulse,
        "llm_explanation": explanation
    }

    cache[cache_key] = {
        'timestamp': datetime.now(),
        'data': response_data
    }

    return response_data