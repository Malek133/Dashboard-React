
import { AuthProvider } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <LoginPage />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;