// app/api/modification-history/route.ts
import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';

export async function GET() {
  try {
    const historyPath = path.join(process.cwd(), 'data', 'modification-history.json');
    
    try {
      const data = await fs.readFile(historyPath, 'utf-8');
      const history = JSON.parse(data);
      
      return NextResponse.json({
        success: true,
        history,
      });
    } catch (error: any) {
      return NextResponse.json({
        success: true,
        history: [],
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const historyPath = path.join(process.cwd(), 'data', 'modification-history.json');
    
    const data = await fs.readFile(historyPath, 'utf-8');
    let history = JSON.parse(data);
    
    history = history.filter((item: any) => item.id !== id);
    
    await fs.writeFile(historyPath, JSON.stringify(history, null, 2));
    
    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
