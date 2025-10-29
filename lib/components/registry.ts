export const COMPONENT_LIBRARY = {
  sections: {
    hero: {
      name: "Hero Section",
      description: "Large header with headline, subheadline, and CTA",
      variants: ["full-width", "split", "minimal"],
      editableFields: ["headline", "subheadline", "cta", "ctaUrl", "image"],
    },
    testimonial: {
      name: "Testimonial Block",
      description: "Customer testimonial with quote, author, and photo",
      variants: ["single", "carousel", "grid"],
      editableFields: ["quote", "author", "company", "photo", "rating"],
    },
    pricing: {
      name: "Pricing Table",
      description: "Pricing comparison with features and CTAs",
      variants: ["2-column", "3-column", "comparison"],
      editableFields: ["plans", "features", "prices", "cta"],
    },
    caseStudy: {
      name: "Case Study Card",
      description: "Project showcase with image and description",
      variants: ["featured", "grid", "list"],
      editableFields: ["title", "client", "description", "image", "link", "results"],
    },
    faq: {
      name: "FAQ Section",
      description: "Frequently asked questions with expandable answers",
      variants: ["accordion", "grid"],
      editableFields: ["questions"],
    },
    services: {
      name: "Services Grid",
      description: "Grid of service offerings with icons",
      variants: ["2-column", "3-column"],
      editableFields: ["items"],
    },
    clientLogos: {
      name: "Client Logos",
      description: "Grid or carousel of client logos",
      variants: ["grid", "carousel"],
      editableFields: ["logos"],
    },
    contactForm: {
      name: "Contact Form",
      description: "Contact form with customizable fields",
      variants: ["simple", "detailed"],
      editableFields: ["title", "fields", "submitText"],
    }
  }
}

export type ComponentType = keyof typeof COMPONENT_LIBRARY.sections
export type Component = typeof COMPONENT_LIBRARY.sections[ComponentType]
