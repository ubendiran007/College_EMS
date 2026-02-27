import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../frontend/shared/context/AuthContext';
import ProtectedRoute from '../frontend/shared/components/ProtectedRoute';
import Navbar from '../frontend/shared/components/Navbar';
import LoginPage from '../frontend/shared/pages/LoginPage';
import RegisterPage from '../frontend/shared/pages/RegisterPage';
import EventListPage from '../frontend/home/pages/EventListPage';
import EventPostPage from '../frontend/home/pages/EventPostPage';
import IQACPage from '../frontend/iqac/pages/IQACPage';
import './index.css';

function App() {  
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/*" element={
              <ProtectedRoute>
                <Navbar />
                <Routes>
                  <Route path="/" element={<EventListPage />} />
                  <Route path="/events" element={<EventListPage />} />
                  <Route path="/event/:id" element={<EventPostPage />} />
                  <Route path="/iqac" element={<IQACPage />} />
                </Routes>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
