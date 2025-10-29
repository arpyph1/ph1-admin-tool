import { NextRequest, NextResponse } from 'next/server'
import { generatePageCode } from '@/lib/ph1/previewGenerator'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { slug, title, description, tone } = await request.json()
    
    const code = generatePageCode(slug, title, description, tone)
    
    const pageDir = path.join(process.cwd(), 'app', slug)
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true })
    }
    
    fs.writeFileSync(path.join(pageDir, 'page.tsx'), code)
    
    return NextResponse.json({
      success: true,
      message: `Page created with ${tone} design`,
      path: `app/${slug}/page.tsx`,
      url: `/${slug}`
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message
    }, { status: 500 })
  }
}
