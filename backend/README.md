# AI Website Cloner Backend

Production-ready AI-powered website cloning service using Gemini API.

## Features

- **Website Scraping**: Advanced scraping using Playwright with content, styling, and script extraction
- **AI-Powered Cloning**: Uses Google's Gemini API to generate complete website clones
- **RESTful API**: FastAPI-based service with comprehensive endpoints
- **Production Ready**: Proper logging, error handling, and configuration management

## Quick Start

### Prerequisites

- Python 3.13+
- Google Gemini API key

### Installation

1. Clone the repository and navigate to the backend directory
2. Install dependencies:
   ```bash
   pip install -e .
   ```

3. Install Playwright browsers:
   ```bash
   playwright install chromium
   ```

4. Set up environment variables:
   ```bash
   cp env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

### Running the Service

#### Development
```bash
python -m app.main
```

#### Production
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

- `POST /clone` - Start website cloning process
- `GET /clone/{clone_id}/status` - Get cloning status
- `GET /clone/{clone_id}/result` - Get clone result
- `DELETE /clone/{clone_id}` - Delete clone result
- `GET /clones` - List all clones
- `GET /health` - Health check

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `PORT` | Server port | 8000 |
| `LOG_LEVEL` | Logging level | INFO |
| `DEBUG` | Enable debug mode | false |
| `ALLOWED_ORIGINS` | CORS allowed origins | * |

## Docker Deployment

```dockerfile
FROM python:3.13-slim

WORKDIR /app
COPY . .
RUN pip install -e .
RUN playwright install chromium

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Architecture

- **FastAPI**: Web framework with automatic API documentation
- **Playwright**: Browser automation for web scraping
- **BeautifulSoup**: HTML parsing and content extraction
- **Gemini API**: AI-powered content generation
- **Pydantic**: Data validation and serialization 