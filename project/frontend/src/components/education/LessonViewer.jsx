import { useState } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, Award, Clock } from 'lucide-react';
import QuizComponent from './QuizComponent';

const LessonViewer = ({ lesson, onComplete, childId }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const totalSlides = lesson.content.length;

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleQuizComplete = (score) => {
    setQuizCompleted(true);
    if (onComplete) {
      onComplete(lesson.id, score);
    }
  };

  const renderContent = (content) => {
    switch (content.type) {
      case 'intro':
        return (
          <div className="text-center">
            <div className="text-6xl mb-6">👋</div>
            <p className="text-xl text-gray-700 leading-relaxed">{content.text}</p>
          </div>
        );

      case 'fact':
        return (
          <div className="bg-yellow-50 border-4 border-yellow-300 rounded-2xl p-8">
            <div className="text-5xl mb-4 text-center">💡</div>
            <h3 className="text-2xl font-bold text-yellow-800 mb-4 text-center">
              {content.title}
            </h3>
            <p className="text-lg text-yellow-900">{content.text}</p>
          </div>
        );

      case 'concept':
        return (
          <div>
            <h3 className="text-2xl font-bold text-blue-600 mb-6 text-center">
              {content.title}
            </h3>
            <ul className="space-y-4">
              {content.points.map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-start bg-blue-50 p-4 rounded-xl transform transition-transform hover:scale-105"
                >
                  <span className="text-2xl mr-4">✓</span>
                  <span className="text-lg text-gray-800">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'example':
        return (
          <div className="bg-green-50 border-4 border-green-300 rounded-2xl p-8">
            <div className="text-5xl mb-4 text-center">🌟</div>
            <h3 className="text-2xl font-bold text-green-800 mb-4 text-center">
              {content.title}
            </h3>
            <p className="text-lg text-green-900">{content.text}</p>
          </div>
        );

      case 'activity':
        return (
          <div className="bg-purple-50 border-4 border-purple-300 rounded-2xl p-8">
            <div className="text-5xl mb-4 text-center">🎮</div>
            <h3 className="text-2xl font-bold text-purple-800 mb-4 text-center">
              {content.title}
            </h3>
            <p className="text-lg text-purple-900 whitespace-pre-line">{content.text}</p>
          </div>
        );

      default:
        return <p className="text-lg text-gray-700">{content.text}</p>;
    }
  };

  if (showQuiz) {
    return (
      <QuizComponent
        quiz={lesson.quiz}
        lessonTitle={lesson.title}
        onComplete={handleQuizComplete}
        badge={lesson.badge}
        points={lesson.points}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold">{lesson.title}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-semibold">{lesson.duration}</span>
            </div>
            <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
              <Award className="w-5 h-5 mr-2" />
              <span className="font-semibold">{lesson.points} pts</span>
            </div>
          </div>
        </div>
        <p className="text-blue-100">{lesson.description}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-600">
            Slide {currentSlide + 1} of {totalSlides}
          </span>
          <span className="text-sm font-semibold text-gray-600">
            {Math.round(((currentSlide + 1) / totalSlides) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-xl p-12 mb-8 min-h-[400px] flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {renderContent(lesson.content[currentSlide])}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            currentSlide === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 transform hover:scale-105'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <div className="flex gap-2">
          {lesson.content.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentSlide
                  ? 'bg-blue-500 w-8'
                  : idx < currentSlide
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all"
        >
          {currentSlide === totalSlides - 1 ? (
            <>
              Take Quiz
              <BookOpen className="w-5 h-5" />
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LessonViewer;
