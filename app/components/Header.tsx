'use client';

export default function Header() {
  return (
    <header className="header">
      <a className="header_link" href="/">
        <img className="header__img" src="/images/logo.svg" alt="Site logo" />
      </a>
      <div className="flex-grow only-on-mobiles"></div>
      <div className="hamburger only-on-mobiles">
        <div className="hamburger-box">
          <div className="hamburger-inner"></div>
        </div>
      </div>
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
      <div className="header__social-media">
        <a href="/contact" className="header__nav-sm header__nav-sm--media">
          <i className="fa fa-envelope header__nav-sm-icon" aria-hidden="true"></i>
        </a>
        <a href="https://www.linkedin.com/company/ph1-ca" className="header__nav-sm header__nav-sm--media hide-on-mobiles" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-linkedin-in header__nav-sm-icon" aria-hidden="true"></i>
        </a>
      </div>
    </header>
  );
}
