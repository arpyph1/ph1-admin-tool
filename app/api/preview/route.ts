import { NextRequest, NextResponse } from 'next/server'
import { savePreview } from './store'

export async function POST(request: NextRequest) {
  try {
    const { code, slug } = await request.json()
    
    const cleanSlug = slug.replace(/^-+|-+$/g, '').replace(/-+/g, '-')
    
    console.log('Saving preview for slug:', cleanSlug)
    
    // Save to memory instead of file
    savePreview(cleanSlug, code)

    return NextResponse.json({ 
      success: true,
      url: `/preview/${cleanSlug}`
    })
  } catch (error) {
    console.error('Preview error:', error)
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}
