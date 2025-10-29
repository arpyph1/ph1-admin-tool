// Real PH1.ca component patterns extracted from your homepage
export const PH1_COMPONENTS = {
  hero: {
    pattern: 'hero',
    html: (data: any) => `
      <section class="hero py-20 px-4">
        <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1>${data.heading}</h1>
            <h2>${data.subheading}</h2>
            <a href="${data.ctaLink}" class="btn--large inline-block">${data.ctaText}</a>
          </div>
          <div class="relative h-96 flex items-center justify-center">
            ${data.visual || '<div class="bg-gradient-to-br from-blue-500 to-purple-600 w-full h-full rounded-lg"></div>'}
          </div>
        </div>
      </section>
    `
  },

  caseStudyCarousel: {
    pattern: 'work-carousel',
    html: (data: any) => `
      <section id="work" class="py-12">
        <div class="max-w-7xl mx-auto px-4 mb-6">
          <h3 class="text-4xl font-bold">${data.heading}</h3>
        </div>
        <div class="overflow-x-auto pb-8 px-4">
          <div class="flex gap-8 min-w-max">
            ${data.cases?.map((work: any) => `
              <div class="case-study relative overflow-hidden flex-shrink-0">
                <img src="/images/${work.img}" class="absolute inset-0 w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-black"></div>
                <div class="relative z-10">
                  <img src="/images/${work.logo}" class="w-16 mb-4 brightness-0 invert" />
                  <p class="text-sm font-semibold text-white">${work.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `
  },

  clientGrid: {
    pattern: 'clients',
    html: (data: any) => `
      <section class="py-16 relative">
        <div class="absolute inset-0 bg-[#010101] -bottom-12 rounded-[100%_100%_0_0]"></div>
        <div class="relative max-w-4xl mx-auto bg-white shadow-2xl p-12">
          <h3 class="text-4xl font-bold text-center mb-12">${data.heading}</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-12">
            ${data.clients?.map((client: any) => `
              <img src="/images/${client.logo}" alt="${client.name}" class="w-full h-auto object-contain" />
            `).join('')}
          </div>
        </div>
      </section>
    `
  },

  textSection: {
    pattern: 'text-content',
    html: (data: any) => `
      <section class="py-16 px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-4xl font-bold mb-6">${data.heading}</h2>
          ${data.paragraphs?.map((p: string) => `<p class="text-lg mb-4 leading-relaxed">${p}</p>`).join('')}
        </div>
      </section>
    `
  }
};

export const AVAILABLE_PATTERNS = [
  'hero',
  'work-carousel', 
  'clients',
  'text-content'
];
