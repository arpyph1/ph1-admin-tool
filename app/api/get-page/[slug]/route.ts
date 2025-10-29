import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const filePath = path.join(process.cwd(), 'pages-storage', `${params.slug}.json`)
  
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  return NextResponse.json(data)
}
