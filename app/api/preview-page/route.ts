import { NextRequest, NextResponse } from 'next/server'
import { generatePreviewVariations } from '@/lib/ph1/previewGenerator'

export async function POST(request: NextRequest) {
  try {
    const { slug, title, description } = await request.json()
    
    const variations = generatePreviewVariations(slug, title, description)
    
    return NextResponse.json({
      success: true,
      variations
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message
    }, { status: 500 })
  }
}
