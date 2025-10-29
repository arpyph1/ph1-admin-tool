'use client';

export default function Hero() {
  return (
    <section className="hero">
      <div className="row">
        <div className="column six">
          <h1>Mapping the future of your business & product</h1>
          <h2>
            We pinpoint what your customers and stakeholders want before mapping & testing 
            a new vision for your products and services. Our clients include product teams 
            prototyping improvements, as well as organizational leadership seeking to define 
            and validate strategic futures.
          </h2>
          <a href="/contact" className="btn btn--primary">Get started</a>
        </div>
      </div>
      
      <div className="hero-animation">
        <svg className="svg-logotype" width="100%" height="100%" viewBox="0 0 1000 450" xmlns="http://www.w3.org/2000/svg">
          <image className="svg-logotype-part lines-dots" height="90%" width="80%" href="/images/animation/lines-dots.svg" x="0" y="0" />
          <image className="svg-logotype-part letter-roof-2" height="90%" width="80%" href="/images/animation/letter-roof-2.svg" x="0" y="0" />
          <image className="svg-logotype-part crazy-dots" height="90%" width="80%" href="/images/animation/crazy-dots.svg" x="0" y="0" />
          <image className="svg-logotype-part letter-part-left" height="90%" width="80%" href="/images/animation/letter-part-left.svg" x="0" y="0" />
          <image className="svg-logotype-part letter-part-front" height="90%" width="80%" href="/images/animation/letter-part-front.svg" x="0" y="0" />
          <image className="svg-logotype-part letter-part-3" height="90%" width="80%" href="/images/animation/letter-part-3.svg" x="0" y="0" />
          <image className="svg-logotype-part letter-part-left-2" height="90%" width="80%" href="/images/animation/letter-part-left-2.svg" x="0" y="0" />
          <image className="svg-logotype-part letter-roof" height="90%" width="80%" href="/images/animation/letter-roof.svg" x="0" y="0" />
          <image className="svg-logotype-part orange-bar" height="90%" width="80%" href="/images/animation/orange-bar.svg" x="0" y="0" />
        </svg>
      </div>
    </section>
  );
}
