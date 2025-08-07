import os
import requests
from dotenv import load_dotenv
import json

# Load environment variables from a .env file
load_dotenv()

# Get the News API key from the environment variables
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
if not NEWS_API_KEY:
    raise ValueError("NEWS_API_KEY not found in .env file.")

# Define the search parameters
TICKER_SYMBOL = "AAPL"
PAGE_SIZE = 5

# Construct the URL for the 'everything' endpoint
url = (
    f"https://newsapi.org/v2/everything?"
    f"q={TICKER_SYMBOL}&"
    f"sortBy=publishedAt&"
    f"pageSize={PAGE_SIZE}&"
    f"apiKey={NEWS_API_KEY}"
)

print(f"Testing News API for ticker: {TICKER_SYMBOL}...")

try:
    # Make a synchronous GET request to the API
    response = requests.get(url, timeout=10)
    response.raise_for_status()  # This will raise an exception for 4xx/5xx responses
    data = response.json()

    print("\nAPI Call Successful! ✅")
    print(f"Status Code: {response.status_code}")
    
    # Check if articles were returned
    if data["status"] == "ok" and data["totalResults"] > 0:
        articles = data["articles"]
        print(f"Found {len(articles)} articles.")
        print("\n--- Latest 5 Headlines ---")
        
        # Iterate and print a snippet of the article data
        for i, article in enumerate(articles):
            title = article.get("title", "No title available")
            source = article.get("source", {}).get("name", "Unknown source")
            print(f"{i+1}. Title: '{title}' from {source}")
            print(f"   URL: {article.get('url')}")
            print("-" * 20)
    else:
        print("API call was successful, but no articles were found for this query.")
        print(f"Raw data: {json.dumps(data, indent=2)}")

except requests.exceptions.RequestException as e:
    print(f"\nAPI Call Failed! ❌")
    print(f"An error occurred: {e}")
    if 'response' in locals():
        print(f"Response content: {response.text}")
    
except json.JSONDecodeError:
    print(f"\nAPI Call Failed! ❌")
    print("Failed to decode JSON. The response was not valid JSON.")
    
except Exception as e:
    print(f"\nAn unexpected error occurred: {e}")