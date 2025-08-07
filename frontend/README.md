# Market Pulse Frontend

A React SPA with a chat-style interface for getting real-time market insights powered by AI.

## Features

- **Chat Interface**: Clean, modern chat-style UI for entering stock tickers
- **Market Pulse Cards**: Beautiful cards displaying:
  - Stock ticker and sentiment (bullish/bearish)
  - Momentum score with visual progress bar
  - Sparkline chart showing last 4 days of returns
  - Recent news headlines with links
  - Collapsible raw JSON data
- **Dark/Light Theme**: Toggle between dark and light themes
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React 19**: Modern React with hooks
- **Tailwind CSS v4**: Utility-first CSS framework
- **Recharts**: Charts for data visualization
- **Heroicons**: Beautiful SVG icons
- **Vite**: Fast build tool and dev server

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5174`

## API Integration

The app expects a backend API running on `http://127.0.0.1:8000` with the endpoint:
```
GET /api/v1/market-pulse?ticker=AAPL
```

Expected API response format:
```json
{
  "ticker": "AAPL",
  "as_of": "2025-08-07",
  "momentum": {
    "returns": [5.09, -0.21, 0.48, -2.5],
    "score": 0.71
  },
  "news": [...],
  "pulse": "bullish",
  "llm_explanation": "The high momentum score (0.71) and positive news headlines suggest a bullish outlook for AAPL tomorrow."
}
```

## Components

- **App.jsx**: Main application component with theme management
- **ChatInterface.jsx**: Main chat interface with message handling and API calls
- **ChatMessage.jsx**: Individual chat message component
- **MarketPulseCard.jsx**: Card component displaying market data with charts
- **ThemeToggle.jsx**: Theme switcher component

## Usage

1. Enter a stock ticker (e.g., AAPL, GOOGL, TSLA) in the chat input
2. Press Enter or click the send button
3. View the AI-generated explanation and detailed market pulse card
4. Click on news headlines to read full articles
5. Expand "Raw JSON Data" to see the complete API response
6. Use the theme toggle in the top-right to switch between dark and light modes

## Building for Production

```bash
npm run build
```

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
