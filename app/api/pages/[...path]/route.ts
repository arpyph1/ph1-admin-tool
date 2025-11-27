import { NextResponse } from 'next/server'
import { parsePageFile } from '@/lib/parsers/page-parser'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const pagePath = path.join(process.cwd(), 'app', ...params.path)
    const parsed = parsePageFile(pagePath)
    
    return NextResponse.json(parsed)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
