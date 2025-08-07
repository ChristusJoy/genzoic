import os
import requests
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Get your Alpha Vantage API key
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
if not ALPHA_VANTAGE_API_KEY:
    raise ValueError("ALPHA_VANTAGE_API_KEY not found in .env file.")

# Define the ticker symbol and the API function
TICKER_SYMBOL = "MSFT"
FUNCTION = "TIME_SERIES_DAILY" # Using the free tier function

# Construct the URL for the API call
url = (
    f"https://www.alphavantage.co/query?"
    f"function={FUNCTION}&"
    f"symbol={TICKER_SYMBOL}&"
    f"apikey={ALPHA_VANTAGE_API_KEY}"
)

print(f"Testing Alpha Vantage API for ticker: {TICKER_SYMBOL}...")

try:
    # Make a synchronous GET request
    response = requests.get(url, timeout=10)
    response.raise_for_status()  # This will raise an exception for 4xx/5xx responses
    data = response.json()

    print("\nAPI Call Successful! ✅")
    print(f"Status Code: {response.status_code}")
    
    # Print a snippet of the data to confirm it's valid
    print("\n--- Response Snippet ---")
    
    # The keys for daily time series are the dates
    if "Time Series (Daily)" in data:
        time_series = data["Time Series (Daily)"]
        first_five_dates = sorted(time_series.keys(), reverse=True)[:5]
        
        for date in first_five_dates:
            close_price = time_series[date]['4. close']
            print(f"Date: {date}, Closing Price: {close_price}")
    else:
        # If the API returns an error message, print it
        print("API response does not contain daily time series data.")
        print(f"Raw data: {json.dumps(data, indent=2)}")

except requests.exceptions.RequestException as e:
    print(f"\nAPI Call Failed! ❌")
    print(f"An error occurred: {e}")
    
    # If possible, print the response body to get more details
    if 'response' in locals():
        print(f"Response content: {response.text}")
    
except json.JSONDecodeError:
    print(f"\nAPI Call Failed! ❌")
    print("Failed to decode JSON. The response was not valid JSON.")
    
except Exception as e:
    print(f"\nAn unexpected error occurred: {e}")