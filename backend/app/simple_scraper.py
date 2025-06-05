import asyncio
import base64
import logging
from typing import Dict, Any, Optional
from urllib.parse import urljoin

from playwright.async_api import async_playwright, Page, Browser
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

class SimpleWebScraper:
    """Enhanced simple web scraper that captures essential elements including CSS and JS"""
    
    def __init__(self):
        self.browser: Optional[Browser] = None
        self.context = None
        self.playwright = None
        
    async def __aenter__(self):
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-setuid-sandbox']
        )
        self.context = await self.browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        )
        self.context.set_default_timeout(30000)
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

    async def scrape_website(self, url: str) -> Dict[str, Any]:
        """Enhanced website scraping that captures content, styles, and scripts"""
        page = None
        try:
            page = await self.context.new_page()
            
            # Navigate to the page
            response = await page.goto(url, wait_until='domcontentloaded')
            if not response or response.status >= 400:
                raise Exception(f"Failed to load page: HTTP {response.status if response else 'No response'}")
            
            # Wait for page to load completely
            await page.wait_for_load_state('networkidle', timeout=15000)
            await asyncio.sleep(2)  # Additional wait for dynamic content
            
            # Extract data
            data = {
                'url': url,
                'title': await self._get_title(page),
                'content': await self._extract_content(page),
                'styles': await self._extract_comprehensive_styles(page),
                'scripts': await self._extract_scripts(page),
                'animations': await self._detect_animations(page),
                'responsive': await self._check_responsive_elements(page),
                'screenshot': await self._take_screenshot(page)
            }
            
            return data
            
        except Exception as e:
            return {'error': str(e), 'url': url}
        finally:
            if page:
                await page.close()

    async def _get_title(self, page: Page) -> str:
        """Get page title"""
        try:
            return await page.title()
        except:
            return "Untitled"

    async def _extract_content(self, page: Page) -> Dict[str, Any]:
        """Extract essential page content"""
        try:
            html = await page.content()
            soup = BeautifulSoup(html, 'html.parser')
            
            # Keep a copy of original HTML for structure
            original_html = str(soup)
            
            # Remove unwanted elements for content extraction
            content_soup = BeautifulSoup(html, 'html.parser')
            for element in content_soup(['script', 'style', 'meta', 'link', 'noscript']):
                element.decompose()
            
            content = {
                'headings': self._extract_headings(content_soup),
                'paragraphs': self._extract_paragraphs(content_soup),
                'images': self._extract_images(content_soup),
                'links': self._extract_links(content_soup),
                'sections': self._extract_sections(content_soup),
                'layout_structure': await self._extract_layout_structure(page),
                'html_structure': str(content_soup.body) if content_soup.body else str(content_soup),
                'original_html': original_html[:8000],  # Increased to capture more structure
                'semantic_elements': self._extract_semantic_elements(content_soup)
            }
            
            return content
        except Exception as e:
            return {'error': str(e)}

    def _extract_headings(self, soup: BeautifulSoup) -> list:
        """Extract all headings"""
        headings = []
        for level in range(1, 7):
            for heading in soup.find_all(f'h{level}'):
                text = heading.get_text(strip=True)
                if text:
                    headings.append({
                        'level': level,
                        'text': text
                    })
        return headings[:20]

    def _extract_paragraphs(self, soup: BeautifulSoup) -> list:
        """Extract paragraphs"""
        paragraphs = []
        for p in soup.find_all('p'):
            text = p.get_text(strip=True)
            if text and len(text) > 10:  # Reduced minimum length to capture short paragraphs
                paragraphs.append(text)
        return paragraphs[:25]  # Increased limit to capture more paragraphs

    def _extract_images(self, soup: BeautifulSoup) -> list:
        """Extract image information"""
        images = []
        for img in soup.find_all('img'):
            src = img.get('src')
            alt = img.get('alt', '')
            if src:
                images.append({
                    'src': src,
                    'alt': alt
                })
        return images[:10]

    def _extract_links(self, soup: BeautifulSoup) -> list:
        """Extract navigation links"""
        links = []
        for link in soup.find_all('a', href=True):
            text = link.get_text(strip=True)
            href = link.get('href')
            if text and href:
                links.append({
                    'text': text,
                    'href': href
                })
        return links[:15]

    def _extract_sections(self, soup: BeautifulSoup) -> list:
        """Extract main content sections"""
        sections = []
        
        for tag in ['section', 'article', 'main', 'div']:
            for element in soup.find_all(tag):
                text = element.get_text(strip=True)
                if len(text) > 50 and len(text) < 1000:
                    sections.append({
                        'tag': tag,
                        'text': text[:200] + '...' if len(text) > 200 else text,
                        'id': element.get('id', ''),
                        'class': ' '.join(element.get('class', []))
                    })
                    
                if len(sections) >= 8:
                    break
            if len(sections) >= 8:
                break
                
        return sections

    async def _extract_comprehensive_styles(self, page: Page) -> Dict[str, Any]:
        """Extract comprehensive styling information"""
        try:
            styles = await page.evaluate("""
                () => {
                    const styleData = {
                        body: {},
                        colors: [],
                        fonts: [],
                        css_rules: [],
                        inline_styles: [],
                        computed_styles: {},
                        element_fonts: {}
                    };
                    
                    // Get body styles
                    const body = document.body;
                    if (body) {
                        const bodyStyles = window.getComputedStyle(body);
                        styleData.body = {
                            backgroundColor: bodyStyles.backgroundColor,
                            color: bodyStyles.color,
                            fontFamily: bodyStyles.fontFamily,
                            fontSize: bodyStyles.fontSize,
                            fontWeight: bodyStyles.fontWeight,
                            lineHeight: bodyStyles.lineHeight,
                            margin: bodyStyles.margin,
                            padding: bodyStyles.padding,
                            display: bodyStyles.display,
                            justifyContent: bodyStyles.justifyContent,
                            alignItems: bodyStyles.alignItems,
                            minHeight: bodyStyles.minHeight,
                            textAlign: bodyStyles.textAlign
                        };
                    }
                    
                    // Extract detailed font information for key elements
                    const fontInfo = {};
                    const keyElements = ['body', 'h1', 'h2', 'h3', 'p', 'a', 'div'];
                    keyElements.forEach(tag => {
                        const element = document.querySelector(tag);
                        if (element) {
                            const computed = window.getComputedStyle(element);
                            fontInfo[tag] = {
                                fontFamily: computed.fontFamily,
                                fontSize: computed.fontSize,
                                fontWeight: computed.fontWeight,
                                fontStyle: computed.fontStyle,
                                letterSpacing: computed.letterSpacing,
                                lineHeight: computed.lineHeight,
                                textAlign: computed.textAlign,
                                color: computed.color
                            };
                        }
                    });
                    styleData.element_fonts = fontInfo;
                    
                    // Extract colors from all elements
                    const colors = new Set();
                    const elements = document.querySelectorAll('*');
                    for (let i = 0; i < Math.min(elements.length, 200); i++) {
                        const computed = window.getComputedStyle(elements[i]);
                        if (computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                            colors.add(computed.backgroundColor);
                        }
                        if (computed.color) {
                            colors.add(computed.color);
                        }
                        if (computed.borderColor && computed.borderColor !== 'rgba(0, 0, 0, 0)') {
                            colors.add(computed.borderColor);
                        }
                    }
                    styleData.colors = Array.from(colors).slice(0, 15);
                    
                    // Extract font families from all elements
                    const fonts = new Set();
                    for (let i = 0; i < Math.min(elements.length, 100); i++) {
                        const computed = window.getComputedStyle(elements[i]);
                        if (computed.fontFamily) {
                            fonts.add(computed.fontFamily);
                        }
                    }
                    styleData.fonts = Array.from(fonts).slice(0, 10);
                    
                    // Extract CSS rules from stylesheets
                    try {
                        for (let sheet of document.styleSheets) {
                            try {
                                if (sheet.cssRules) {
                                    for (let i = 0; i < Math.min(sheet.cssRules.length, 50); i++) {
                                        const rule = sheet.cssRules[i];
                                        if (rule.cssText) {
                                            styleData.css_rules.push(rule.cssText);
                                        }
                                    }
                                }
                            } catch (e) {
                                // Skip cross-origin stylesheets
                            }
                        }
                    } catch (e) {
                        console.log('Could not access some stylesheets');
                    }
                    
                    // Extract inline styles
                    const elementsWithStyle = document.querySelectorAll('[style]');
                    for (let elem of elementsWithStyle) {
                        if (elem.style.cssText) {
                            styleData.inline_styles.push({
                                tag: elem.tagName.toLowerCase(),
                                styles: elem.style.cssText
                            });
                        }
                    }
                    
                    // Get computed styles for important elements
                    const importantSelectors = ['header', 'nav', 'main', 'footer', '.hero', '#hero', '.container', '.navbar'];
                    for (let selector of importantSelectors) {
                        const elem = document.querySelector(selector);
                        if (elem) {
                            const computed = window.getComputedStyle(elem);
                            styleData.computed_styles[selector] = {
                                display: computed.display,
                                position: computed.position,
                                flexDirection: computed.flexDirection,
                                justifyContent: computed.justifyContent,
                                alignItems: computed.alignItems,
                                gridTemplateColumns: computed.gridTemplateColumns,
                                gridTemplateRows: computed.gridTemplateRows,
                                backgroundColor: computed.backgroundColor,
                                color: computed.color,
                                fontSize: computed.fontSize,
                                fontWeight: computed.fontWeight,
                                padding: computed.padding,
                                margin: computed.margin,
                                borderRadius: computed.borderRadius,
                                boxShadow: computed.boxShadow,
                                transition: computed.transition
                            };
                        }
                    }
                    
                    return styleData;
                }
            """)
            
            return styles
        except Exception as e:
            logger.error(f"Error extracting styles: {e}")
            return {}

    async def _extract_scripts(self, page: Page) -> Dict[str, Any]:
        """Extract JavaScript information"""
        try:
            scripts = await page.evaluate("""
                () => {
                    const scriptData = {
                        inline_scripts: [],
                        external_scripts: [],
                        event_listeners: [],
                        global_variables: []
                    };
                    
                    // Extract inline scripts
                    const scriptTags = document.querySelectorAll('script');
                    for (let script of scriptTags) {
                        if (script.src) {
                            scriptData.external_scripts.push(script.src);
                        } else if (script.textContent && script.textContent.trim()) {
                            // Only include meaningful inline scripts (not empty or just comments)
                            const content = script.textContent.trim();
                            if (content.length > 10 && !content.startsWith('//') && !content.startsWith('/*')) {
                                scriptData.inline_scripts.push(content.substring(0, 1000)); // Limit length
                            }
                        }
                    }
                    
                    // Try to detect some global variables
                    const commonVars = ['jQuery', '$', 'React', 'Vue', 'Angular', 'gsap', 'AOS'];
                    for (let varName of commonVars) {
                        if (window[varName]) {
                            scriptData.global_variables.push(varName);
                        }
                    }
                    
                    return scriptData;
                }
            """)
            
            return scripts
        except Exception as e:
            logger.error(f"Error extracting scripts: {e}")
            return {}

    async def _detect_animations(self, page: Page) -> Dict[str, Any]:
        """Detect CSS animations and transitions"""
        try:
            animations = await page.evaluate("""
                () => {
                    const animationData = {
                        css_animations: [],
                        css_transitions: [],
                        animated_elements: [],
                        keyframes: []
                    };
                    
                    // Check all elements for animations and transitions
                    const elements = document.querySelectorAll('*');
                    for (let i = 0; i < Math.min(elements.length, 100); i++) {
                        const elem = elements[i];
                        const computed = window.getComputedStyle(elem);
                        
                        // Check for CSS animations
                        if (computed.animationName && computed.animationName !== 'none') {
                            animationData.css_animations.push({
                                element: elem.tagName.toLowerCase(),
                                className: elem.className,
                                animationName: computed.animationName,
                                animationDuration: computed.animationDuration,
                                animationTimingFunction: computed.animationTimingFunction,
                                animationIterationCount: computed.animationIterationCount
                            });
                        }
                        
                        // Check for CSS transitions
                        if (computed.transition && computed.transition !== 'all 0s ease 0s') {
                            animationData.css_transitions.push({
                                element: elem.tagName.toLowerCase(),
                                className: elem.className,
                                transition: computed.transition
                            });
                        }
                        
                        // Check for transform properties
                        if (computed.transform && computed.transform !== 'none') {
                            animationData.animated_elements.push({
                                element: elem.tagName.toLowerCase(),
                                className: elem.className,
                                transform: computed.transform
                            });
                        }
                    }
                    
                    // Try to extract keyframes from stylesheets
                    try {
                        for (let sheet of document.styleSheets) {
                            try {
                                if (sheet.cssRules) {
                                    for (let rule of sheet.cssRules) {
                                        if (rule.type === CSSRule.KEYFRAMES_RULE) {
                                            animationData.keyframes.push({
                                                name: rule.name,
                                                cssText: rule.cssText.substring(0, 500) // Limit length
                                            });
                                        }
                                    }
                                }
                            } catch (e) {
                                // Skip cross-origin stylesheets
                            }
                        }
                    } catch (e) {
                        console.log('Could not access keyframes');
                    }
                    
                    return animationData;
                }
            """)
            
            return animations
        except Exception as e:
            logger.error(f"Error detecting animations: {e}")
            return {}

    async def _check_responsive_elements(self, page: Page) -> Dict[str, Any]:
        """Check for responsive design elements"""
        try:
            responsive = await page.evaluate("""
                () => {
                    const responsiveData = {
                        viewport_meta: null,
                        media_queries: [],
                        flex_elements: [],
                        grid_elements: []
                    };
                    
                    // Check viewport meta tag
                    const viewport = document.querySelector('meta[name="viewport"]');
                    if (viewport) {
                        responsiveData.viewport_meta = viewport.getAttribute('content');
                    }
                    
                    // Check for flex and grid layouts
                    const elements = document.querySelectorAll('*');
                    for (let i = 0; i < Math.min(elements.length, 50); i++) {
                        const elem = elements[i];
                        const computed = window.getComputedStyle(elem);
                        
                        if (computed.display === 'flex' || computed.display === 'inline-flex') {
                            responsiveData.flex_elements.push({
                                tag: elem.tagName.toLowerCase(),
                                className: elem.className,
                                flexDirection: computed.flexDirection,
                                justifyContent: computed.justifyContent,
                                alignItems: computed.alignItems
                            });
                        }
                        
                        if (computed.display === 'grid' || computed.display === 'inline-grid') {
                            responsiveData.grid_elements.push({
                                tag: elem.tagName.toLowerCase(),
                                className: elem.className,
                                gridTemplateColumns: computed.gridTemplateColumns,
                                gridTemplateRows: computed.gridTemplateRows,
                                gap: computed.gap
                            });
                        }
                    }
                    
                    return responsiveData;
                }
            """)
            
            return responsive
        except Exception as e:
            logger.error(f"Error checking responsive elements: {e}")
            return {}

    async def _take_screenshot(self, page: Page) -> str:
        """Take a screenshot of the page"""
        try:
            screenshot_bytes = await page.screenshot(full_page=True)
            return base64.b64encode(screenshot_bytes).decode('utf-8')
        except:
            return ""

    def _extract_semantic_elements(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Extract semantic HTML5 elements and their content"""
        semantic_elements = {}
        
        # Key semantic elements
        semantic_tags = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer']
        
        for tag in semantic_tags:
            elements = soup.find_all(tag)
            if elements:
                semantic_elements[tag] = []
                for elem in elements[:3]:  # Limit to 3 per tag
                    text = elem.get_text(strip=True)
                    semantic_elements[tag].append({
                        'text': text[:300] + '...' if len(text) > 300 else text,
                        'class': ' '.join(elem.get('class', [])),
                        'id': elem.get('id', ''),
                        'children_count': len(elem.find_all())
                    })
        
        return semantic_elements

    async def _extract_layout_structure(self, page: Page) -> Dict[str, Any]:
        """Extract detailed layout structure information"""
        try:
            layout = await page.evaluate("""
                () => {
                    const layoutData = {
                        containers: [],
                        navigation_patterns: [],
                        content_areas: [],
                        layout_type: 'unknown'
                    };
                    
                    // Detect common container patterns
                    const containerSelectors = ['.container', '.wrapper', '.content', '.main', '#main', '.page', '.site'];
                    for (let selector of containerSelectors) {
                        const elem = document.querySelector(selector);
                        if (elem) {
                            const computed = window.getComputedStyle(elem);
                            layoutData.containers.push({
                                selector: selector,
                                maxWidth: computed.maxWidth,
                                width: computed.width,
                                margin: computed.margin,
                                padding: computed.padding
                            });
                        }
                    }
                    
                    // Detect navigation patterns
                    const navElements = document.querySelectorAll('nav, .navbar, .navigation, .menu');
                    for (let nav of navElements) {
                        const computed = window.getComputedStyle(nav);
                        layoutData.navigation_patterns.push({
                            tag: nav.tagName.toLowerCase(),
                            className: nav.className,
                            position: computed.position,
                            display: computed.display,
                            flexDirection: computed.flexDirection,
                            justifyContent: computed.justifyContent
                        });
                    }
                    
                    // Detect content area layout
                    const contentAreas = document.querySelectorAll('main, .content, .main-content, #content');
                    for (let area of contentAreas) {
                        const computed = window.getComputedStyle(area);
                        layoutData.content_areas.push({
                            tag: area.tagName.toLowerCase(),
                            className: area.className,
                            display: computed.display,
                            gridTemplateColumns: computed.gridTemplateColumns,
                            flexDirection: computed.flexDirection
                        });
                    }
                    
                    // Try to determine overall layout type
                    const body = document.body;
                    if (body) {
                        const bodyComputed = window.getComputedStyle(body);
                        if (bodyComputed.display === 'grid') {
                            layoutData.layout_type = 'grid';
                        } else if (bodyComputed.display === 'flex') {
                            layoutData.layout_type = 'flex';
                        } else {
                            layoutData.layout_type = 'traditional';
                        }
                    }
                    
                    return layoutData;
                }
            """)
            
            return layout
        except Exception as e:
            logger.error(f"Error extracting layout structure: {e}")
            return {} 