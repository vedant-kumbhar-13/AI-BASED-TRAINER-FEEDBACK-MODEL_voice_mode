import { useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navigation } from '../components/dashboard/Navigation';
import { QuestionCard, QuizProgress, QuizTimer } from '../components/quiz';
import { getTopicById, getQuestionsByTopicId, saveProgress } from '../data/aptitudeData';

export const Quiz = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  
  const topic = topicId ? getTopicById(parseInt(topicId)) : null;
  const questions = topicId ? getQuestionsByTopicId(parseInt(topicId)) : [];
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsTimerRunning(false);

    // Calculate score
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    
    // Save progress
    if (topicId) {
      saveProgress(parseInt(topicId), score);
    }

    // Navigate to results with state
    navigate(`/quiz-results/${topicId}`, {
      state: {
        answers,
        score,
        correctCount,
        totalQuestions: questions.length
      }
    });
  }, [answers, questions, topicId, navigate, isSubmitting]);

  const handleTimeUp = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  if (!topic || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-16 flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <span className="text-6xl mb-4 block">❌</span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Topic Not Found</h2>
            <p className="text-gray-500 mb-6">The requested topic or quiz doesn't exist.</p>
            <Link
              to="/learning"
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition"
            >
              Back to Learning
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{topic.icon}</span>
                <div>
                  <h1 className="text-lg font-bold text-gray-800">{topic.name} Quiz</h1>
                  <p className="text-xs text-gray-500">{questions.length} questions • 5 minutes</p>
                </div>
              </div>
              <Link
                to={`/learning/${topicId}`}
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                ← Back to Topic
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Quiz Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Question Card */}
              <QuestionCard
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                selectedAnswer={answers[currentQuestion.id] || null}
                onAnswerSelect={handleAnswerSelect}
              />

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`px-6 py-3 rounded-lg font-bold text-sm transition ${
                    currentQuestionIndex === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                  }`}
                >
                  ← Previous
                </button>

                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={answeredCount < questions.length}
                    className={`px-8 py-3 rounded-lg font-bold text-sm transition ${
                      answeredCount < questions.length
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary-dark text-white shadow-button'
                    }`}
                  >
                    Submit Quiz ✓
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-lg transition"
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Timer */}
              <QuizTimer
                totalSeconds={300} // 5 minutes
                onTimeUp={handleTimeUp}
                isRunning={isTimerRunning}
              />

              {/* Progress */}
              <QuizProgress
                current={currentQuestionIndex + 1}
                total={questions.length}
                answeredCount={answeredCount}
              />

              {/* Quick Submit */}
              {answeredCount === questions.length && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-sm font-bold text-green-700 mb-2">🎉 All questions answered!</p>
                  <button
                    onClick={handleSubmit}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-lg transition"
                  >
                    Submit Quiz
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
