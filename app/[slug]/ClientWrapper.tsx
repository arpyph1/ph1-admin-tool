'use client';

import { useState, useEffect } from 'react';

export default function ClientWrapper({ title, heroHeadline, heroSubheadline, mainContent, heroImage, ctaText, showCaseStudies, showTrends, showContactForm, caseStudies, trends }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Attach scroll handler to CTA buttons
    const attachScrollHandlers = () => {
      const ctaButtons = document.querySelectorAll('.cta-scroll-to-contact');
      console.log('Found CTA buttons:', ctaButtons.length);
      
      ctaButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          console.log('CTA clicked, scrolling to contact...');
          const contactSection = document.getElementById('contact');
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            console.error('Contact section not found!');
          }
        });
      });
    };

    // Wait for content to load
    setTimeout(attachScrollHandlers, 100);
    
    return () => {
      const ctaButtons = document.querySelectorAll('.cta-scroll-to-contact');
      ctaButtons.forEach((button) => {
        button.removeEventListener('click', attachScrollHandlers as any);
      });
    };
  }, [mainContent]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('🚀 Form submission started');
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName')?.toString() || '',
      lastName: formData.get('lastName')?.toString() || '',
      company: formData.get('company')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      message: formData.get('message')?.toString() || '',
      pageTitle: title,
      type: 'Form Submission'
    };

    console.log('📤 Data to submit:', data);

    try {
      console.log('📡 Sending request to /api/airtable-submit...');
      
      const response = await fetch('/api/airtable-submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      console.log('📥 Response received. Status:', response.status);
      
      let result;
      try {
        result = await response.json();
        console.log('📥 Response JSON:', result);
      } catch (jsonError) {
        console.error('❌ Failed to parse response JSON:', jsonError);
        const text = await response.text();
        console.log('Response text:', text);
        throw new Error('Invalid JSON response from server');
      }

      if (response.ok && result.success) {
        console.log('✅ SUCCESS! Record ID:', result.id);
        alert('✅ Thank you! Your message has been received.\n\nYou will be redirected to ph1.ca in 2 seconds...');
        
        setTimeout(() => {
          console.log('🔄 Redirecting to ph1.ca...');
          window.location.href = 'https://ph1.ca';
        }, 2000);
      } else {
        console.error('❌ Submission failed. Response:', result);
        alert(`❌ Submission failed!\n\nError: ${result.error || 'Unknown error'}\n\nPlease check the browser console (F12) for more details.`);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('❌ Network or fetch error:', error);
      alert(`❌ Network error!\n\n${error}\n\nPlease check:\n1. Your internet connection\n2. Browser console (F12) for details\n3. Airtable credentials in .env.local`);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white">
      <section className="notification-bar">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center gap-4">
          <span className="text-sm">Design of AI podcast: The podcast for product teams</span>
          <a href="https://open.spotify.com/show/3O11vQKPpKI5ZlJhdRGwnf" className="bg-[#ffc72d] text-black px-3 py-1.5 font-bold text-xs hover:bg-[#fab700]">List of episodes</a>
        </div>
      </section>

      <header className="header">
        <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
          <a href="/" className="flex items-center">
            <img src="/images/logo.svg" alt="PH1.ca" className="h-10" />
          </a>
          <nav className="flex gap-8 items-center">
            <a href="#" className="font-normal text-sm text-black hover:text-[#51c2e7] transition-colors">Services</a>
            <a href="#work" className="font-normal text-sm text-black hover:text-[#51c2e7] transition-colors">Our Work</a>
            <a href="#" className="font-normal text-sm text-black hover:text-[#51c2e7] transition-colors">Training</a>
            <a href="#" className="font-normal text-sm text-black hover:text-[#51c2e7] transition-colors">About</a>
            <a href="#contact" className="bg-[#ffc72d] px-5 py-2 font-bold text-sm text-black hover:bg-[#fab700] transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      <div className="bg-white">
        <section className="bg-white pt-12 pb-10 md:pt-20 md:pb-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
              <div>
                {heroHeadline && (
                  <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-black">
                    {heroHeadline}
                  </h1>
                )}
                {heroSubheadline && (
                  <p className="text-xl md:text-[22px] text-gray-700 mb-8 leading-relaxed font-normal">
                    {heroSubheadline}
                  </p>
                )}
                {mainContent && (
                  <div 
                    className="text-base text-gray-700 leading-relaxed space-y-5 font-normal" 
                    dangerouslySetInnerHTML={{ __html: mainContent }} 
                  />
                )}
              </div>
              <div className="hidden md:flex items-start justify-center sticky top-20">
                <img src={heroImage} alt="Hero Illustration" className="w-full max-w-lg" />
              </div>
            </div>
          </div>
        </section>

        {(showCaseStudies || showTrends) && (
          <div className="bg-[#f5f5f5] py-16 md:py-24">
            {showCaseStudies && caseStudies.length > 0 && (
              <div className={showTrends ? 'mb-20' : ''} id="work">
                <div className="max-w-7xl mx-auto px-4">
                  <h2 className="text-5xl font-bold mb-12 text-black">Our Work</h2>
                </div>
                <div className="overflow-x-auto">
                  <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-4" style={{ width: 'max-content' }}>
                      {caseStudies.map((study: any) => {
                        const problemStatement = study.fields?.problemStatement || '';
                        const key = study.fields?.urlKey || study.sys?.id;
                        const imageUrl = study.resolvedHeroImage ? `https:${study.resolvedHeroImage}` : null;
                        
                        return (
                          <a key={study.sys.id} href={`/case-study/${key}`} className="case-study">
                            {imageUrl && (
                              <>
                                <div className="image-filter"></div>
                                <img src={imageUrl} alt="Case study" loading="lazy" />
                              </>
                            )}
                            <div>
                              <p>{problemStatement}</p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showTrends && trends.length > 0 && (
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-5xl font-bold mb-12 text-black">Upskill Your Team</h2>
                <div className="grid grid-cols-4 gap-1">
                  {trends.map((trend: any) => {
                    const title = trend.fields?.title || 'Article';
                    const key = trend.fields?.urlKey || trend.fields?.key || trend.sys?.id;
                    const imageUrl = trend.resolvedHeroImage ? `https:${trend.resolvedHeroImage}` : null;
                    
                    return (
                      <a key={trend.sys.id} href={`/blog/${key}`} className="resource-card">
                        {imageUrl && (
                          <>
                            <div className="image-filter"></div>
                            <img src={imageUrl} alt={title} loading="lazy" />
                          </>
                        )}
                        <div>
                          <p>STRATEGY, AI, DESIGN, PRODUCT</p>
                          <h3>{title}</h3>
                          <span>Learn More →</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {showContactForm && (
          <section id="contact" className="bg-white py-20 md:py-28">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-16 text-center text-black">Tell Us About Your Project</h2>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input name="firstName" type="text" placeholder="First name" required className="w-full px-4 py-3.5 border border-gray-300 focus:border-black focus:outline-none font-normal text-base" />
                  <input name="lastName" type="text" placeholder="Last name" required className="w-full px-4 py-3.5 border border-gray-300 focus:border-black focus:outline-none font-normal text-base" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <input name="company" type="text" placeholder="Company" className="w-full px-4 py-3.5 border border-gray-300 focus:border-black focus:outline-none font-normal text-base" />
                  <input name="email" type="email" placeholder="Email Address" required className="w-full px-4 py-3.5 border border-gray-300 focus:border-black focus:outline-none font-normal text-base" />
                </div>
                <textarea name="message" placeholder="Your Message goes here" rows={7} required className="w-full px-4 py-3.5 border border-gray-300 focus:border-black focus:outline-none resize-none font-normal text-base"></textarea>
                <div className="flex justify-center pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="bg-[#ffc72d] text-black px-14 py-4 font-bold text-sm hover:bg-[#fab700] transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? '⏳ SUBMITTING...' : (ctaText || 'GO NOW')}
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
