import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import * as contentful from 'contentful-management';
import mammoth from 'mammoth';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

async function extractTextFromDocument(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.docx')) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
    return await file.text();
  } else {
    return await file.text();
  }
}

function stripAllInternalLinks(html: string): string {
  // Remove ALL internal links (starting with /)
  return html.replace(/<a\s+href="(\/[^"]*)"[^>]*>([^<]+)<\/a>/gi, '$2');
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const purpose = formData.get('purpose') as string;
    const selling = formData.get('selling') as string;
    const proofPoints = formData.get('proofPoints') as string;
    const takeaway = formData.get('takeaway') as string;
    const cta = formData.get('cta') as string;
    const heroImage = formData.get('heroImage') as string;
    const wordCount = formData.get('wordCount') as string;
    const includeLinks = formData.get('includeLinks') === 'true';
    const showCaseStudies = formData.get('showCaseStudies') === 'true';
    const showTrends = formData.get('showTrends') === 'true';
    const showContactForm = formData.get('showContactForm') === 'true';
    
    const file = formData.get('document') as File | null;
    let documentContent = '';
    
    if (file) {
      documentContent = await extractTextFromDocument(file);
      console.log('=== DOCUMENT UPLOADED ===');
      console.log('Filename:', file.name);
      console.log('Extracted length:', documentContent.length);
    }

    const slug = purpose.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 50);
    
    const videoMatch = proofPoints?.match(/(?:video|embed):\s*(https?:\/\/[^\s]+)/i);
    const videoUrl = videoMatch ? videoMatch[1] : '';
    
    const hasVideo = !!videoUrl;
    const hasBullets = proofPoints?.toLowerCase().includes('bullet') || proofPoints?.toLowerCase().includes('list');

    // Inline onclick for scroll
    const ctaHtml = showContactForm 
      ? `<div style="text-align: center; margin: 3rem 0;">
<a href="#contact" onclick="event.preventDefault(); const el = document.getElementById('contact'); if(el) el.scrollIntoView({behavior: 'smooth'}); return false;" style="display: inline-block; background: #ffc72d; color: #000; padding: 1rem 3.5rem; font-weight: 700; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.875rem; cursor: pointer;">${cta || 'GET STARTED'}</a>
</div>`
      : `<div style="text-align: center; margin: 3rem 0;">
<a href="mailto:info@ph1.ca?subject=${encodeURIComponent(purpose)}" style="display: inline-block; background: #ffc72d; color: #000; padding: 1rem 3.5rem; font-weight: 700; text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.875rem;">${cta || 'CONTACT US'}</a>
</div>`;

    let prompt = `Create content about: "${purpose}"

Description: ${selling}

Requirements: ${proofPoints}

${documentContent ? `
DOCUMENT CONTENT:
${documentContent.substring(0, 12000)}
` : ''}

${hasVideo ? `VIDEO: ${videoUrl}` : ''}

CLOSING STATEMENT:
${takeaway}

Position PH1 (specializes in user research, information architecture, and website optimization for universities/colleges/educational institutions) as the solution to the problems on THIS page. Be specific and strategic.

CRITICAL RULES:
1. DO NOT include ANY links to internal pages (no /case-study/, /blog/, etc.)
2. You can mention topics but DO NOT create clickable links
3. Keep content focused on the document/requirements
${hasBullets ? '4. Use <ul>/<ol> for lists' : ''}

STRUCTURE:
- <h2> section headers
- <p><strong>Title:</strong> content</p> subsections
- CTA button
- Strategic closing statement

${ctaHtml}

<p style="font-size: 18px; font-weight: 600; margin-top: 2rem; line-height: 1.6;">[Strategic closing about PH1]</p>

<p>For direct inquiries: info@ph1.ca or +1-437-374-9394.</p>

Return ONLY JSON:
{
  "heroHeadline": "Headline",
  "heroSubheadline": "Subheadline",
  "mainContent": "HTML content"
}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 12000,
      messages: [{ role: 'user', content: prompt }],
    });
    
    const aiResponse = response.content[0].type === 'text' ? response.content[0].text : '';
    
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    
    const generated = JSON.parse(jsonMatch[0]);
    
    // Strip ALL internal links as safety measure
    generated.mainContent = stripAllInternalLinks(generated.mainContent);
    console.log('✓ Stripped all internal links from content');

    const fields: any = {
      key: {"en-US": slug},
      title: {"en-US": purpose},
      heroHeadline: {"en-US": generated.heroHeadline},
      heroSubheadline: {"en-US": generated.heroSubheadline},
      mainContent: {"en-US": generated.mainContent},
      ctaText: {"en-US": cta || "Contact Us"},
      ctaLink: {"en-US": showContactForm ? "#contact" : `mailto:info@ph1.ca?subject=${encodeURIComponent(purpose)}`},
      showCaseStudies: {"en-US": showCaseStudies},
      showTrends: {"en-US": showTrends},
      showContactForm: {"en-US": showContactForm}
    };

    if (heroImage && heroImage.trim() && heroImage.trim().length <= 255) {
      fields.heroImage = {"en-US": heroImage.trim()};
    }

    const modifications = [{ contentType: "landingPage", fields }];

    const displayImage = (heroImage && heroImage.trim() && heroImage.trim().length <= 255) 
      ? heroImage.trim() 
      : "https://ph1.ca/images/contact/hero_graphic_expanded.svg";

    const preview = [{
      after: {
        key: slug,
        title: purpose,
        heroHeadline: generated.heroHeadline,
        heroSubheadline: generated.heroSubheadline,
        mainContent: generated.mainContent,
        heroImage: displayImage,
        ctaText: cta || "Contact Us",
        showCaseStudies,
        showTrends,
        showContactForm
      }
    }];

    return NextResponse.json({ preview, modifications });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { modifications } = await request.json();
    const client = contentful.createClient({ accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN! });
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment('master');

    for (const mod of modifications) {
      const entry = await environment.createEntry(mod.contentType, { fields: mod.fields });
      await entry.publish();
      console.log('✓ Published:', entry.sys.id);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Publish error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
