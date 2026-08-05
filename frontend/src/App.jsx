import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OTPVerificationPage from './pages/OTPVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import ProfilePage from './pages/ProfilePage';

// Dashboards
import JobSeekerDashboard from './pages/Dashboard/JobSeekerDashboard';
import RecruiterDashboard from './pages/Dashboard/RecruiterDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'dark:bg-slate-900 dark:text-white border dark:border-slate-800 text-sm font-semibold rounded-2xl shadow-lg',
                duration: 4000,
              }}
            />

            {/* Navigation Header */}
            <Navbar />

            {/* Main Content Viewport */}
            <main className="flex-1 w-full">
              <Routes>
                {/* Public Route mappings */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-otp" element={<OTPVerificationPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/:id" element={<JobDetailsPage />} />

                {/* Common Protected Route mappings */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Role Specific Protected Route mappings */}
                <Route
                  path="/dashboard/seeker"
                  element={
                    <ProtectedRoute allowedRoles={['seeker']}>
                      <JobSeekerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/recruiter"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter']}>
                      <RecruiterDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback route */}
                <Route path="*" element={<LandingPage />} />
              </Routes>
            </main>

            {/* Footer links */}
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
