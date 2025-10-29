export default function HomePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}} />

      <main className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="text-2xl font-bold text-blue-900">
                  PH1.ca
                </a>
              </div>
              <div className="flex items-center space-x-8">
                <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
                <a href="/services" className="text-gray-700 hover:text-blue-600">Services</a>
                <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
                <a href="/contact" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">
              Transform Your Digital Products
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto animate-fade-in">
              20+ years of proven expertise in UX strategy, conversion optimization, and product transformation for Fortune 500 companies.
            </p>
            <div className="space-x-4 animate-fade-in">
              <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
                Get Started Today
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors">
                View Case Studies
              </button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Expertise</h2>
              <p className="text-xl text-gray-600">Comprehensive digital transformation services</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">UX</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">UX Strategy & Research</h3>
                <p className="text-gray-600">Deep user insights that inform winning product strategies.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">CX</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Customer Experience</h3>
                <p className="text-gray-600">Journey optimization that maximizes customer value.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">AI</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Strategy</h3>
                <p className="text-gray-600">Practical AI implementation that drives results.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              Trusted by Industry Leaders
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {['Fortune 500', 'Tech Startups', 'E-commerce', 'SaaS'].map(item => (
                <div key={item} className="flex items-center justify-center h-16 bg-gray-100 rounded-lg text-gray-600 font-semibold">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="bg-blue-900 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Digital Products?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss how 20+ years of expertise can accelerate your success.
            </p>
            <button className="bg-white text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-shadow">
              Schedule a Strategy Call
            </button>
          </div>
        </section>
      </main>
    </>
  )
}
