import { NextRequest, NextResponse } from 'next/server'
import { findAndReplace } from '@/lib/ph1/globalUpdater'

export async function POST(request: NextRequest) {
  try {
    const { find, replace } = await request.json()
    const result = findAndReplace(find, replace, 'all')
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message
    }, { status: 500 })
  }
}
