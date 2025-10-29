import { NextRequest, NextResponse } from 'next/server'
import { getPreview } from '../store'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const code = getPreview(params.slug)
  
  if (!code) {
    return NextResponse.json({ error: 'Preview not found' }, { status: 404 })
  }
  
  return NextResponse.json({ code })
}
