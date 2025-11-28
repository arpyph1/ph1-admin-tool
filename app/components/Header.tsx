'use client';

export default function Header() {
  return (
    <>
      <section className="notification-bar">
        <div className="row">
          <span>Design of AI podcast: The podcast for product teams</span>
          <a href="https://open.spotify.com/show/3O11vQKPpKI5ZlJhdRGwnf" className="btn--small" rel="noopener noreferrer">List of episodes</a>
        </div>
      </section>
      <header className="header">
        <a className="header__link" href="/">
          <img className="header__img" src="/images/logo.svg" alt="Site logo" />
        </a>
        <nav className="header__nav">
          <div className="header__nav-wrap">
            <a href="/services" className="header__nav-item">
              <span className="header__nav-item-span">Services</span>
            </a>
            <a href="/#work" className="header__nav-item">
              <span className="header__nav-item-span">Our Work</span>
            </a>
            <a href="/training" className="header__nav-item">
              <span className="header__nav-item-span">Training</span>
            </a>
          </div>
        </nav>
        <div className="header__side-section">
          <a href="/agency" className="header__nav-item">
            <span className="header__nav-item-span">About</span>
          </a>
          <a href="/contact" className="header__nav-sm header__nav-sm--media">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
              <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
            </svg>
          </a>
        </div>
        <div className="hamburger only-on-mobiles">
          <div className="hamburger-box">
            <div className="hamburger-inner"></div>
          </div>
        </div>
      </header>
    </>
  );
}
