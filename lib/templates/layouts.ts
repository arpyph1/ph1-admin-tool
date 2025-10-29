export const LAYOUT_TEMPLATES = {
  'hero-three-column': {
    name: 'Hero + 3 Columns',
    html: (data: any) => `
      <div class="max-w-7xl mx-auto">
        <div class="text-center py-20 px-4">
          <h1 class="text-5xl font-bold mb-6">${data.heading}</h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">${data.subheading}</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8 px-4 pb-20">
          ${data.columns?.map((col: any) => `
            <div class="text-center">
              <h3 class="text-2xl font-bold mb-4">${col.title}</h3>
              <p class="text-gray-600">${col.description}</p>
            </div>
          `).join('') || ''}
        </div>
      </div>`
  },
  
  'side-by-side': {
    name: 'Side by Side Sections',
    html: (data: any) => `
      <div class="max-w-7xl mx-auto px-4 py-20">
        ${data.sections?.map((section: any, i: number) => `
          <div class="grid md:grid-cols-2 gap-12 items-center mb-20 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}">
            <div>
              <h2 class="text-4xl font-bold mb-6">${section.heading}</h2>
              <p class="text-lg text-gray-600">${section.content}</p>
            </div>
            <div class="bg-gray-100 h-64 rounded-lg"></div>
          </div>
        `).join('') || ''}
      </div>`
  },
  
  'full-width-sections': {
    name: 'Full Width Sections',
    html: (data: any) => `
      ${data.sections?.map((section: any, i: number) => `
        <div class="${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} py-20">
          <div class="max-w-4xl mx-auto px-4 text-center">
            <h2 class="text-4xl font-bold mb-6">${section.heading}</h2>
            <p class="text-lg text-gray-600">${section.content}</p>
          </div>
        </div>
      `).join('') || ''}`
  },
  
  'minimal-single-column': {
    name: 'Minimal Single Column',
    html: (data: any) => `
      <div class="max-w-4xl mx-auto px-4 py-20 space-y-8">
        <h1 class="text-5xl font-bold mb-8">${data.heading}</h1>
        ${data.paragraphs?.map((p: string) => `
          <p class="text-lg leading-relaxed">${p}</p>
        `).join('') || ''}
      </div>`
  }
};

export function detectLayout(structure: any): string {
  const sectionCount = structure.sections?.length || 0;
  const hasColumns = structure.hasColumns || false;
  
  if (hasColumns) return 'hero-three-column';
  if (sectionCount > 3) return 'full-width-sections';
  if (sectionCount > 1) return 'side-by-side';
  return 'minimal-single-column';
}
