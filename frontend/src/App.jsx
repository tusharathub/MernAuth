import FloatingThing from './components/FloatingThing'
import {Navigate, Route, Routes} from "react-router-dom";
import SignupPage from './pages/SignupPage';
import LogInPage from './pages/LogInPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';
import LoadingSpinner from './components/LoadingSpinner';

//routes to require authentication
const ProtectedRoutes = ({ children}) => {
  const { isAuthenticated, user} = useAuthStore();

  if(!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if(!user) {
    return <Navigate to="/login" replace/>
  }
  
  if(!user.isVerified) {
    return <Navigate to="/verify-email" replace/>
  }

  return children;
}

//redirect authenticated users to homepage
const RedirectAuthenticatedUser = ({children}) => {
  const {isAuthenticated, user} = useAuthStore();

  if(!isAuthenticated && user && user.isVerified) {
    return <Navigate to="/" replace />
  }
  return children;
}

function App() {
  const {isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  if(isCheckingAuth) return <LoadingSpinner/>
  
  console.log("isAuthenticated", isAuthenticated);
  console.log("user", user);
  return (
  <div className='min-h-screen bg-gradient-to-br from-gray-600 via-blue-900 to-purple-600 flex items-center justify-center relative overflow-hidden'>
    <FloatingThing color='bg-red-500' size="w-64 h-64" top="-5%" left="10%" delay={0} />
    <FloatingThing color='bg-red-500' size="w-64 h-64" top="35%" left="15%" delay={0} />
    <FloatingThing color='bg-green-900' size="w-64 h-64" top="51%" left="65%" delay={0} />

    <Routes>

      <Route path="/" element={
        <ProtectedRoutes>
          <DashboardPage/>
        </ProtectedRoutes>
      } />
      <Route path="/signup" element={
        <RedirectAuthenticatedUser>
          <SignupPage/>
      </RedirectAuthenticatedUser>
    } />
      <Route path="/login" element={
        <RedirectAuthenticatedUser>
          <LogInPage/>
      </RedirectAuthenticatedUser>
    } />
      <Route path="/verify-email" element={<EmailVerificationPage />} />
    </Routes>
    <Toaster/>
  </div>  
  )
}

export default App
