import React from 'react';
import { Section } from '@/lib/contentful';

export function DynamicSection({ section }: { section: Section }) {
  switch (section.type) {
    case 'hero':
      return <HeroSection data={section.content} />;
    case 'clients':
      return <ClientsSection data={section.content} />;
    case 'work':
      return <WorkSection data={section.content} />;
    case 'custom':
      return <CustomSection html={section.htmlContent} />;
    default:
      return null;
  }
}

function HeroSection({ data }: any) {
  return (
    <section className="hero py-20 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1>{data.heading}</h1>
          <h2>{data.subheading}</h2>
          <a href={data.ctaLink || '#contact'} className="btn--large inline-block">
            {data.ctaText || 'Get started'}
          </a>
        </div>
        <div className="relative h-96 flex items-center justify-center">
          <div className="relative w-full h-full">
            <img src="/images/lines-dots.svg" alt="" className="absolute inset-0 w-full h-full object-contain opacity-30" />
            <img src="/images/letter-part-left.svg" alt="" className="absolute inset-0 w-full h-full object-contain" />
            <img src="/images/letter-part-front.svg" alt="" className="absolute inset-0 w-full h-full object-contain" />
            <img src="/images/letter-part-3.svg" alt="" className="absolute inset-0 w-full h-full object-contain" />
            <img src="/images/letter-part-left-2.svg" alt="" className="absolute inset-0 w-full h-full object-contain" />
            <img src="/images/letter-roof.svg" alt="" className="absolute inset-0 w-full h-full object-contain" />
            <img src="/images/letter-roof-2.svg" alt="" className="absolute inset-0 w-full h-full object-contain" />
            <img src="/images/crazy-dots.svg" alt="" className="absolute inset-0 w-full h-full object-contain opacity-50" />
            <img src="/images/orange-bar.svg" alt="" className="absolute inset-0 w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ClientsSection({ data }: any) {
  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-[#010101] -bottom-12 rounded-[100%_100%_0_0]"></div>
      <div className="relative max-w-4xl mx-auto bg-white shadow-2xl p-12">
        <h3 className="text-4xl font-bold text-center mb-12">{data.heading}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {data.clients?.map((client: any, i: number) => (
            <img
              key={i}
              src={`/images/${client.logo}`}
              alt={client.name}
              className="w-full h-auto object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkSection({ data }: any) {
  return (
    <section id="work" className="py-12">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <h3 className="text-4xl font-bold">{data.heading}</h3>
      </div>
      <div className="overflow-x-auto pb-8 px-4">
        <div className="flex gap-8 min-w-max">
          {data.work?.map((work: any, i: number) => (
            <div key={i} className="case-study relative overflow-hidden flex-shrink-0">
              <img src={`/images/${work.img}`} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-black"></div>
              <div className="relative z-10">
                <img src={`/images/${work.logo}`} alt={work.name} className="w-16 mb-4 brightness-0 invert" />
                <p className="text-sm font-semibold text-white">{work.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CustomSection({ html }: { html?: string }) {
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
