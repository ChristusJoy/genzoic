# Genzoic - Market Pulse Analytics

A real-time market sentiment analysis application that provides AI-powered stock insights by combining price momentum analysis with news sentiment.

## 🚀 Features

- **Real-time Market Data**: Fetches stock price data from Alpha Vantage API
- **News Sentiment Analysis**: Integrates latest news headlines from NewsAPI
- **AI-Powered Insights**: Uses Google Gemini AI to analyze market sentiment
- **Interactive Frontend**: React-based dashboard with dark/light theme support
- **Caching System**: 15-minute cache for API responses to optimize performance
- **Responsive Design**: Built with Tailwind CSS for modern UI/UX

## 🏗️ Architecture

```
genzoic/
├── main.py                 # FastAPI backend server
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   └── App.jsx        # Main application component
│   └── package.json       # Frontend dependencies
├── .env                   # Environment variables (not tracked)
└── README.md             # This file
```

## 🛠️ Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- API keys for:
  - [Alpha Vantage](https://www.alphavantage.co/support/#api-key) (stock data)
  - [NewsAPI](https://newsapi.org/register) (news headlines)
  - [Google Gemini](https://makersuite.google.com/app/apikey) (AI analysis)

### 1. Clone the Repository

```bash
git clone https://github.com/ChristusJoy/genzoic.git
cd genzoic
```

### 2. Backend Setup

#### Install Python Dependencies

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn python-dotenv google-generativeai requests
```

#### Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env  # If you have an example file
```

Add your API keys to `.env`:

```env
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
NEWS_API_KEY=your_news_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Running the Application

#### Start the Backend Server

```bash
# From the root directory
source venv/bin/activate  # If not already activated
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

#### Start the Frontend Development Server

```bash
# In a new terminal, from the frontend directory
cd frontend
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## 🔗 API Documentation

### Market Pulse Endpoint

**GET** `/api/v1/market-pulse?ticker={SYMBOL}`

Retrieves market sentiment analysis for a given stock ticker.

#### Parameters

- `ticker` (required): Stock symbol (e.g., AAPL, GOOGL, TSLA)

#### Response Format

```json
{
  "ticker": "AAPL",
  "as_of": "2025-08-07",
  "momentum": {
    "returns": [1.2, -0.5, 2.1, 0.8],
    "score": 0.9
  },
  "news": [
    {
      "title": "Apple Reports Strong Q3 Earnings",
      "description": "Apple Inc. reported better-than-expected earnings...",
      "url": "https://example.com/news/article"
    }
  ],
  "pulse": "bullish",
  "llm_explanation": "The stock shows positive momentum with strong earnings news driving bullish sentiment."
}
```

#### Sample cURL Requests

```bash
# Get market pulse for Apple
curl "http://localhost:8000/api/v1/market-pulse?ticker=AAPL"

# Get market pulse for Tesla
curl "http://localhost:8000/api/v1/market-pulse?ticker=TSLA"

# Get market pulse for Google
curl "http://localhost:8000/api/v1/market-pulse?ticker=GOOGL"
```

## 🎨 Design Notes

### Backend Architecture

- **FastAPI Framework**: Chosen for its async support and automatic API documentation
- **Modular Design**: Separate functions for data fetching, analysis, and caching
- **Error Handling**: Comprehensive error handling for API failures and data issues
- **CORS Configuration**: Configured to allow frontend access from localhost:5173
- **Caching Strategy**: 15-minute TTL cache to reduce API calls and improve performance

### Frontend Architecture

- **React 19**: Latest React version with modern hooks and features
- **Component-Based**: Modular components for search, display, and data visualization
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Theme Support**: Dark/light mode toggle with system preference detection
- **Responsive Design**: Mobile-first approach with responsive breakpoints

### Data Flow

1. **User Input**: User enters stock ticker in search bar
2. **API Request**: Frontend sends request to backend `/api/v1/market-pulse` endpoint
3. **Data Fetching**: Backend fetches data from multiple APIs:
   - Alpha Vantage for price data and momentum calculation
   - NewsAPI for recent news headlines
4. **AI Analysis**: Google Gemini analyzes combined data to determine market sentiment
5. **Response**: Structured JSON response with pulse, explanation, and raw data
6. **Caching**: Response cached for 15 minutes to optimize subsequent requests
7. **UI Update**: Frontend displays results in user-friendly cards and charts

### Security Considerations

- API keys stored in environment variables (not in code)
- CORS properly configured for production deployment
- Input validation for ticker symbols
- Error responses don't expose sensitive information

### Performance Optimizations

- **Caching**: 15-minute cache reduces redundant API calls
- **Async Operations**: All API calls are asynchronous
- **Error Handling**: Graceful degradation when APIs are unavailable
- **Response Size**: Limited news articles (5 max) to reduce payload size

## 🔧 Development

### Adding New Features

1. **Backend**: Add new endpoints in `main.py`
2. **Frontend**: Create new components in `frontend/src/components/`
3. **Styling**: Use Tailwind CSS classes for consistent design

### Testing

```bash
# Test backend endpoint
curl "http://localhost:8000/api/v1/market-pulse?ticker=AAPL"

# Check API documentation
open http://localhost:8000/docs
```

### Deployment Considerations

- Set `origins` in CORS middleware to your production domain
- Use environment-specific configuration files
- Consider rate limiting for production API
- Implement proper logging and monitoring
- Use HTTPS in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check that all API keys are correctly set in your `.env` file
2. Ensure all dependencies are installed
3. Verify that both backend and frontend servers are running
4. Check the console logs for error messages

For additional support, please open an issue on GitHub.
