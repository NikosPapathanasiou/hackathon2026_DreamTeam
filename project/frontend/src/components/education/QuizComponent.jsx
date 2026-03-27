import { useState } from 'react';
import { CheckCircle, XCircle, Trophy, Sparkles } from 'lucide-react';

const QuizComponent = ({ quiz, lessonTitle, onComplete, badge, points }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswerSelect = (answerIndex) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === quiz[currentQuestion].correctAnswer;

    setShowFeedback(true);
    setAnswers([...answers, { questionId: quiz[currentQuestion].id, correct: isCorrect }]);

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      const finalScore = Math.round((score / quiz.length) * 100);
      setQuizComplete(true);
      if (onComplete) {
        onComplete(finalScore);
      }
    }
  };

  if (quizComplete) {
    const percentage = Math.round((score / quiz.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          {/* Celebration Animation */}
          <div className="relative mb-8">
            <div className="text-9xl mb-4 animate-bounce">
              {passed ? '🎉' : '📚'}
            </div>
            {passed && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />
              </div>
            )}
          </div>

          <h2 className="text-4xl font-bold mb-4">
            {passed ? 'Amazing Job!' : 'Good Try!'}
          </h2>

          <p className="text-xl text-gray-600 mb-8">
            You scored <span className="font-bold text-blue-600">{score}</span> out of{' '}
            <span className="font-bold">{quiz.length}</span> questions!
          </p>

          {/* Score Circle */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke={passed ? '#10b981' : '#f59e0b'}
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-bold">{percentage}%</span>
            </div>
          </div>

          {/* Badge Award */}
          {passed && badge && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-4 border-yellow-300 rounded-2xl p-8 mb-8">
              <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Badge Earned!
              </h3>
              <div className="flex items-center justify-center gap-3">
                <span className="text-5xl">{badge.icon}</span>
                <div className="text-left">
                  <p className="text-xl font-bold" style={{ color: badge.color }}>
                    {badge.name}
                  </p>
                  <p className="text-sm text-gray-600">+{points} points</p>
                </div>
              </div>
            </div>
          )}

          {/* Motivational Message */}
          <p className="text-lg text-gray-700 mb-8">
            {passed
              ? "You're becoming a money master! Keep up the great work!"
              : "That's okay! Try reviewing the lesson again to improve your score."}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            {!passed && (
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transform hover:scale-105 transition-all"
              >
                Try Again
              </button>
            )}
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all"
            >
              {passed ? 'Continue Learning' : 'Back to Lessons'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl p-6 mb-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Quiz Time!</h2>
        <p className="text-purple-100">{lessonTitle}</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-600">
            Question {currentQuestion + 1} of {quiz.length}
          </span>
          <span className="text-sm font-semibold text-green-600">
            Score: {score}/{quiz.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          {question.question}
        </h3>

        {/* Answer Options */}
        <div className="space-y-4">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === question.correctAnswer;

            let buttonClass = 'bg-gray-50 hover:bg-gray-100 border-gray-300';

            if (showFeedback) {
              if (isCorrectAnswer) {
                buttonClass = 'bg-green-100 border-green-500';
              } else if (isSelected && !isCorrect) {
                buttonClass = 'bg-red-100 border-red-500';
              }
            } else if (isSelected) {
              buttonClass = 'bg-blue-100 border-blue-500';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
                className={`w-full text-left p-6 rounded-xl border-2 font-semibold text-lg transition-all transform hover:scale-102 ${buttonClass} ${
                  showFeedback ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showFeedback && isCorrectAnswer && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                  {showFeedback && isSelected && !isCorrect && (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showFeedback && (
          <div
            className={`mt-8 p-6 rounded-xl ${
              isCorrect ? 'bg-green-50 border-2 border-green-300' : 'bg-yellow-50 border-2 border-yellow-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">
                {isCorrect ? '✅' : '💡'}
              </div>
              <div>
                <p className="font-bold text-lg mb-2">
                  {isCorrect ? 'Correct!' : 'Not quite!'}
                </p>
                <p className="text-gray-700">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end">
        {!showFeedback ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 ${
              selectedAnswer === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700'
            }`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all"
          >
            {currentQuestion < quiz.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
