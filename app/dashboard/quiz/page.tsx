"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
  Brain, 
  Sparkles, 
  Check, 
  X, 
  RotateCcw,
  ChevronRight,
  Trophy,
  Target,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizState {
  questions: Question[]
  currentIndex: number
  answers: (number | null)[]
  showResults: boolean
}

const sampleQuestions: Question[] = [
  {
    id: "1",
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
    correctAnswer: 1,
    explanation: "Mitochondria are known as the powerhouse of the cell because they generate most of the cell's supply of ATP, used as a source of chemical energy."
  },
  {
    id: "2",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Mars", "Saturn"],
    correctAnswer: 2,
    explanation: "Mars is called the Red Planet because of its reddish appearance, which is caused by iron oxide (rust) on its surface."
  },
  {
    id: "3",
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    explanation: "Au is the chemical symbol for gold, derived from the Latin word 'aurum' meaning gold."
  },
  {
    id: "4",
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: 1,
    explanation: "William Shakespeare wrote Romeo and Juliet, believed to have been written between 1591 and 1596."
  },
  {
    id: "5",
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
    explanation: "The Pacific Ocean is the largest and deepest ocean on Earth, covering more than 60 million square miles."
  }
]

export default function QuizPage() {
  const [topic, setTopic] = useState("")
  const [numQuestions, setNumQuestions] = useState("5")
  const [isGenerating, setIsGenerating] = useState(false)
  const [quiz, setQuiz] = useState<QuizState | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) return
    
    setIsGenerating(true)
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setQuiz({
      questions: sampleQuestions.slice(0, parseInt(numQuestions)),
      currentIndex: 0,
      answers: new Array(parseInt(numQuestions)).fill(null),
      showResults: false
    })
    
    setIsGenerating(false)
  }

  const handleSelectAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return // Already answered
    
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)
    
    if (quiz) {
      const newAnswers = [...quiz.answers]
      newAnswers[quiz.currentIndex] = answerIndex
      setQuiz({ ...quiz, answers: newAnswers })
    }
  }

  const handleNext = () => {
    if (!quiz) return
    
    if (quiz.currentIndex < quiz.questions.length - 1) {
      setQuiz({ ...quiz, currentIndex: quiz.currentIndex + 1 })
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setQuiz({ ...quiz, showResults: true })
    }
  }

  const handleRestart = () => {
    setQuiz(null)
    setTopic("")
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  const getScore = () => {
    if (!quiz) return 0
    return quiz.answers.filter((answer, index) => 
      answer === quiz.questions[index].correctAnswer
    ).length
  }

  const currentQuestion = quiz?.questions[quiz.currentIndex]

  return (
    <div className="max-w-4xl mx-auto">
      {!quiz ? (
        /* Quiz Setup */
        <div className="bg-card rounded-xl border border-border p-8">
          <div className="text-center mb-8">
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Brain className="size-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">AI Quiz Generator</h1>
            <p className="text-muted-foreground">
              Enter a topic and let AI generate practice questions for you
            </p>
          </div>

          <div className="space-y-6 max-w-md mx-auto">
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic or Subject</label>
              <Textarea
                placeholder="e.g., World War II, Photosynthesis, Shakespeare's plays..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Questions</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              className="w-full" 
              size="lg"
              disabled={!topic.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="size-4 mr-2 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-2" />
                  Generate Quiz
                </>
              )}
            </Button>
          </div>

          {/* Sample Topics */}
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Try these topics:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Biology Basics", "World History", "Chemistry Elements", "Literature Classics", "Physics Fundamentals"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className="px-3 py-1.5 text-sm rounded-full border border-border hover:bg-muted transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : quiz.showResults ? (
        /* Results */
        <div className="bg-card rounded-xl border border-border p-8">
          <div className="text-center mb-8">
            <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Trophy className="size-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Quiz Complete!</h1>
            <p className="text-muted-foreground">
              Here&apos;s how you did
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <Target className="size-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{getScore()}/{quiz.questions.length}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <Trophy className="size-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{Math.round((getScore() / quiz.questions.length) * 100)}%</p>
              <p className="text-sm text-muted-foreground">Score</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <Clock className="size-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{quiz.questions.length}</p>
              <p className="text-sm text-muted-foreground">Questions</p>
            </div>
          </div>

          {/* Question Review */}
          <div className="space-y-4 mb-8">
            <h3 className="font-semibold">Review Answers</h3>
            {quiz.questions.map((q, index) => {
              const userAnswer = quiz.answers[index]
              const isCorrect = userAnswer === q.correctAnswer
              return (
                <div key={q.id} className="p-4 rounded-lg border border-border">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                      isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    )}>
                      {isCorrect ? <Check className="size-4" /> : <X className="size-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-1">{q.question}</p>
                      <p className="text-sm text-muted-foreground">
                        Your answer: <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                          {userAnswer !== null ? q.options[userAnswer] : "Not answered"}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600">
                          Correct: {q.options[q.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <Button onClick={handleRestart} className="w-full" size="lg">
            <RotateCcw className="size-4 mr-2" />
            Start New Quiz
          </Button>
        </div>
      ) : currentQuestion && (
        /* Quiz Question */
        <div className="bg-card rounded-xl border border-border p-8">
          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-muted-foreground">
              Question {quiz.currentIndex + 1} of {quiz.questions.length}
            </span>
            <div className="flex gap-1">
              {quiz.questions.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "size-2 rounded-full",
                    index < quiz.currentIndex 
                      ? "bg-primary" 
                      : index === quiz.currentIndex 
                        ? "bg-primary/50" 
                        : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Question */}
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentQuestion.correctAnswer
              const showCorrectness = showExplanation

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showExplanation}
                  className={cn(
                    "w-full p-4 text-left rounded-lg border-2 transition-all",
                    showCorrectness && isCorrect
                      ? "border-green-500 bg-green-50"
                      : showCorrectness && isSelected && !isCorrect
                        ? "border-red-500 bg-red-50"
                        : isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "size-8 rounded-full flex items-center justify-center text-sm font-medium",
                      showCorrectness && isCorrect
                        ? "bg-green-500 text-white"
                        : showCorrectness && isSelected && !isCorrect
                          ? "bg-red-500 text-white"
                          : isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                    )}>
                      {showCorrectness && isCorrect ? (
                        <Check className="size-4" />
                      ) : showCorrectness && isSelected && !isCorrect ? (
                        <X className="size-4" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="p-4 rounded-lg bg-muted/50 border border-border mb-6">
              <p className="text-sm font-medium mb-1">Explanation</p>
              <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <Button onClick={handleNext} className="w-full" size="lg">
              {quiz.currentIndex < quiz.questions.length - 1 ? (
                <>
                  Next Question
                  <ChevronRight className="size-4 ml-2" />
                </>
              ) : (
                <>
                  See Results
                  <Trophy className="size-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
