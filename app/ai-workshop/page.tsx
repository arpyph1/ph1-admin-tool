export default function AiWorkshopPage() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-blue-900">PH1.ca</a>
            </div>
            <div className="flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
              <a href="/services" className="text-gray-700 hover:text-blue-600">Services</a>
              <a href="/contact" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-6">AI Strategy Wrokshops</h1>
          <p className="text-xl max-w-3xl">Copy a services page and modify it to suit a workshop page with engaging hooks and strong CTAs</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12">What We Deliver</h2>
          <div className="grid md:grid-cols-3 gap-8">
            
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="w-12 h-12 bg-blue-600 rounded-lg mb-4 flex items-center justify-center">
        <span className="text-white text-2xl">✓</span>
      </div>
      <h3 className="text-xl font-semibold mb-3">Expert Consulting</h3>
      <p className="text-gray-600">Detailed information about this benefit.</p>
    </div>
  

    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="w-12 h-12 bg-blue-600 rounded-lg mb-4 flex items-center justify-center">
        <span className="text-white text-2xl">✓</span>
      </div>
      <h3 className="text-xl font-semibold mb-3">Proven Results</h3>
      <p className="text-gray-600">Detailed information about this benefit.</p>
    </div>
  

    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="w-12 h-12 bg-blue-600 rounded-lg mb-4 flex items-center justify-center">
        <span className="text-white text-2xl">✓</span>
      </div>
      <h3 className="text-xl font-semibold mb-3">Long-term Support</h3>
      <p className="text-gray-600">Detailed information about this benefit.</p>
    </div>
  
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">Let's discuss how we can help transform your business.</p>
          <a href="/contact" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700">
            Schedule a Consultation
          </a>
        </div>
      </section>
    </main>
  )
}