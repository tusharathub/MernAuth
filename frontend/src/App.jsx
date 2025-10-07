import FloatingThing from './components/FloatingThing'
import {Route, Routes} from "react-router-dom";
import SignupPage from './pages/SignupPage';
import LogInPage from './pages/LogInPage';

function App() {
  return (
  <div className='min-h-screen bg-gradient-to-br from-gray-600 via-blue-900 to-purple-600 flex items-center justify-center relative overflow-hidden'>
    <FloatingThing color='bg-red-500' size="w-64 h-64" top="-5%" left="10%" delay={0} />
    <FloatingThing color='bg-red-500' size="w-64 h-64" top="35%" left="15%" delay={0} />
    <FloatingThing color='bg-green-900' size="w-64 h-64" top="51%" left="65%" delay={0} />

    <Routes>

      <Route path="/" element={"Home"} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LogInPage />} />
    </Routes>
  </div>  
  )
}

export default App
