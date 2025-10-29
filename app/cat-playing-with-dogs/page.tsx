'use client'

import { useState } from 'react'

interface FAQ {
  question: string
  answer: string
  isOpen: boolean
}

export default function Page() {
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      question: "What are the best ways to introduce a cat to a household with multiple dogs?",
      answer: "Start with gradual introductions by keeping the cat in a separate room initially. Allow the pets to smell each other under doors and through baby gates. Use positive reinforcement with treats and praise. Always supervise initial face-to-face meetings and ensure the cat has escape routes and high perches. Take the process slowly over several days or weeks.",
      isOpen: false
    },
    {
      question: "How can you tell if a cat and dog are playing together safely versus fighting?",
      answer: "Safe play includes relaxed body language, play bows from dogs, gentle pouncing, and breaks in activity. Fighting involves hissing, growling, arched backs, flattened ears, or aggressive chasing without breaks. The cat should have an easy escape route and both animals should appear relaxed between play sessions.",
      isOpen: false
    },
    {
      question: "What types of toys work well for interactive play between cats and dogs?",
      answer: "Feather wands that both can chase, large balls they can bat around together, interactive puzzle toys, and rope toys work well. Avoid small toys that could be swallowed. Laser pointers can engage both species, but always end sessions with a physical toy they can 'catch'. Rotating toys keeps them interesting.",
      isOpen: false
    },
    {
      question: "What should you do if your cat becomes overstimulated while playing with dogs?",
      answer: "Immediately create space between the animals by calmly calling the dogs away or redirecting them. Provide the cat with a quiet, elevated space to retreat. Look for signs like excessive panting, hiding, or aggressive behavior. Allow a cooling-off period before any further interaction and consider shorter play sessions in the future.",
      isOpen: false
    }
  ])

  const [playTips] = useState<string[]>([
    "Always supervise play sessions between cats and dogs",
    "Ensure your cat has escape routes and high perches",
    "Start with short play sessions and gradually increase duration",
    "Use positive reinforcement to encourage gentle behavior",
    "Provide separate feeding areas to avoid resource guarding"
  ])

  const toggleFAQ = (index: number) => {
    setFaqs(prev => prev.map((faq, i) => 
      i === index ? { ...faq, isOpen: !faq.isOpen } : faq
    ))
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            🐱 Cat Playing with Dogs 🐕
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Everything you need to know about multi-pet harmony and safe play
          </p>
          <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
            Start Your Pet Journey
          </button>
        </header>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Quick Play Tips</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {playTips.map((tip, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg border-l-4 border-yellow-500">
                <p className="text-lg">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left hover:bg-gray-700 transition-colors flex justify-between items-center"
                >
                  <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                  <span className="text-yellow-500 text-2xl">
                    {faq.isOpen ? '−' : '+'}
                  </span>
                </button>
                {faq.isOpen && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="text-center bg-gray-900 p-12 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Help Your Pets Play Together?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Get expert guidance on creating a harmonious multi-pet household
          </p>
          <div className="space-x-4">
            <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
              Get Pet Training Tips
            </button>
            <button className="border-2 border-yellow-500 text-yellow-500 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 hover:text-black transition-colors">
              Contact Expert
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}