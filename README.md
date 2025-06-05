# Orchids Website Cloner - AI-Powered Website Cloning

An advanced website cloning application that uses AI-powered scraping and Grok LLM to recreate websites with modern, clean code. Built for the Orchids SWE Internship Challenge.

## 🚀 Features

- **Advanced Web Scraping**: Uses Playwright for comprehensive website analysis
  - Screenshots at multiple viewport sizes (mobile, tablet, desktop)
  - DOM structure and semantic element extraction
  - Color palette and typography analysis
  - Animation and interaction detection
  - Responsive behavior testing
  - Asset extraction (images, fonts, videos)

- **AI-Powered Code Generation**: Leverages Grok AI for intelligent website cloning
  - Semantic HTML5 structure generation
  - Modern CSS with Tailwind framework
  - Interactive JavaScript functionality
  - Responsive design optimization

- **Beautiful User Interface**: Modern React/Next.js frontend
  - Real-time cloning progress updates
  - Live preview of generated websites
  - Code viewer with syntax highlighting
  - Copy-to-clipboard functionality

## 🏗️ Architecture

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Python FastAPI with async processing
- **Web Scraping**: Playwright + BeautifulSoup
- **AI Integration**: Grok API for code generation
- **Real-time Updates**: Background task processing with status polling

## 📋 Requirements

- Python 3.13+
- Node.js 18+
- Grok API key from xAI

## 🛠️ Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -e .
```

4. Install Playwright browsers:
```bash
playwright install chromium
```

5. Set up environment variables:
```bash
# Copy the example environment file
cp env.example .env

# Edit .env and add your Grok API key
GROK_API_KEY=your_actual_grok_api_key_here
```

6. Start the backend server:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Install JSZip for file downloads:
```bash
npm install jszip @types/jszip
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🔧 API Configuration

The application uses the Grok API from xAI. You'll need to:

1. Get an API key from [xAI](https://x.ai/)
2. Set the `GROK_API_KEY` environment variable in the backend
3. The application uses the `grok-3-latest` model for optimal website cloning

Example API key setup:
```bash
export GROK_API_KEY="your_actual_grok_api_key_here"
```

## 🎯 Usage

### Web Interface

1. Open `http://localhost:3000` in your browser
2. Enter a website URL (e.g., `https://example.com`)
3. Click "Clone Website" to start the process
4. Monitor real-time progress updates
5. View the results in different tabs:
   - **Preview**: Live preview of the cloned website
   - **HTML**: Generated HTML code
   - **CSS**: Generated CSS styles
   - **JavaScript**: Generated interactive scripts

### API Endpoints

The backend provides several REST API endpoints:

- `POST /clone` - Start website cloning
- `GET /clone/{clone_id}/status` - Check cloning status
- `GET /clone/{clone_id}/result` - Get complete results
- `GET /clones` - List all clone results
- `DELETE /clone/{clone_id}` - Delete a clone result

Example API usage:
```bash
# Start cloning
curl -X POST "http://localhost:8000/clone" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "enhanced": true}'

# Check status
curl "http://localhost:8000/clone/{clone_id}/status"

# Get results
curl "http://localhost:8000/clone/{clone_id}/result"
```

## 🎨 How It Works

### 1. Website Scraping Phase
- **Page Navigation**: Uses Playwright to visit the target website
- **Content Analysis**: Scrolls through the page to load lazy content
- **Screenshot Capture**: Takes responsive screenshots at different viewport sizes
- **DOM Extraction**: Analyzes HTML structure and semantic elements
- **Style Analysis**: Extracts CSS properties, color palettes, and typography
- **Asset Discovery**: Identifies images, fonts, and other resources
- **Animation Detection**: Identifies CSS animations and transitions
- **Responsive Testing**: Tests layout behavior at different screen sizes

### 2. AI Code Generation Phase
- **Context Preparation**: Structures the scraped data for the LLM
- **HTML Generation**: Creates semantic HTML structure with Grok AI
- **CSS Enhancement**: Generates modern CSS with animations and responsiveness
- **JavaScript Addition**: Adds interactive functionality and smooth behaviors
- **Iterative Refinement**: Optionally refines the output based on visual feedback

### 3. Result Presentation
- **Live Preview**: Renders the generated code in an iframe
- **Code Display**: Shows syntax-highlighted code in organized tabs
- **Export Options**: Provides copy-to-clipboard functionality for all code

## 🔧 Configuration

### Backend Configuration

Key configuration options in `backend/app/main.py`:

```python
# CORS settings for frontend communication
ALLOWED_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]

# Grok API configuration
GROK_API_KEY = os.getenv("GROK_API_KEY")
MODEL = "grok-3-latest"
```

### Scraping Configuration

Adjust scraping behavior in `backend/app/scraper.py`:

```python
# Viewport sizes for responsive testing
VIEWPORTS = [
    {'name': 'mobile', 'width': 375, 'height': 812},
    {'name': 'tablet', 'width': 768, 'height': 1024},
    {'name': 'desktop', 'width': 1920, 'height': 1080},
]

# Scroll settings for content discovery
SCROLL_STEP = 300
WAIT_TIME = 500  # milliseconds
```

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Set production API keys and configuration
2. **CORS Settings**: Restrict allowed origins to your production domain
3. **Rate Limiting**: Implement rate limiting for the API endpoints
4. **Database**: Replace in-memory storage with persistent database
5. **Error Handling**: Add comprehensive error logging and monitoring
6. **Security**: Implement authentication and input validation

### Docker Deployment

The application can be containerized for easy deployment:

```dockerfile
# Example Dockerfile for backend
FROM python:3.13-slim
WORKDIR /app
COPY backend/ .
RUN pip install uv && uv sync
RUN uv run playwright install --with-deps
CMD ["uv", "run", "fastapi", "run", "--host", "0.0.0.0"]
```

## 🧪 Testing

### Manual Testing

Test the application with various website types:

- **Simple static sites**: Basic HTML/CSS websites
- **Modern web apps**: React/Vue/Angular applications
- **E-commerce sites**: Complex layouts with product catalogs
- **Landing pages**: Marketing sites with animations
- **Documentation sites**: Content-heavy websites

### API Testing

Use the included API documentation at `http://localhost:8000/docs` for interactive testing.

## 🤝 Contributing

This project was built for the Orchids SWE Internship Challenge. Key areas for enhancement:

1. **Scraping Improvements**: Better handling of SPAs and dynamic content
2. **AI Enhancements**: Fine-tuning prompts for specific website types
3. **Performance**: Caching and optimization for faster processing
4. **UI/UX**: Additional features like batch processing and export options

## 📝 Project Structure

```
orchids-challenge/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   ├── scraper.py       # Advanced web scraping
│   │   └── llm_cloner.py    # Grok AI integration
│   ├── pyproject.toml       # Python dependencies
│   └── env.example          # Environment variables
├── frontend/
│   ├── src/app/
│   │   ├── page.tsx         # Main UI component
│   │   ├── layout.tsx       # App layout
│   │   └── globals.css      # Global styles
│   ├── package.json         # Node.js dependencies
│   └── next.config.ts       # Next.js configuration
└── README.md               # This file
```

## 📄 License

Built for educational purposes as part of the Orchids SWE Internship Challenge.

## 🙏 Acknowledgments

- **Orchids Team**: For the exciting challenge opportunity
- **xAI**: For providing the Grok API
- **Playwright**: For excellent web automation capabilities
- **Next.js & FastAPI**: For robust full-stack development frameworks
