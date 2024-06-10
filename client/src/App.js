import { AuthProvider } from './context/AuthContext';
import AppRoutes from './components/AppRoutes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
