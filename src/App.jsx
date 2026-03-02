import './App.css'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
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
import StudentCourseLearn from './pages/student/StudentCourseLearn'
import Profile from './pages/student/Profile'
import InstructorDashboard from './pages/instructor/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'
import Payment from './pages/student/Payment'
import Cart from './pages/student/Cart'
import ProtectedRoute from './components/ProtectedRoute'

function RedirectStudentCourseToLearn() {
  const { courseId } = useParams()
  return <Navigate to={`/student/courses/${courseId}/learn`} replace />
}

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/courses" element={<CourseSearch />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/register/success" element={<SignUpSuccess />} />
      <Route path="/cart" element={<Cart />} />
      {/* Payment Routes */}
      <Route path="/student/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      <Route path="/student/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
      <Route path="/payments/callback" element={<PaymentCallback />} />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/courses" element={<ProtectedRoute><StudentCourses /></ProtectedRoute>} />
      <Route path="/student/courses/:courseId" element={<ProtectedRoute><RedirectStudentCourseToLearn /></ProtectedRoute>} />
      <Route path="/student/courses/:courseId/learn" element={<ProtectedRoute><StudentCourseLearn /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Instructor Routes */}
      <Route path="/instructor/dashboard" element={
        <ProtectedRoute allowedRoles={['instructor', 'admin']}>
          <InstructorDashboard />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App