import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  const { code, slug } = await request.json()
  
  const dir = path.join(process.cwd(), 'app', slug)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  fs.writeFileSync(path.join(dir, 'page.tsx'), code, 'utf-8')
  
  return NextResponse.json({ success: true, slug })
}
