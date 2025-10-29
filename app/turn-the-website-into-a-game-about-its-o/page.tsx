'use client'

import { useState, useEffect } from 'react'

export default function Page() {
  const [currentSection, setCurrentSection] = useState(0)
  const [score, setScore] = useState(0)
  const [completedSections, setCompletedSections] = useState<boolean[]>([false, false, false, false])
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [gameProgress, setGameProgress] = useState(0)

  const sections = [
    {
      title: 'About',
      content: 'We are a cutting-edge technology company specializing in AI-driven solutions for modern businesses. Our team of experts combines decades of experience with innovative approaches to solve complex challenges.',
      quiz: [
        {
          question: 'What does our company specialize in?',
          options: ['Web Design', 'AI-driven Solutions', 'Marketing', 'Hardware'],
          correct: 1
        },
        {
          question: 'What drives our approach?',
          options: ['Cost Reduction', 'Innovation', 'Speed', 'Simplicity'],
          correct: 1
        }
      ]
    },
    {
      title: 'Services',
      content: 'Our comprehensive service portfolio includes Machine Learning Consulting, Custom AI Development, Data Analytics, and Digital Transformation strategies. We work with Fortune 500 companies and startups alike.',
      quiz: [
        {
          question: 'Which service do we NOT offer?',
          options: ['Machine Learning Consulting', 'Custom AI Development', 'Physical Hardware Repair', 'Data Analytics'],
          correct: 2
        },
        {
          question: 'What types of companies do we work with?',
          options: ['Only Startups', 'Only Fortune 500', 'Both Fortune 500 and Startups', 'Only Mid-size'],
          correct: 2
        }
      ]
    },
    {
      title: 'Blog',
      content: 'Stay updated with our latest insights on artificial intelligence trends, case studies from successful implementations, and thought leadership articles on the future of technology in business.',
      quiz: [
        {
          question: 'What type of content do we publish?',
          options: ['Product Reviews', 'AI Trends & Case Studies', 'Personal Stories', 'News Updates'],
          correct: 1
        },
        {
          question: 'Our articles focus on which area?',
          options: ['Entertainment', 'Technology in Business', 'Sports', 'Travel'],
          correct: 1
        }
      ]
    },
    {
      title: 'Contact',
      content: 'Ready to transform your business with AI? Get in touch with our team for a free consultation. We offer 24/7 support and have offices in New York, London, and Singapore.',
      quiz: [
        {
          question: 'What do we offer for first-time clients?',
          options: ['Free Software', 'Free Consultation', 'Free Training', 'Free Hardware'],
          correct: 1
        },
        {
          question: 'How many office locations do we have?',
          options: ['2', '3', '4', '5'],
          correct: 1
        }
      ]
    }
  ]

  const handleStartQuiz = () => {
    setShowQuiz(true)
    setCurrentQuestion(0)
    setAnswers([])
  }

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex.toString()]
    setAnswers(newAnswers)

    if (currentQuestion < sections[currentSection].quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate score for this section
      let sectionScore = 0
      sections[currentSection].quiz.forEach((q, index) => {
        if (parseInt(newAnswers[index]) === q.correct) {
          sectionScore += 10
        }
      })
      
      setScore(score + sectionScore)
      
      // Mark section as completed
      const newCompleted = [...completedSections]
      newCompleted[currentSection] = true
      setCompletedSections(newCompleted)
      
      setShowQuiz(false)
      
      // Check if all sections completed
      if (newCompleted.every(completed => completed)) {
        setShowResult(true)
      } else {
        // Move to next section
        setCurrentSection(currentSection + 1)
      }
    }
  }

  useEffect(() => {
    const progress = (completedSections.filter(Boolean).length / sections.length) * 100
    setGameProgress(progress)
  }, [completedSections])

  const getRecommendation = () => {
    if (score >= 70) return "AI Strategy Consultant - You've mastered our content! You'd be perfect for our advanced AI implementation services."
    if (score >= 50) return "Digital Transformation Candidate - Great knowledge! Our digital transformation services would suit your learning style."
    if (score >= 30) return "AI Beginner - Good start! Our foundational AI consulting would be ideal for your current level."
    return "Technology Explorer - Every expert was once a beginner! Our basic consultation services are perfect for you."
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-900 rounded-lg p-8 mb-8">
            <h1 className="text-4xl font-bold mb-6 text-yellow-400">🎉 Game Complete! 🎉</h1>
            <div className="text-6xl font-bold mb-4">{score}/80</div>
            <div className="text-xl mb-8">Final Score</div>
            
            <div className="bg-black rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">Your Personalized Recommendation:</h2>
              <p className="text-lg leading-relaxed">{getRecommendation()}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {sections.map((section, index) => (
                <div key={section.title} className="bg-green-900 rounded-lg p-4">
                  <div className="text-2xl mb-2">✅</div>
                  <div className="font-semibold">{section.title}</div>
                  <div className="text-sm text-gray-300">Completed</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setCurrentSection(0)
                setScore(0)
                setCompletedSections([false, false, false, false])
                setShowResult(false)
                setGameProgress(0)
              }}
              className="bg-yellow-500 text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors mr-4"
            >
              Play Again
            </button>
            
            <button
              onClick={() => navigator.share && navigator.share({
                title: 'I completed the Content Explorer Game!',
                text: `I scored ${score}/80 and got: ${getRecommendation()}`,
                url: window.location.href
              })}
              className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-600 transition-colors"
            >
              Share Result
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Progress Bar */}
      <div className="bg-gray-900 p-4 border-b border-gray-700">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-xl font-bold">Score: {score}</div>
            <div className="text-lg">Level: {completedSections.filter(Boolean).length + 1}/4</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">Progress</div>
            <div className="w-48 bg-gray-700 rounded-full h-3">
              <div 
                className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${gameProgress}%` }}
              ></div>
            </div>
            <div className="text-sm">{Math.round(gameProgress)}%</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        {!showQuiz ? (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Content Explorer Game</h1>
              <p className="text-xl text-gray-300">Journey through our website content to unlock your personalized recommendation!</p>
            </div>

            {/* Section Navigation */}
            <div className="flex justify-center mb-8 space-x-4">
              {sections.map((section, index) => (
                <div
                  key={section.title}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    completedSections[index] 
                      ? 'bg-green-800 text-white' 
                      : index === currentSection 
                        ? 'bg-yellow-500 text-black' 
                        : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {completedSections[index] && '✅ '}{section.title}
                </div>
              ))}
            </div>

            {/* Current Section Content Card */}
            <div className="bg-gray-900 rounded-lg p-8 hover:bg-gray-800 transition-colors border-2 border-yellow-500 transform hover:scale-105 duration-300">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-yellow-400">{sections[currentSection].title}</h2>
                  <div className="inline-block bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                    Section {currentSection + 1} of {sections.length}
                  </div>
                </div>
                <div className="text-4xl">
                  {currentSection === 0 && '👥'}
                  {currentSection === 1 && '🚀'}
                  {currentSection === 2 && '📚'}
                  {currentSection === 3 && '📞'}
                </div>
              </div>
              
              <p className="text-lg leading-relaxed mb-8 text-gray-100">
                {sections[currentSection].content}
              </p>
              
              <div className="text-center">
                <button
                  onClick={handleStartQuiz}
                  className="bg-yellow-500 text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors transform hover:scale-105"
                >
                  Start {sections[currentSection].title} Challenge
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-yellow-400">{sections[currentSection].title} Challenge</h2>
                <div className="text-sm text-gray-400 mt-2">
                  Question {currentQuestion + 1} of {sections[currentSection].quiz.length}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-6">
                  {sections[currentSection].quiz[currentQuestion].question}
                </h3>
                
                <div className="space-y-4">
                  {sections[currentSection].quiz[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className="w-full bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left transition-colors border-2 border-transparent hover:border-yellow-500"
                    >
                      <span className="font-semibold text-yellow-400 mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}