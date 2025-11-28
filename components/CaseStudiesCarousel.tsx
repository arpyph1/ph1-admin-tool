'use client';
import { useState, useEffect } from 'react';

export function CaseStudiesCarousel() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/case-studies')
      .then(res => res.json())
      .then(data => {
        setCaseStudies(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || caseStudies.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-5xl font-bold mb-12 text-black">Our Work</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {caseStudies.slice(0, 6).map((study: any) => {
          const title = study.fields?.title || 'Untitled';
          const desc = study.fields?.problemStatement || '';
          const key = study.fields?.key || study.sys?.id;
          const image = study.fields?.heroImage;
          const imageUrl = image ? \`https:\${image}\` : null;

          return (
            
              key={study.sys.id}
              href={\`/case-study/\${key}\`}
              className="case-study block relative overflow-hidden aspect-square"
            >
              {imageUrl && (
                <>
                  <div className="image-filter"></div>
                  <img
                    className="lazy loaded case-study__logo"
                    alt="Case study image"
                    loading="lazy"
                    src={imageUrl}
                  />
                </>
              )}
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white z-10">
                <h3 className="font-bold text-xl mb-2 leading-tight">{title}</h3>
                <p className="text-sm text-gray-200 mb-3 line-clamp-2">{desc.substring(0, 100)}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
