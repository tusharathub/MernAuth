import { useState } from 'react'
import FloatingThing from './components/FloatingThing'

function App() {
  return (
  <div className='min-h-screen bg-gradient-to-br from-gray-600 via-blue-900 to-purple-600 flex items-center justify-center relative overflow-hidden'>
    <h1>Welcome back</h1>
    <FloatingThing color='bg-red-500' size="w-64 h-64" top="-5%" left="10%" delay={0} />
    <FloatingThing color='bg-red-500' size="w-64 h-64" top="35%" left="15%" delay={0} />
    <FloatingThing color='bg-green-900' size="w-64 h-64" top="51%" left="65%" delay={0} />
  </div>
  )
}

export default App
