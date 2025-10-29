'use client'

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-6xl font-bold mb-8">Understanding Hallucinations</h1>
          <p className="text-xl mb-12 max-w-3xl">
            Comprehensive information about hallucinations, their types, causes, and treatment options. 
            Learn about this complex neurological phenomenon and available support resources.
          </p>
          <button className="bg-yellow-400 text-black px-8 py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
            Get Professional Help
          </button>
        </div>
      </section>

      {/* What Are Hallucinations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12">What Are Hallucinations?</h2>
          <div className="bg-gray-900 p-6 rounded-lg mb-8">
            <p className="text-lg mb-6">
              Hallucinations are perceptual experiences that occur without an external stimulus. 
              They can affect any of the five senses and feel completely real to the person experiencing them.
            </p>
            <p className="text-lg">
              While often associated with mental health conditions, hallucinations can occur for various reasons 
              including medical conditions, medications, sleep deprivation, or substance use.
            </p>
          </div>
        </div>
      </section>

      {/* Types of Hallucinations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12">Types of Hallucinations</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Auditory</h3>
              <p>Hearing sounds, voices, or music that aren't there. Most common type of hallucination.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Visual</h3>
              <p>Seeing people, objects, lights, or patterns that don't exist in reality.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Tactile</h3>
              <p>Feeling sensations on the skin like crawling, burning, or being touched.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Olfactory</h3>
              <p>Smelling odors that aren't present, often unpleasant or unusual scents.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Gustatory</h3>
              <p>Tasting flavors without eating or drinking anything, often metallic or bitter.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Hypnagogic</h3>
              <p>Occurring while falling asleep or waking up, can affect any sense.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Causes */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12">Common Causes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Mental Health Conditions</h3>
              <ul className="space-y-2">
                <li>• Schizophrenia</li>
                <li>• Bipolar disorder</li>
                <li>• Severe depression</li>
                <li>• Post-traumatic stress disorder</li>
                <li>• Dissociative disorders</li>
              </ul>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Medical Conditions</h3>
              <ul className="space-y-2">
                <li>• Dementia and Alzheimer's</li>
                <li>• Parkinson's disease</li>
                <li>• Brain tumors</li>
                <li>• Epilepsy</li>
                <li>• High fever</li>
              </ul>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Substance-Related</h3>
              <ul className="space-y-2">
                <li>• Alcohol withdrawal</li>
                <li>• Drug intoxication</li>
                <li>• Medication side effects</li>
                <li>• Substance withdrawal</li>
              </ul>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Other Factors</h3>
              <ul className="space-y-2">
                <li>• Severe sleep deprivation</li>
                <li>• Sensory deprivation</li>
                <li>• Extreme stress</li>
                <li>• Migraine headaches</li>
                <li>• Social isolation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Treatment Options */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12">Treatment Options</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Medical Treatment</h3>
              <ul className="space-y-3 text-lg">
                <li>• Antipsychotic medications</li>
                <li>• Treatment of underlying conditions</li>
                <li>• Medication adjustments</li>
                <li>• Regular medical monitoring</li>
              </ul>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Therapeutic Approaches</h3>
              <ul className="space-y-3 text-lg">
                <li>• Cognitive behavioral therapy</li>
                <li>• Reality testing techniques</li>
                <li>• Stress management</li>
                <li>• Family therapy and support</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Coping Strategies</h3>
            <p className="text-lg mb-4">
              Learning to manage hallucinations involves developing practical skills and support systems:
            </p>
            <ul className="grid md:grid-cols-2 gap-4 text-lg">
              <li>• Maintain regular sleep schedule</li>
              <li>• Practice stress reduction techniques</li>
              <li>• Stay connected with support network</li>
              <li>• Follow medication regimens</li>
              <li>• Avoid alcohol and recreational drugs</li>
              <li>• Create safe, structured environment</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Warning Signs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12">When to Seek Help</h2>
          <div className="bg-gray-900 p-6 rounded-lg mb-8">
            <h3 className="text-2xl font-bold mb-4">Seek immediate medical attention if:</h3>
            <ul className="space-y-3 text-lg">
              <li>• Hallucinations are accompanied by thoughts of harm</li>
              <li>• Sudden onset of severe hallucinations</li>
              <li>• Inability to distinguish reality from hallucinations</li>
              <li>• Hallucinations interfere with daily functioning</li>
              <li>• Signs of medical emergency (fever, confusion, seizures)</li>
            </ul>
          </div>
          <button className="bg-yellow-400 text-black px-8 py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
            Find Mental Health Resources
          </button>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12">Support Resources</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Crisis Support</h3>
              <p className="mb-4">24/7 crisis intervention and support services for immediate help.</p>
              <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                Crisis Hotline
              </button>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Professional Help</h3>
              <p className="mb-4">Connect with qualified mental health professionals and specialists.</p>
              <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                Find Therapist
              </button>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Support Groups</h3>
              <p className="mb-4">Join communities of people with shared experiences and recovery.</p>
              <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                Join Groups
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}