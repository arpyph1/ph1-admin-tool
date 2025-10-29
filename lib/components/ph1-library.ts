// PH1.ca Component Library - Based on actual site patterns

export const PH1_COMPONENTS = {
  hero: {
    name: "Hero Section",
    pattern: `
      <section className="hero py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6">{{headline}}</h1>
            <h2 className="text-xl text-gray-300 mb-8">{{subheadline}}</h2>
            <a href="{{ctaUrl}}" className="bg-[#ffc72d] text-black px-8 py-4 rounded font-bold hover:bg-[#fab700] inline-block">
              {{ctaText}}
            </a>
          </div>
          <div className="relative h-96">
            {{heroVisual}}
          </div>
        </div>
      </section>
    `,
    variants: ["full-width", "split", "centered"],
    colors: { bg: "#000000", text: "#ffffff", cta: "#ffc72d" }
  },

  caseStudyCard: {
    name: "Case Study Card",
    pattern: `
      <div className="case-study relative overflow-hidden rounded-lg min-h-[300px] flex-shrink-0 w-[350px]">
        <img src="{{image}}" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-black"></div>
        <div className="relative z-10 p-6 h-full flex flex-col justify-end">
          <img src="{{clientLogo}}" alt="{{clientName}}" className="w-16 mb-4" />
          <p className="text-sm font-semibold text-white">{{description}}</p>
        </div>
      </div>
    `,
    styling: "Dark gradient overlay, white text, client logo top-left"
  },

  clientLogos: {
    name: "Client Logos Section",
    pattern: `
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-[#010101] -bottom-12 rounded-[100%_100%_0_0]"></div>
        <div className="relative max-w-4xl mx-auto bg-white shadow-2xl p-12 rounded-lg">
          <h3 className="text-4xl font-bold text-center text-black mb-12">Our clients</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {{logos}}
          </div>
        </div>
      </section>
    `,
    styling: "White card on curved black background, grayscale logos"
  },

  servicesGrid: {
    name: "Services Grid",
    pattern: `
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">{{title}}</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {{services}}
          </div>
        </div>
      </section>
    `,
    serviceCard: `
      <div className="service group">
        <img src="{{icon}}" alt="" className="w-20 h-20 mb-6" />
        <h4 className="text-xl font-bold mb-2 text-white">{{title}}</h4>
        <p className="text-gray-300 text-sm mb-4">{{description}}</p>
        <span className="text-[#ffc72d] text-sm font-bold inline-flex items-center gap-1">
          Learn More →
        </span>
      </div>
    `
  },

  contactForm: {
    name: "Contact Form",
    pattern: `
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-12 text-black">{{title}}</h3>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="First name" className="input-primary" required />
              <input type="text" placeholder="Last name" className="input-primary" required />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Company" className="input-primary" />
              <input type="email" placeholder="Email Address" className="input-primary" required />
            </div>
            <textarea placeholder="Your Message goes here" rows={5} className="input-primary" required></textarea>
            <button type="submit" className="bg-[#ffc72d] text-black px-8 py-4 rounded font-bold hover:bg-[#fab700] w-full">
              Submit
            </button>
          </form>
        </div>
      </section>
    `
  },

  resourceCards: {
    name: "Resource/Blog Cards",
    pattern: `
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold mb-12 text-black">{{title}}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {{cards}}
          </div>
        </div>
      </section>
    `,
    card: `
      <div className="resource-card relative min-h-[206px] rounded overflow-hidden">
        <img src="{{image}}" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 to-black/85"></div>
        <div className="relative z-10 p-5 h-full flex flex-col justify-between text-white">
          <p className="text-xs font-normal">{{category}}</p>
          <span className="text-base font-semibold leading-tight">{{title}}</span>
          <div className="flex items-center gap-2 font-semibold text-sm">
            Learn More <span className="text-[#ffc72d]">→</span>
          </div>
        </div>
      </div>
    `
  },

  statsSection: {
    name: "Stats/Results Section",
    pattern: `
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {{stats}}
          </div>
        </div>
      </section>
    `,
    stat: `
      <div>
        <div className="text-6xl font-bold text-[#ffc72d] mb-2">{{value}}</div>
        <div className="text-xl text-gray-300">{{label}}</div>
      </div>
    `
  },

  cta: {
    name: "CTA Section",
    pattern: `
      <section className="py-20 bg-[#ffc72d]">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6 text-black">{{headline}}</h2>
          <p className="text-xl mb-8 text-black">{{subheadline}}</p>
          <a href="{{ctaUrl}}" className="bg-black text-white px-8 py-4 rounded font-bold hover:bg-gray-900 inline-block">
            {{ctaText}}
          </a>
        </div>
      </section>
    `
  }
}

export const PH1_DESIGN_TOKENS = {
  colors: {
    primary: "#ffc72d",      // Yellow
    primaryHover: "#fab700",
    accent: "#51c2e7",       // Blue
    dark: "#000000",
    darkAlt: "#010101",
    text: "#ffffff",
    textSecondary: "#d1d5db"
  },
  spacing: {
    section: "py-20",
    container: "max-w-7xl mx-auto px-4"
  },
  typography: {
    h1: "text-5xl font-bold",
    h2: "text-4xl font-bold",
    h3: "text-2xl font-bold",
    body: "text-base",
    small: "text-sm"
  }
}
