import Header from './components/Header';

// Force dynamic rendering - homepage fetches fresh data from Contentful
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

async function getCaseStudies() {
  try {
    const token = process.env.CONTENTFUL_DELIVERY_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN;
    if (!token) {
      console.error('Error fetching case studies: Missing Contentful access token');
      return [];
    }
    const res = await fetch(`https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries?content_type=caseStudy&order=-sys.createdAt&limit=6&include=2&access_token=${token}`, { next: { revalidate: 3600 } });
    const data = await res.json();

    const assetMap: any = {};
    if (data.includes?.Asset) {
      data.includes.Asset.forEach((asset: any) => {
        assetMap[asset.sys.id] = asset.fields?.file?.url;
      });
    }

    return data.items?.map((item: any) => {
      const fields = item.fields;
      return {
        name: fields?.name || 'N/A',
        desc: fields?.problemStatement || '',
        img: fields?.carouselImage ? `https:${assetMap[fields.carouselImage.sys.id]}` : '',
        logo: fields?.clientLogo ? `https:${assetMap[fields.clientLogo.sys.id]}` : '',
        urlKey: fields?.urlKey || '#'
      };
    }) || [];
  } catch (error) {
    // Sanitize error to avoid exposing tokens in logs
    const safeError = error instanceof Error ? error.message.replace(/access_token=[^&\s]+/g, 'access_token=[REDACTED]') : 'Unknown error';
    console.error('Error fetching case studies:', safeError);
    return [];
  }
}

export default async function HomePage() {
  const caseStudies = await getCaseStudies();
  
  return (
    <main>
      <Header />

      <div className="row">
        <section className="column eight hero">
          <h1 className="onload-animate-in">
            Mapping the future of your business & product
          </h1>
          <h2 className="onload-animate-in">
            We pinpoint what your customers and stakeholders want before mapping & testing a new vision for your products and services. Our clients include product teams prototyping improvements, as well as organizational leadership seeking to define and validate strategic futures.
          </h2>
          <a href="/contact" className="btn--large onload-animate-in" rel="noopener noreferrer">Get started</a>
        </section>

        <div className="hero-animation">
          <svg className="svg-logotype" width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <svg className="svg-logotype__inner" width="1000px" height="450px" x="0" y="16px">
              <image className="svg-logotype-part lines-dots" height="90%" width="80%" href="/images/animation/lines-dots.svg" x="0" y="0" />
              <image className="svg-logotype-part letter-roof-2" height="90%" width="80%" href="/images/animation/letter-roof-2.svg" x="0" y="0" />
              <g>
                <image className="svg-logotype-part crazy-dots" height="90%" width="80%" href="/images/animation/crazy-dots.svg" x="0" y="0" />
                <image className="svg-logotype-part letter-part-left" height="90%" width="80%" href="/images/animation/letter-part-left.svg" x="0" y="0" />
                <g>
                  <image className="svg-logotype-part letter-part-front" height="90%" width="80%" href="/images/animation/letter-part-front.svg" x="0" y="0" />
                  <image className="svg-logotype-part letter-part-3" height="90%" width="80%" href="/images/animation/letter-part-3.svg" x="0" y="0" />
                </g>
                <image className="svg-logotype-part letter-part-left-2" height="90%" width="80%" href="/images/animation/letter-part-left-2.svg" x="0" y="0" />
                <image className="svg-logotype-part letter-roof" height="90%" width="80%" href="/images/animation/letter-roof.svg" x="0" y="0" />
              </g>
              <image className="svg-logotype-part orange-bar" height="90%" width="80%" href="/images/animation/orange-bar.svg" x="0" y="0" />
            </svg>
          </svg>
        </div>
      </div>

      <div className="section-case-studies">
        <div className="row">
          <section className="column">
            <h3 className="section-title">Our Work</h3>
          </section>
        </div>

        <div className="section-case-studies__container carousel-container">
          {caseStudies.map((study: any, i: number) => (
            <a key={i} href={`/case-study/${study.urlKey}`} className="case-study">
              <img className="lazy" src={study.img} alt={study.name} />
              <div className="image-filter"></div>
              <img className="lazy case-study__logo" src={study.logo} alt={study.name} />
              <p>{study.desc}</p>
            </a>
          ))}
        </div>
      </div>

      <footer>
        <article className="row footer-top-row">
          <h3 className="footer__header">PH1 RESEARCH INC.</h3>
          <hr className="footer__hr" />
          
          <div className="column one-third">
            <span className="footer__text">
              1863 Alberni Street #703<br />
              Vancouver, BC<br />
              <br />
              info@ph1.ca<br />
              (604) 373-3213
            </span>
          </div>
          <div className="column one-third">
            <span>
              <a className="link link--block footer__link" href="/services/cx/customer-experience-audits">CX Research & Strategy</a>
              <a className="link link--block footer__link" href="/user-experience">Usability & Accessibility Testing</a>
            </span>
          </div>
          <div className="column one-third">
            <span>
              <a className="link link--block footer__link" href="/">Home</a>
              <a className="link link--block footer__link" href="/contact">Contact us</a>
              <a className="link link--block footer__link" href="/agency">Agency</a>
              <a className="link link--block footer__link" href="/clients">Clients</a>
            </span>
          </div>
        </article>
        <div className="footer-bottom-row">
          <div className="row">
            <div className="column whole">
              <span className="footer__text">© 2026 PH1 Research Inc.</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
