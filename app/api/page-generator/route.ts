import { NextRequest, NextResponse } from 'next/server'
import { createPage } from '@/lib/ph1/pageGenerator'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const result = createPage(data.slug, data.template, data)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message
    }, { status: 500 })
  }
}
