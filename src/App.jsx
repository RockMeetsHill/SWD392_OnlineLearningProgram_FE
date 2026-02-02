import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/guest/Home'
import Login from './pages/guest/Login'
import Signup from './pages/guest/Signup'
import CourseSearch from './pages/guest/CourseSearch'
import CourseDetail from './pages/guest/CourseDetail'
import SignUpSuccess from './pages/guest/SignUpSuccess'
import PaymentSuccess from './pages/student/PaymentSuccess'
import PaymentCallback from './pages/student/PaymentCallback'
import StudentDashboard from './pages/student/Dashboard'
import StudentCourses from './pages/student/StudentCourses'
import Profile from './pages/student/Profile'
import InstructorDashboard from './pages/instructor/Dashboard'
import Payment from './pages/student/Payment'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/courses" element={<CourseSearch />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/register/success" element={<SignUpSuccess />} />

      {/* Payment Routes */}
      <Route path="/student/payment" element={<Payment />} />
      <Route path="/student/payment/success" element={<PaymentSuccess />} />
      <Route path="/payments/callback" element={<PaymentCallback />} />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/courses" element={<StudentCourses />} />
      <Route path="/student/profile" element={<Profile />} />

      {/* Instructor Routes */}
      <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
    </Routes>
  )
}

export default App