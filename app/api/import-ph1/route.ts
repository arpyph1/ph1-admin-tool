import { NextResponse } from 'next/server'
import { importRealPH1, applyImportedContent } from '@/lib/ph1/realContentImporter'

export async function POST() {
  try {
    const content = await importRealPH1()
    const message = applyImportedContent()
    
    return NextResponse.json({
      success: true,
      message,
      imported: {
        navigation: content.navigation.length,
        sections: content.sections.length,
        images: content.images.length
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Import failed: ${(error as Error).message}`
    }, { status: 500 })
  }
}
