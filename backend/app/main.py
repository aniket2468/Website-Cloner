import os
import logging
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid
from dotenv import load_dotenv

from .simple_scraper import SimpleWebScraper
from .grok_cloner import GrokLLMCloner

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(
    level=getattr(logging, os.getenv("LOG_LEVEL", "INFO").upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Website Cloner",
    description="Production AI-powered website cloning service using Grok",
    version="2.1.0",
    docs_url="/docs" if os.getenv("DEBUG", "false").lower() == "true" else None,
    redoc_url="/redoc" if os.getenv("DEBUG", "false").lower() == "true" else None
)

# Configure CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",") if os.getenv("ALLOWED_ORIGINS") else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)

# In-memory storage for clone results (in production, consider using Redis or a database)
clone_results: Dict[str, "CloneResult"] = {}

# Environment configuration
GROK_API_KEY = os.getenv("GROK_API_KEY")
if not GROK_API_KEY:
    logger.error("GROK_API_KEY environment variable is not set")
    raise ValueError("GROK_API_KEY environment variable is required")

# Pydantic models
class CloneRequest(BaseModel):
    url: HttpUrl
    enhanced: bool = True

class CloneResponse(BaseModel):
    clone_id: str
    status: str
    message: str
    url: str
    created_at: str

class CloneResult(BaseModel):
    clone_id: str
    status: str
    url: str
    created_at: str
    completed_at: Optional[str] = None
    html: Optional[str] = None
    css: Optional[str] = None
    javascript: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class CloneStatus(BaseModel):
    clone_id: str
    status: str
    url: str
    created_at: str
    completed_at: Optional[str] = None
    has_result: bool

class CloneListItem(BaseModel):
    clone_id: str
    status: str
    url: str
    created_at: str
    completed_at: Optional[str] = None

@app.get("/")
def read_root():
    """Root endpoint with API information"""
    return {
        "message": "AI Website Cloner API",
        "version": "2.1.0",
        "status": "healthy",
        "endpoints": {
            "clone": "/clone",
            "status": "/clone/{clone_id}/status",
            "result": "/clone/{clone_id}/result",
            "health": "/health"
        }
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.1.0",
        "active_clones": len([r for r in clone_results.values() if r.status == "processing"])
    }

@app.post("/clone", response_model=CloneResponse)
async def clone_website(request: CloneRequest, background_tasks: BackgroundTasks):
    """Start website cloning process"""
    try:
        clone_id = str(uuid.uuid4())
        url_str = str(request.url)
        
        logger.info(f"Starting clone process for URL: {url_str}, Clone ID: {clone_id}")
        
        # Initialize clone result
        clone_results[clone_id] = CloneResult(
            clone_id=clone_id,
            status="processing",
            url=url_str,
            created_at=datetime.now().isoformat()
        )
        
        # Start background task
        background_tasks.add_task(
            process_clone, 
            clone_id, 
            url_str
        )
        
        return CloneResponse(
            clone_id=clone_id,
            status="processing",
            message="Website cloning started. Use the clone_id to check status.",
            url=url_str,
            created_at=clone_results[clone_id].created_at
        )
        
    except Exception as e:
        logger.error(f"Failed to start cloning for {request.url}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to start cloning: {str(e)}")

@app.get("/clone/{clone_id}/status", response_model=CloneStatus)
async def get_clone_status(clone_id: str):
    """Get the status of a cloning process"""
    if clone_id not in clone_results:
        raise HTTPException(status_code=404, detail="Clone not found")
    
    result = clone_results[clone_id]
    return CloneStatus(
        clone_id=result.clone_id,
        status=result.status,
        url=result.url,
        created_at=result.created_at,
        completed_at=result.completed_at,
        has_result=result.html is not None
    )

@app.get("/clone/{clone_id}/result")
async def get_clone_result(clone_id: str):
    """Get the complete result of a cloning process"""
    if clone_id not in clone_results:
        raise HTTPException(status_code=404, detail="Clone not found")
    
    result = clone_results[clone_id]
    
    if result.status == "processing":
        return {
            "clone_id": result.clone_id,
            "status": "processing",
            "message": "Clone is still being processed"
        }
    
    if result.status == "error":
        return {
            "clone_id": result.clone_id,
            "status": "error",
            "error": result.error
        }
    
    return {
        "clone_id": result.clone_id,
        "status": result.status,
        "url": result.url,
        "created_at": result.created_at,
        "completed_at": result.completed_at,
        "html": result.html,
        "css": result.css,
        "javascript": result.javascript,
        "metadata": result.metadata
    }

@app.delete("/clone/{clone_id}")
async def delete_clone_result(clone_id: str):
    """Delete a clone result"""
    if clone_id not in clone_results:
        raise HTTPException(status_code=404, detail="Clone not found")
    
    logger.info(f"Deleting clone result: {clone_id}")
    del clone_results[clone_id]
    return {"message": "Clone result deleted successfully"}

@app.get("/clones", response_model=List[CloneListItem])
async def list_clones():
    """List all clone results"""
    return [
        CloneListItem(
            clone_id=result.clone_id,
            status=result.status,
            url=result.url,
            created_at=result.created_at,
            completed_at=result.completed_at
        )
        for result in clone_results.values()
    ]

async def process_clone(clone_id: str, url: str):
    """Background task for website cloning"""
    try:
        logger.info(f"Processing clone for URL: {url}, Clone ID: {clone_id}")
        
        # Step 1: Scrape website
        logger.info(f"Starting scraping for {url}")
        async with SimpleWebScraper() as scraper:
            scraping_data = await scraper.scrape_website(url)
        
        if 'error' in scraping_data:
            raise Exception(f"Scraping failed: {scraping_data['error']}")
        
        logger.info(f"Scraping completed for {url}")
        
        # Step 2: Generate clone
        logger.info(f"Starting clone generation for {url}")
        cloner = GrokLLMCloner(GROK_API_KEY)
        clone_result = await cloner.clone_website(scraping_data)
        
        if 'error' in clone_result:
            raise Exception(f"Clone generation failed: {clone_result['error']}")
        
        logger.info(f"Clone generation completed for {url}")
        
        # Update result
        clone_results[clone_id].status = "completed"
        clone_results[clone_id].completed_at = datetime.now().isoformat()
        clone_results[clone_id].html = clone_result.get('html', '')
        clone_results[clone_id].css = clone_result.get('css', '')
        clone_results[clone_id].javascript = clone_result.get('javascript', '')
        clone_results[clone_id].metadata = clone_result.get('metadata', {})
        
        logger.info(f"Clone process completed successfully for {url}")
        
    except Exception as e:
        logger.error(f"Error in clone process for {url}: {str(e)}")
        clone_results[clone_id].status = "error"
        clone_results[clone_id].error = str(e)
        clone_results[clone_id].completed_at = datetime.now().isoformat()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=int(os.getenv("PORT", "8000")),
        log_level=os.getenv("LOG_LEVEL", "info").lower()
    )
