import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/guest/Home'
import Login from './pages/guest/Login'
import Signup from './pages/guest/Signup'
import CourseSearch from './pages/guest/CourseSearch'
import CourseDetail from './pages/guest/CourseDetail'
import SignUpSuccess from './pages/guest/SignUpSuccess'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/courses" element={<CourseSearch />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/register/success" element={<SignUpSuccess />} />

    </Routes>
  )
}

export default App
