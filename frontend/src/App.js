import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import Groups from './pages/Groups';
import Sessions from './pages/Sessions';
import Memberships from './pages/Memberships';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import './styles/global.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const location = useLocation();
  const hideNavigation = ['/login', '/register'].includes(location.pathname);
  
  return (
    <>
      {!hideNavigation && <Navigation />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/groups" element={
          <PrivateRoute>
            <Groups />
          </PrivateRoute>
        } />
        <Route path="/sessions" element={
          <PrivateRoute>
            <Sessions />
          </PrivateRoute>
        } />
        <Route path="/memberships" element={
          <PrivateRoute>
            <Memberships />
          </PrivateRoute>
        } />
        <Route path="/messages" element={
          <PrivateRoute>
            <Messages />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />

        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
