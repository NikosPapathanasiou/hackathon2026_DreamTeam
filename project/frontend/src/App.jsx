/**
 * Main App Component
 * Person 2: Frontend Developer
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Parent Components
import ParentDashboard from './components/parent/ParentDashboard';

// Child Components
import ChildDashboard from './components/child/ChildDashboard';

// Education Components
import EducationDashboard from './components/education/EducationDashboard';

// Shared Components
import Navigation from './components/shared/Navigation';
import ProtectedRoute from './components/shared/ProtectedRoute';

function App() {
  const { isAuthenticated, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Navigation />
                <ParentDashboard />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/child/:childId"
          element={
            <ProtectedRoute>
              <>
                <Navigation />
                <ChildDashboard />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/child/:childId/education"
          element={
            <ProtectedRoute>
              <>
                <Navigation />
                <EducationDashboard />
              </>
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
