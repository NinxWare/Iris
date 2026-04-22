import { Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { useAuth } from './contexts/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { ModelDetailPage } from './pages/ModelDetailPage';
import { NewModelPage } from './pages/NewModelPage';
import { ProfilePage } from './pages/ProfilePage';
import { TestAIPage } from './pages/TestAIPage';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
};

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/modelos/:id" element={<ModelDetailPage />} />
        <Route path="/testar-ia" element={<TestAIPage />} />
        <Route path="/novo-modelo" element={<PrivateRoute><NewModelPage /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      </Routes>
    </>
  );
}
