import httpx
import logging
from typing import Dict, Any
import re

logger = logging.getLogger(__name__)

class GeminiLLMCloner:
    """Gemini-based LLM cloner for generating comprehensive website clones using free Gemini API"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        
    async def clone_website(self, scraping_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a comprehensive website clone using Gemini"""
        try:
            # Prepare context with enhanced data
            context = self._prepare_enhanced_context(scraping_data)
            
            # Generate HTML with embedded CSS and JS
            html_content = await self._generate_complete_html(context)
            
            # Extract components
            css_content = self._extract_css(html_content)
            js_content = self._extract_js(html_content)
            clean_html = self._extract_html(html_content)
            
            return {
                'html': clean_html,
                'css': css_content,
                'javascript': js_content,
                'metadata': {
                    'original_url': scraping_data.get('url'),
                    'title': scraping_data.get('title'),
                    'generated_with': 'gemini-2.0-flash',
                    'has_animations': len(scraping_data.get('animations', {}).get('css_animations', [])) > 0,
                    'has_scripts': len(scraping_data.get('scripts', {}).get('inline_scripts', [])) > 0,
                    'responsive_design': scraping_data.get('responsive', {}).get('viewport_meta') is not None
                }
            }
            
        except Exception as e:
            return {'error': str(e)}

    def _prepare_enhanced_context(self, scraping_data: Dict[str, Any]) -> str:
        """Prepare comprehensive context for Gemini"""
        
        url = scraping_data.get('url', '')
        title = scraping_data.get('title', '')
        content = scraping_data.get('content', {})
        styles = scraping_data.get('styles', {})
        scripts = scraping_data.get('scripts', {})
        animations = scraping_data.get('animations', {})
        responsive = scraping_data.get('responsive', {})
        
        context = f"""WEBSITE TO CLONE:
URL: {url}
Title: {title}

CONTENT:
{self._format_content_concise(content)}

STYLING:
{self._format_styles_concise(styles)}

ANIMATIONS:
{self._format_animations_concise(animations)}

RESPONSIVE DESIGN:
{self._format_responsive_concise(responsive)}

JAVASCRIPT:
{self._format_scripts_concise(scripts)}
"""
        return context

    def _format_content_concise(self, content: dict) -> str:
        """Format content information concisely"""
        formatted = []
        
        # Headings
        headings = content.get('headings', [])
        if headings:
            formatted.append("HEADINGS:")
            for h in headings[:10]:  # Increased limit
                formatted.append(f"  H{h['level']}: {h['text']}")
        
        # Key paragraphs - FULL TEXT
        paragraphs = content.get('paragraphs', [])
        if paragraphs:
            formatted.append("\nPARAGRAPHS (FULL TEXT):")
            for i, p in enumerate(paragraphs[:8]):  # Increased limit
                formatted.append(f"  {i+1}. {p}")  # NO TRUNCATION
        
        # Images
        images = content.get('images', [])
        if images:
            formatted.append(f"\nIMAGES: {len(images)} images found")
            for img in images[:5]:  # Increased limit
                formatted.append(f"  - Alt: '{img.get('alt', 'No alt')}' Src: {img.get('src', '')}")
        
        # Links
        links = content.get('links', [])
        if links:
            formatted.append(f"\nLINKS:")
            for link in links[:8]:  # Increased limit
                formatted.append(f"  - Text: '{link['text']}' Href: {link['href']}")
        
        # Semantic elements
        semantic = content.get('semantic_elements', {})
        if semantic:
            formatted.append(f"\nHTML STRUCTURE: {', '.join(semantic.keys())}")
        
        # Sections with more detail
        sections = content.get('sections', [])
        if sections:
            formatted.append("\nSECTIONS:")
            for section in sections[:5]:
                formatted.append(f"  - {section.get('tag', 'div')}: {section.get('text', '')[:200]}...")
        
        return '\n'.join(formatted) if formatted else "No content found"

    def _format_styles_concise(self, styles: dict) -> str:
        """Format styling information concisely"""
        formatted = []
        
        # Colors
        colors = styles.get('colors', [])
        if colors:
            formatted.append(f"COLORS: {', '.join(colors[:8])}")
        
        # Element-specific fonts (DETAILED)
        element_fonts = styles.get('element_fonts', {})
        if element_fonts:
            formatted.append("\nFONT SPECIFICATIONS (USE EXACTLY):")
            for element, font_info in element_fonts.items():
                font_details = []
                for key, value in font_info.items():
                    if value and value != 'normal' and value != 'auto':
                        font_details.append(f"{key}: {value}")
                if font_details:
                    formatted.append(f"  {element}: {', '.join(font_details)}")
        
        # General fonts
        fonts = styles.get('fonts', [])
        if fonts:
            formatted.append(f"\nALL FONT FAMILIES DETECTED: {', '.join(fonts[:5])}")
        
        # Body styles (CRITICAL)
        body = styles.get('body', {})
        if body:
            formatted.append("\nBODY STYLES (CRITICAL - USE EXACTLY):")
            for key, value in body.items():
                if value and value != 'normal' and value != 'auto':
                    formatted.append(f"  {key}: {value}")
        
        # CSS Rules with font information
        css_rules = styles.get('css_rules', [])
        font_css_rules = [rule for rule in css_rules if 'font' in rule.lower()]
        if font_css_rules:
            formatted.append(f"\nFONT CSS RULES: {len(font_css_rules)} font-related rules found")
            for rule in font_css_rules[:5]:
                formatted.append(f"  - {rule[:150]}...")
        
        # Key computed styles
        computed = styles.get('computed_styles', {})
        if computed:
            formatted.append(f"\nKEY ELEMENTS: {', '.join(computed.keys())}")
        
        return '\n'.join(formatted) if formatted else "No styles detected"

    def _format_animations_concise(self, animations: dict) -> str:
        """Format animation information concisely"""
        formatted = []
        
        css_anims = animations.get('css_animations', [])
        if css_anims:
            formatted.append(f"CSS ANIMATIONS: {len(css_anims)} found")
        
        transitions = animations.get('css_transitions', [])
        if transitions:
            formatted.append(f"TRANSITIONS: {len(transitions)} found")
        
        keyframes = animations.get('keyframes', [])
        if keyframes:
            formatted.append(f"KEYFRAMES: {', '.join([kf.get('name', '') for kf in keyframes[:3]])}")
        
        return '\n'.join(formatted) if formatted else "No animations detected"

    def _format_responsive_concise(self, responsive: dict) -> str:
        """Format responsive design information concisely"""
        formatted = []
        
        viewport = responsive.get('viewport_meta')
        if viewport:
            formatted.append(f"VIEWPORT: {viewport}")
        
        flex_elements = responsive.get('flex_elements', [])
        if flex_elements:
            formatted.append(f"FLEX LAYOUTS: {len(flex_elements)} found")
        
        grid_elements = responsive.get('grid_elements', [])
        if grid_elements:
            formatted.append(f"GRID LAYOUTS: {len(grid_elements)} found")
        
        return '\n'.join(formatted) if formatted else "No responsive features detected"

    def _format_scripts_concise(self, scripts: dict) -> str:
        """Format JavaScript information concisely"""
        formatted = []
        
        external = scripts.get('external_scripts', [])
        if external:
            formatted.append(f"EXTERNAL SCRIPTS: {len(external)} found")
        
        inline = scripts.get('inline_scripts', [])
        if inline:
            formatted.append(f"INLINE SCRIPTS: {len(inline)} found")
        
        globals_found = scripts.get('global_variables', [])
        if globals_found:
            formatted.append(f"LIBRARIES: {', '.join(globals_found)}")
        
        return '\n'.join(formatted) if formatted else "No JavaScript detected"

    async def _generate_complete_html(self, context: str) -> str:
        """Generate complete HTML with embedded CSS and JS using Gemini"""
        
        system_prompt = """You are an expert web developer. Create a complete, functional website clone that recreates the original design precisely.

CRITICAL REQUIREMENTS:
1. Generate a complete HTML5 document with embedded CSS and JavaScript
2. Use ALL provided content EXACTLY - every word, every paragraph, every link text MUST be included completely
3. DO NOT truncate, modify, or shorten any text content provided
4. Recreate the exact layout structure, colors, fonts, and styling
5. Implement all animations, transitions, and interactive effects
6. Build responsive design using detected flex/grid layouts
7. Include JavaScript functionality for interactivity
8. Ensure cross-browser compatibility and accessibility

CONTENT HANDLING:
- Include EVERY paragraph with COMPLETE text (no truncation)
- Include ALL headings exactly as provided
- Include ALL links with exact text and URLs
- Include ALL images with proper alt text and sources
- Use the exact structure and semantic elements detected

STYLING:
- Use exact color palette (backgrounds, text, borders)
- Implement exact fonts and typography
- Apply all CSS rules from stylesheets
- Match computed styles for key elements
- Recreate inline styles where detected
- Use CSS custom properties for consistency

LAYOUT:
- Use semantic HTML5 elements (header, nav, main, section, article, aside, footer)
- Recreate exact container patterns and layout type
- Implement navigation patterns with correct positioning
- Structure content areas according to detected layout patterns

INTERACTIVITY:
- Recreate all CSS animations with exact timing
- Implement transitions for interactive elements
- Apply transform properties as detected
- Include hover effects and interactive states
- Add JavaScript for navigation, scrolling, forms

RESPONSIVE:
- Include viewport meta tag
- Use flex layouts with correct properties
- Implement grid layouts with template columns/rows
- Include media queries for different screen sizes

OUTPUT: Return ONLY the complete HTML document with embedded CSS and JavaScript. No explanations. Ensure ALL content is included completely."""

        user_prompt = f"""Create a complete website clone based on this analysis:

{context}

IMPORTANT: Use ALL the content provided above EXACTLY as written. Do not truncate, modify, or shorten any text. Every paragraph, heading, and link must be included with complete text.

Generate a full HTML document that recreates this website exactly with:
- ALL content included completely (no truncation)
- All detected styling and layout
- Responsive design with flex/grid layouts  
- Interactive features and animations
- Clean, modern code structure

Return the complete HTML with embedded CSS and JavaScript."""

        # Combine prompts
        full_prompt = f"{system_prompt}\n\n{user_prompt}"
        
        return await self._call_gemini_api(full_prompt)

    async def _call_gemini_api(self, prompt: str) -> str:
        """Call Gemini API with the provided format"""
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    f"{self.base_url}?key={self.api_key}",
                    headers={
                        "Content-Type": "application/json"
                    },
                    json={
                        "contents": [
                            {
                                "parts": [
                                    {
                                        "text": prompt
                                    }
                                ]
                            }
                        ],
                        "generationConfig": {
                            "temperature": 0.7,
                            "maxOutputTokens": 8192,
                            "topP": 0.8,
                            "topK": 40
                        }
                    }
                )
                
                if response.status_code != 200:
                    raise Exception(f"Gemini API request failed: {response.status_code} - {response.text}")
                
                result = response.json()
                
                # Extract content from Gemini response format
                if 'candidates' in result and len(result['candidates']) > 0:
                    candidate = result['candidates'][0]
                    if 'content' in candidate and 'parts' in candidate['content']:
                        content = candidate['content']['parts'][0]['text']
                        
                        # Check if response was truncated
                        if 'finishReason' in candidate and candidate['finishReason'] == 'MAX_TOKENS':
                            logger.warning("Warning: Response was truncated due to token limit")
                        
                        return self._clean_response(content)
                
                raise Exception("No valid response from Gemini API")
                
        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")

    def _clean_response(self, content: str) -> str:
        """Clean the API response"""
        # Remove markdown code blocks if present
        content = re.sub(r'^```html\s*\n', '', content, flags=re.MULTILINE)
        content = re.sub(r'^```\s*$', '', content, flags=re.MULTILINE)
        content = re.sub(r'^```.*\n', '', content, flags=re.MULTILINE)
        
        return content.strip()

    def _extract_css(self, html_content: str) -> str:
        """Extract CSS from HTML"""
        css_match = re.search(r'<style[^>]*>(.*?)</style>', html_content, re.DOTALL | re.IGNORECASE)
        if css_match:
            return css_match.group(1).strip()
        return ""

    def _extract_js(self, html_content: str) -> str:
        """Extract JavaScript from HTML"""
        js_matches = re.findall(r'<script[^>]*>(.*?)</script>', html_content, re.DOTALL | re.IGNORECASE)
        js_content = []
        for match in js_matches:
            # Skip CDN scripts
            if not any(keyword in match for keyword in ['cdn', 'https://', 'http://']):
                js_content.append(match.strip())
        return '\n\n'.join(js_content)

    def _extract_html(self, html_content: str) -> str:
        """Extract clean HTML without embedded CSS/JS"""
        # Remove style tags
        html_clean = re.sub(r'<style[^>]*>.*?</style>', '', html_content, flags=re.DOTALL | re.IGNORECASE)
        
        # Remove script tags (but keep CDN links)
        def replace_script(match):
            script_content = match.group(0)
            if any(keyword in script_content for keyword in ['cdn', 'https://', 'http://']):
                return script_content  # Keep CDN scripts
            return ''  # Remove inline scripts
        
        html_clean = re.sub(r'<script[^>]*>.*?</script>', replace_script, html_clean, flags=re.DOTALL | re.IGNORECASE)
        
        return html_clean.strip() 