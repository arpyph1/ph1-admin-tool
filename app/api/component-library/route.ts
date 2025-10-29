import { NextResponse } from 'next/server';
import { buildComponentLibrary } from '@/lib/component-library';

export async function GET() {
  try {
    const library = await buildComponentLibrary();
    
    return NextResponse.json({
      totalComponents: library.length,
      byCategory: {
        hero: library.filter(c => c.category === 'hero').length,
        card: library.filter(c => c.category === 'card').length,
        grid: library.filter(c => c.category === 'grid').length,
        text: library.filter(c => c.category === 'text').length,
        section: library.filter(c => c.category === 'section').length,
        image: library.filter(c => c.category === 'image').length,
      },
      components: library.map(c => ({
        id: c.id,
        name: c.name,
        category: c.category,
        source: c.source,
        html: c.html,
        htmlPreview: c.html.substring(0, 200),
        classCount: c.tailwindClasses.length,
        variables: c.variables,
        appearsOn: c.appearsOn,
        description: c.description
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
