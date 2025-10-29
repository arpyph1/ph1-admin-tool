import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'components.json');

export async function GET() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ components: [] });
  }
}

export async function POST(request: NextRequest) {
  const { action, component } = await request.json();
  
  let data;
  try {
    data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    data = { components: [] };
  }
  
  if (action === 'add') {
    data.components.push({ 
      id: Date.now().toString(), 
      ...component,
      createdAt: new Date().toISOString()
    });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  }
  
  return NextResponse.json({ success: true });
}
