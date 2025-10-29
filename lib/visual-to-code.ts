export function translateVisualToTailwind(visualAnalysis: any): any {
  const instructions = {
    components: [] as any[]
  };
  
  // Analyze each section and map to concrete Tailwind patterns
  visualAnalysis.sections?.forEach((section: any) => {
    if (section.type === 'hero' || section.style?.includes('full-width')) {
      instructions.components.push({
        pattern: 'full-hero',
        tailwind: 'min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white',
        structure: 'centered-text-over-image'
      });
    } else if (section.type === 'grid' || section.style?.includes('column')) {
      instructions.components.push({
        pattern: 'grid-section',
        tailwind: 'grid md:grid-cols-3 gap-8 py-20',
        structure: 'cards-or-features'
      });
    } else {
      instructions.components.push({
        pattern: 'text-section',
        tailwind: 'max-w-4xl mx-auto py-16',
        structure: 'prose-content'
      });
    }
  });
  
  return instructions;
}

export function generateCodePrompt(visualAnalysis: any, requirements: string): string {
  const translation = translateVisualToTailwind(visualAnalysis);
  
  return `VISUAL STRUCTURE TO REPLICATE:
${JSON.stringify(visualAnalysis, null, 2)}

CONCRETE IMPLEMENTATION PATTERNS:
${translation.components.map((c: any, i: number) => 
  `Section ${i + 1}: Use ${c.pattern}
  - Tailwind classes: ${c.tailwind}
  - Structure: ${c.structure}`
).join('\n\n')}

REQUIREMENTS: ${requirements}

YOU MUST:
1. Create actual HTML elements (div, section, h1, p) with Tailwind classes
2. Match the spacing and layout exactly as described
3. Use real content, not placeholder images
4. Make it responsive (use md: breakpoints)

EXAMPLE OF FULL HERO:
<section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white relative">
  <div class="absolute inset-0 bg-cover bg-center opacity-30" style="background-image: url('/images/hero.jpg')"></div>
  <div class="relative z-10 text-center px-4">
    <h1 class="text-6xl font-bold mb-4">Heading</h1>
    <p class="text-xl max-w-2xl mx-auto">Subheading text</p>
  </div>
</section>

Now generate the complete page HTML following these patterns.`;
}
