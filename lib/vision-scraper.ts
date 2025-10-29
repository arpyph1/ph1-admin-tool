import puppeteer from 'puppeteer';
import Anthropic from '@anthropic-ai/sdk';

export async function analyzePageVisually(url: string): Promise<any> {
  let browser;
  try {
    console.log('🎨 Launching browser for:', url);
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    const screenshot = await page.screenshot({ 
      encoding: 'base64',
      fullPage: false
    });
    
    await browser.close();
    
    console.log('👁️  Analyzing visual structure...');
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: screenshot
              }
            },
            {
              type: "text",
              text: "Analyze this webpage's visual structure and return JSON:\n\n{\n  \"layout\": \"Description of overall layout\",\n  \"sections\": [{\"type\": \"hero|grid|text\", \"style\": \"Description\"}],\n  \"colors\": [\"primary\", \"secondary\"],\n  \"typography\": \"Description\",\n  \"spacing\": \"tight|normal|generous\"\n}\n\nJSON only."
            }
          ]
        }
      ]
    });
    
    const result = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = result.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const analysis = JSON.parse(cleaned);
    
    console.log('✅ Visual analysis complete');
    return analysis;
    
  } catch (error: any) {
    console.error('❌ Vision analysis failed:', error.message);
    if (browser) await browser.close();
    return null;
  }
}
