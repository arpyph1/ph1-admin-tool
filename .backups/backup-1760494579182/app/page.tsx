'use client'

export default function HomePage() {
  return (
    <main>
      <section className="notification-bar">
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
          <span className="text-sm">Design of AI podcast: The podcast for product teams</span>
          <a href="https://open.spotify.com/show/3O11vQKPpKI5ZlJhdRGwnf" className="bg-[#ffc72d] text-black px-3 py-1.5 font-bold text-xs hover:bg-[#fab700]">
            List of episodes
          </a>
        </div>
      </section>

      <header className="header">
        <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
          <a href="/" className="flex items-center">
            <img src="/images/logo.svg" alt="PH1.ca" className="h-10" />
          </a>
          <nav className="flex gap-6 items-center">
            <a href="#" className="font-medium hover:text-[#51c2e7]">Services</a>
            <a href="#work" className="font-medium hover:text-[#51c2e7]">Our Work</a>
            <a href="#" className="font-medium hover:text-[#51c2e7]">Training</a>
            <a href="#" className="font-medium hover:text-[#51c2e7]">About</a>
            <a href="#contact" className="bg-[#ffc72d] px-4 py-2 font-bold hover:bg-[#fab700]">Contact</a>
          </nav>
        </div>
      </header>

      <section className="hero py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1>Mapping the future of your business & product</h1>
            <h2>We pinpoint what your customers and stakeholders want before mapping & testing a new vision for your products and services. Our clients include product teams prototyping improvements, as well as organizational leadership seeking to define and validate strategic futures.</h2>
            <a href="#contact" className="btn--large inline-block">Get started</a>
          </div>
          <div className="relative h-96 flex items-center justify-center">
            {/* Composite hero graphic - this is the actual 3D illustration */}
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

      <section id="work" className="py-12">
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <h3 className="text-4xl font-bold">Our Work</h3>
        </div>
        <div className="overflow-x-auto pb-8 px-4">
          <div className="flex gap-8 min-w-max">
            {[
              {name: 'Spotify', desc: 'Build the next generation of Spotify for Artists creator platform & analytics', img: 'Spotify_For_Artists_carousel_image.png', logo: 'Spotify_Logo_RGB_White.png'},
              {name: 'TWN', desc: 'Leverage GenAI to disrupt the weather app category', img: 'Screenshot_2024-12-05_at_1.55.11_PM.png', logo: 'twn_logo_white_square.png'},
              {name: 'Bell', desc: 'Define future retail opportunities for telecom stores in 2030', img: 'Future_of_retail_image1.jpeg', logo: 'Bell_White_small_transparent.png'},
              {name: 'Mozilla', desc: 'Become the most trusted security product suite by households internationally', img: 'Mozilla_VPN_image.png', logo: 'moz-logo-1color-white-rgb.png'},
              {name: 'NFL', desc: 'Research and launch the most exciting NFT project in sports', img: '1354725238.0.jpg', logo: 'Frame_79__1_.svg'},
            ].map((work, i) => (
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

      <section className="py-16 relative">
        <div className="absolute inset-0 bg-[#010101] -bottom-12 rounded-[100%_100%_0_0]"></div>
        <div className="relative max-w-4xl mx-auto bg-white shadow-2xl p-12">
          <h3 className="text-4xl font-bold text-center mb-12">Our clients</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              {name: 'Spotify', img: 'Spotify_logo.png'},
              {name: 'Microsoft', img: 'microsoft_grey_logo.png'},
              {name: 'Mozilla', img: 'Mozilla_Corporation-Logo.wine.png'},
              {name: 'TWN', img: 'TWN_logo.png'},
              {name: 'Dapper Labs', img: 'dapperlabs.png'},
              {name: 'TELUS', img: 'Telus-Color.png'},
              {name: 'NFL', img: 'nfl_logo.png'},
              {name: 'Indigo', img: 'Indigo-Color.png'},
              {name: 'Dell', img: 'DELL_LOGO.png'},
              {name: 'BC Ferries', img: 'BC_Ferries_logo.png'},
              {name: 'New Relic', img: 'new_relic_logo.png'},
              {name: 'UFC', img: 'ufc.png'},
              {name: 'Vancity', img: 'vancity_logo.png'},
              {name: 'Canada', img: 'GovCanada-Color.png'},
            ].map(client => (
              <div key={client.name} className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                <img src={`/images/${client.img}`} alt={client.name} className="max-h-16 w-auto grayscale hover:grayscale-0 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-services__container mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How we help product teams</h2>
          <div className="grid md:grid-cols-3 gap-12 mb-20">
            {[
              {icon: 'Polgygon_ConsultingServices.svg', title: 'Explore possibilities of AI to boost your business', desc: 'Scan which innovative uses of AI can benefit your business & get user feedback relevant ones'},
              {icon: 'Polgygon_FractionalTeam.svg', title: 'Pinpoint AI value drivers for your target customers', desc: 'Find out which specific features and use cases your target customers would switch/upgrade for'},
              {icon: 'Polgygon_FindContractors.svg', title: 'Define products & services customers want', desc: 'Conceptualize & test a range of potential AI products so that your team knows where to focus'},
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                  <img src={`/images/${item.icon}`} alt="" className="w-full h-full" />
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-300 text-sm mb-6">{item.desc}</p>
                <button className="bg-[#51c2e7] text-black px-6 py-3 text-xs font-bold hover:bg-[#1da6d3] inline-flex items-center gap-2">
                  Learn More
                  <img src="/images/Arrow_right.svg" alt="" className="w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Podcast & Newsletter */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="bg-white p-6 rounded-lg">
              <iframe 
                style={{borderRadius: '12px'}} 
                src="https://open.spotify.com/embed/show/3O11vQKPpKI5ZlJhdRGwnf/video" 
                width="100%" 
                height="352" 
                frameBorder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              ></iframe>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <iframe 
                src="https://designofai.substack.com/embed" 
                width="100%" 
                height="352" 
                style={{border: '1px solid #EEE', background: 'white'}} 
                frameBorder="0" 
                scrolling="no"
              ></iframe>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {icon: 'folder.svg', title: 'Customer Experience', desc: 'Strategies to improve customer satisfaction & enhance services'},
              {icon: 'pen.svg', title: 'Service Design', desc: 'Map your service ecosystem & solve complex challenges'},
              {icon: 'human.svg', title: 'UX Research', desc: 'Benchmark product performance and improve usability & conversion'},
              {icon: 'innovation-light-bulb.svg', title: 'Innovation Sprints', desc: 'We recruit, research, rapid prototype, and test new products or features'},
              {icon: 'research.svg', title: 'Behavioural Personas', desc: 'Actionable customer insights to shift their customer journeys'},
              {icon: 'head.svg', title: 'Futures & Roadmaps', desc: 'We prioritize improvements & innovation opportunities'},
            ].map((s, i) => (
              <div key={i} className="service group cursor-pointer">
                <div className="w-20 h-20">
                  {/* Icons are already colored - just display them normally */}
                  <img src={`/images/${s.icon}`} alt="" className="w-full h-full" style={{filter: 'none'}} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">{s.title}</h4>
                  <p className="text-gray-300 text-sm mb-4">{s.desc}</p>
                  <span className="text-[#ffc72d] text-sm font-bold group-hover:pl-2 transition-all inline-flex items-center gap-1">
                    <img src="/images/Arrow_right_yellow.svg" alt="" className="w-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Cards */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold mb-12">Upskill Your Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {img: 'DesignofAI_art.png', title: 'Build AI products that customers want | Design of AI podcast', cat: 'Strategy, AI, Design, Product'},
              {img: 'guide_to_genai_2.png', title: 'Guide to designing a GenAI product: From vision to content strategy', cat: 'Strategy, AI, Design, Product'},
              {img: 'evolution_of_digital.png', title: 'The end of UX? This is the start of the service design of AI', cat: 'Strategy, AI, Design, Product'},
              {img: 'Futures_thinking_hero.jpeg', title: 'For More Impactful UX Strategy, Use Futures Thinking', cat: 'Innovation methodology'},
            ].map((resource, i) => (
              <div key={i} className="resource-card relative min-h-[206px] cursor-pointer hover:shadow-2xl transition-shadow rounded overflow-hidden">
                <img src={`/images/${resource.img}`} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/75 to-black/85"></div>
                <div className="relative z-10 p-5 h-full flex flex-col justify-between text-white">
                  <p className="text-xs font-normal mb-2">{resource.cat}</p>
                  <span className="text-base font-semibold leading-tight">{resource.title}</span>
                  <div className="flex items-center gap-2 font-semibold text-sm mt-4">
                    Learn More <img src="/images/Arrow_right_yellow.svg" alt="" className="w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-12">Tell Us About Your Project</h3>
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
            <button type="submit" className="btn--large">Submit</button>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 bg-white">
        <a href="/about" className="flex items-center gap-2 text-2xl font-extrabold hover:opacity-80 uppercase">
          <img src="/images/Arrow_right_yellow.svg" alt="" className="w-7 rotate-180" />
          ABOUT US
        </a>
      </div>

      <footer>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <img src="/images/ph1-site-logo.svg" alt="PH1" className="w-16 mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="font-bold mb-2">PH1 Research Inc</div>
              <div className="text-sm text-gray-400 mb-4">info@ph1.ca</div>
              <div className="text-sm text-gray-400">Vancouver Calgary Toronto</div>
            </div>
            <div className="text-sm space-y-2">
              <a href="/" className="block hover:underline">Home</a>
              <a href="/about" className="block hover:underline">About PH1</a>
              <a href="#" className="block hover:underline">AI product research & strategy</a>
              <a href="#" className="block hover:underline">Customer Experience (CX)</a>
              <a href="#" className="block hover:underline">Service Design</a>
            </div>
            <div className="text-sm text-gray-400">
              <div className="mb-4">© PH1 Research 2024</div>
              <a href="/privacy" className="hover:underline">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
