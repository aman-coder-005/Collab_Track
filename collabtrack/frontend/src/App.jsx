import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage'; // <-- 1. IMPORT THE NEW PAGE
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CreateProjectPage from './pages/CreateProjectPage';
import ProjectDashboardPage from './pages/ProjectDashboardPage'; 
// Optional: You should also have a PrivateRoute component
// import PrivateRoute from './components/PrivateRoute'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
        <Route path="/signup" element={<MainLayout><SignUpPage /></MainLayout>} />

        {/* --- 2. UPDATED PROFILE ROUTES --- */}

        {/* This route is for "My Profile" (when logged in) */}
        <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />

        {/* This route is for viewing *other* users' profiles (e.g., applicants) */}
        <Route path="/profile/:userId" element={<MainLayout><ProfilePage /></MainLayout>} />

        {/* This is the MISSING route for the edit page */}
        <Route 
          path="/profile/edit" 
          element={
            // You should wrap this in a PrivateRoute
            // <PrivateRoute> 
              <MainLayout><EditProfilePage /></MainLayout>
            // </PrivateRoute>
          } 
        />
        {/* --- END OF FIX --- */}

        {/* Project Routes */}
        <Route path="/projects" element={<MainLayout><ProjectListPage /></MainLayout>} />
        <Route path="/projects/:projectId" element={<MainLayout><ProjectDetailPage /></MainLayout>} />
        <Route path="/create-project" element={
            // <PrivateRoute>
              <MainLayout><CreateProjectPage /></MainLayout>
            // </PrivateRoute>
          } 
        />
        <Route path="/projects/:projectId/dashboard" element={
            // <PrivateRoute>
              <MainLayout><ProjectDashboardPage /></MainLayout>
            // </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;