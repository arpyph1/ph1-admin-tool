'use client';

export default function Header() {
  return (
    <header className="header">
      <a className="header__link" href="/">
        <img className="header__img" src="/images/logo.svg" alt="Site logo" />
      </a>
      <nav className="header__nav">
        <div className="header__nav-wrap">
          <a href="/customer-experience" className="header__nav-item nav-customer-experience">
            <span className="header__nav-item-span">Customer Experience</span>
          </a>
          <a href="/service-design" className="header__nav-item nav-service-design">
            <span className="header__nav-item-span">Service Design</span>
          </a>
        </div>

        <span className="header__nav-item--container">
          <a href="/clients" className="header__nav-item nav-clients">
            <span className="header__nav-item-span">Clients & industries</span>
          </a>
        </span>

        <span className="header__nav-item--container">
          <a href="/agency" className="header__nav-item">
            <span className="header__nav-item-span">Agency</span>
          </a>
        </span>
      </nav>
      <div className="header__side-section">
        <a href="/contact" className="header__nav-sm header__nav-sm--media">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
          </svg>
        </a>
        <a href="https://www.linkedin.com/company/ph1-ca" className="header__nav-sm header__nav-sm--media hide-on-mobiles" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </a>
      </div>
      <div className="hamburger only-on-mobiles">
        <div className="hamburger-box">
          <div className="hamburger-inner"></div>
        </div>
      </div>
    </header>
  );
}
