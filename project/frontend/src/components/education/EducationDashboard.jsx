import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, Award, TrendingUp, Target } from 'lucide-react';
import LessonList from './LessonList';
import ProgressTracker from './ProgressTracker';
import BadgeSystem from './BadgeSystem';
import LevelIndicator from './LevelIndicator';
import api from '../../services/api';

const EducationDashboard = () => {
  const { childId } = useParams();
  const [childName, setChildName] = useState('');

  useEffect(() => {
    fetchChildData();
  }, [childId]);

  const fetchChildData = async () => {
    try {
      const response = await api.get(`/children/${childId}`);
      setChildName(response.data.child.name);
    } catch (error) {
      console.error('Failed to fetch child data:', error);
    }
  };
  const [activeTab, setActiveTab] = useState('lessons');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLessonComplete = async (lessonId, score) => {
    try {
      // Record progress to backend
      await api.post('/education/progress', {
        childId,
        lessonId,
        lessonTitle: `Lesson ${lessonId}`,
        completed: true,
        score,
      });

      // Refresh all components
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to record progress:', error);
    }
  };

  const tabs = [
    { id: 'lessons', name: 'Learn', icon: BookOpen, color: 'blue' },
    { id: 'progress', name: 'Progress', icon: TrendingUp, color: 'green' },
    { id: 'badges', name: 'Badges', icon: Award, color: 'yellow' },
    { id: 'level', name: 'Level', icon: Target, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {childName ? `${childName}'s Learning Journey` : 'Learning Journey'}
          </h1>
          <p className="text-gray-600 text-lg">
            Master money skills through fun lessons and games!
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                    isActive
                      ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg`
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={
                    isActive
                      ? {
                          background: getGradientColor(tab.color),
                        }
                      : {}
                  }
                >
                  <Icon className="w-6 h-6" />
                  <span className="hidden md:inline">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">
          {activeTab === 'lessons' && (
            <LessonList childId={childId} onLessonComplete={handleLessonComplete} />
          )}

          {activeTab === 'progress' && (
            <ProgressTracker childId={childId} key={`progress-${refreshKey}`} />
          )}

          {activeTab === 'badges' && (
            <BadgeSystem childId={childId} key={`badges-${refreshKey}`} />
          )}

          {activeTab === 'level' && (
            <LevelIndicator childId={childId} key={`level-${refreshKey}`} />
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to get gradient colors
const getGradientColor = (color) => {
  const gradients = {
    blue: 'linear-gradient(to right, #3b82f6, #2563eb)',
    green: 'linear-gradient(to right, #10b981, #059669)',
    yellow: 'linear-gradient(to right, #f59e0b, #d97706)',
    purple: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
  };
  return gradients[color] || gradients.blue;
};

// Add fadeIn animation to your global CSS or component
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
`;
if (!document.getElementById('education-animations')) {
  style.id = 'education-animations';
  document.head.appendChild(style);
}

export default EducationDashboard;
