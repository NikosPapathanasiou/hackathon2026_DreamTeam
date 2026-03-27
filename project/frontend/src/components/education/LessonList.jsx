import { useState } from 'react';
import { BookOpen, Clock, Award, ChevronRight, Search } from 'lucide-react';
import lessonsData from '../../data/lessons.json';
import LessonViewer from './LessonViewer';

const LessonList = ({ childId, onLessonComplete }) => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLessons = lessonsData.lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLessonComplete = (lessonId, score) => {
    if (onLessonComplete) {
      onLessonComplete(lessonId, score);
    }
    // Return to lesson list after completion
    setTimeout(() => {
      setSelectedLesson(null);
    }, 3000);
  };

  if (selectedLesson) {
    return (
      <div>
        <button
          onClick={() => setSelectedLesson(null)}
          className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
        >
          ← Back to Lessons
        </button>
        <LessonViewer
          lesson={selectedLesson}
          childId={childId}
          onComplete={handleLessonComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <BookOpen className="w-12 h-12" />
          <div>
            <h2 className="text-4xl font-bold">Learning Center</h2>
            <p className="text-blue-100 mt-2">Choose a lesson to start learning!</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search lessons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
        />
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => setSelectedLesson(lesson)}
            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
          >
            {/* Lesson Header */}
            <div className={`bg-gradient-to-r ${getLevelColor(lesson.level)} text-white p-6`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-5xl">{lesson.badge.icon}</span>
                <div className="bg-white/20 rounded-full px-3 py-1 text-sm font-bold">
                  Level {lesson.level}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">{lesson.title}</h3>
              <p className="text-sm opacity-90">{lesson.description}</p>
            </div>

            {/* Lesson Info */}
            <div className="p-6">
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">{lesson.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">{lesson.points} points</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold">{lesson.quiz.length} quiz questions</span>
                </div>
              </div>

              {/* Age Group */}
              <div className="bg-gray-100 rounded-lg p-3 mb-4">
                <div className="text-sm text-gray-600">Recommended Age</div>
                <div className="font-bold text-gray-800">{lesson.ageGroup} years</div>
              </div>

              {/* Start Button */}
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 group">
                Start Learning
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No lessons found matching "{searchTerm}"</p>
        </div>
      )}

      {/* Learning Tips */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          Learning Tips
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Read each slide carefully before moving to the next one</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Take your time with the quiz - there's no rush!</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Score 70% or higher to earn badges and points</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>You can retake lessons to improve your score</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

// Helper function to get level colors
const getLevelColor = (level) => {
  const colors = {
    1: 'from-green-400 to-green-600',
    2: 'from-blue-400 to-blue-600',
    3: 'from-purple-400 to-purple-600',
    4: 'from-yellow-400 to-yellow-600',
    5: 'from-orange-400 to-orange-600',
  };
  return colors[level] || 'from-gray-400 to-gray-600';
};

export default LessonList;
