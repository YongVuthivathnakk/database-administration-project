import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import UserForm from '../tempfiles/UserForm';
import UserCreatePage from './components/UserCreatePage';
import UserEditPage from '../tempfiles/UserEditPage';
import BeekeeperList from './components/BeekeeperList';
import BeekeeperForm from './components/BeekeeperForm';
import BeekeeperHivesPage from './components/BeekeeperHivesPage';
import BeeSpeciesPage from './components/BeeSpeciesPage';
import EnvironmentPage from './components/EnvironmentPage';
import HoneyProductionPage from './components/HoneyProductionPage';
import PlantsPage from './components/PlantsPage';
import LocationPage from './components/LocationPage';
import BeekeeperEditPage from './components/BeekeeperEditPage';
import BeekeeperCreatePage from './components/BeekeeperCreatePage';
import BackupDashboard from './components/BackupDashboard';
import UserList from './components/UserList';

// Protected Route Component
// const ProtectedRoute = ({ children, isAuthenticated }) => {
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };

// Navigation Component
const Navigation = () => {
  const [isRoute, setIsRoute] = useState(false)
  return (
    <nav>
      {/* <div className="nav-item active">Smart Beekeeper</div> */}
      {/* <div className="nav-item" onClick={() => window.location.href = '/users'}>Users</div> */}
      <div className="nav-item" onClick={() => window.location.href = '/beekeepers'}>Beekeepers</div>
      <div className="nav-item" onClick={() => window.location.href = '/species'}>Species</div>
      <div className="nav-item" onClick={() => window.location.href = '/environment'}>Environment</div>
      <div className="nav-item" onClick={() => window.location.href = '/honey'}>Honey</div>
      <div className="nav-item" onClick={() => window.location.href = '/plants'}>Plants</div>
      <div className="nav-item" onClick={() => window.location.href = '/location'}>Location</div>
      <div className="nav-item" onClick={() => window.location.href = '/backup-dashboard'}>Backup</div>
      <div className="nav-item" onClick={() => window.location.href = '/users'}>Users</div>

    </nav>
  );
};

function App() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [user, setUser] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   // Check if user is already logged in
  //   const token = localStorage.getItem('token');
  //   const userData = localStorage.getItem('user');
    
  //   if (token && userData) {
  //     try {
  //       setUser(JSON.parse(userData));
  //       setIsAuthenticated(true);
  //     } catch (error) {
  //       console.error('Error parsing user data:', error);
  //       localStorage.removeItem('token');
  //       localStorage.removeItem('user');
  //     }
  //   }
  //   setIsLoading(false);
  // }, []);

  // const handleLogin = (userData) => {
  //   setUser(userData);
  //   setIsAuthenticated(true);
  // };

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');
  //   setUser(null);
  //   setIsAuthenticated(false);
  // };

  // if (isLoading) {
  //   return (
  //     <div style={{ 
  //       display: 'flex', 
  //       justifyContent: 'center', 
  //       alignItems: 'center', 
  //       height: '100vh',
  //       fontSize: '1.2rem',
  //       color: '#b48a3c'
  //     }}>
  //       Loading Smart Beekeeper Database...
  //     </div>
  //   );
  // }

  return (
    <Router>
      <div className="App">
        <header className='bg-amber-300 rounded-3xl flex justify-center items-center mb-5'>
          <h1>Smart Beekeeper Database</h1>
        </header>
        
        <Navigation />

        {/* {isAuthenticated && <Navigation user={user} onLogout={handleLogout} />} */}

        <div id="root" >
          <Routes>
            {/* Public route - Login */}
            {/* <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/users" replace /> : 
                <LoginForm onLogin={handleLogin} />
              } 
            /> */}

            {/* Protected routes */}
            {/* <Route 
              path="/users" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <UserList />
                </ProtectedRoute>
              } 
            /> */}

            <Route 
              path="/users/create" 
              element={
                  <UserCreatePage />
              } 
            />

            {/* <Route 
              path="/users/edit/:id" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <UserEditPage />
                </ProtectedRoute>
              } 
            /> */}

            <Route 
              path="/beekeepers" 
              element={
                //<ProtectedRoute >
                  <BeekeeperList />
                //</ProtectedRoute>
              }
            />

            <Route 
              path="/beekeepers/create" 
              element={
                //<ProtectedRoute isAuthenticated={isAuthenticated}>
                  <BeekeeperCreatePage />
                //</ProtectedRoute>
              } 
            />

            <Route 
              path="/beekeepers/:id/hives" 
              element={
                // <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <BeekeeperHivesPage />
                //</ProtectedRoute>
              } 
            />

            <Route 
              path="/beekeepers/edit/:id" 
              element={
                //<ProtectedRoute isAuthenticated={isAuthenticated}>
                  <BeekeeperEditPage />
                //</ProtectedRoute>
              } 
            />

            <Route 
              path="/species" 
              element={
                //<ProtectedRoute isAuthenticated={isAuthenticated}>
                  <BeeSpeciesPage />
                //</ProtectedRoute>
              } 
            />

            <Route 
              path="/environment" 
              element={
                //<ProtectedRoute isAuthenticated={isAuthenticated}>
                  <EnvironmentPage />
                //</ProtectedRoute>
              } 
            />

            <Route 
              path="/honey" 
              element={
                //<ProtectedRoute isAuthenticated={isAuthenticated}>
                  <HoneyProductionPage />
                //</ProtectedRoute>
              } 
            />

            <Route 
              path="/plants" 
              element={
                //<ProtectedRoute isAuthenticated={isAuthenticated}>
                  <PlantsPage />
                //</ProtectedRoute>
              } 
            />

            <Route 
              path="/location" 
              element={
                //<ProtectedRoute isAuthenticated={isAuthenticated}>
                  <LocationPage />
                //</ProtectedRoute>
              } 
            />

            <Route
              path="/backup-dashboard"
              element={
                  <BackupDashboard />
              }
            />

            <Route
              path="/users"
              element={
                <UserList />
              }
            
            />

            {/* Default redirect */}
            {/* <Route 
              path="/" 
              element={
                isAuthenticated ? 
                <Navigate to="/users" replace /> : 
                <Navigate to="/login" replace />
              } 
            /> */}

            {/* Catch all other routes */}
            {/* <Route 
              path="*" 
              element={
                isAuthenticated ? 
                <Navigate to="/users" replace /> : 
                <Navigate to="/login" replace />
              } 
            /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 