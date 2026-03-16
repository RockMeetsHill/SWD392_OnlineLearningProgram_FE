import "./App.css";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import Home from "./pages/guest/Home";
import Login from "./pages/guest/Login";
import Signup from "./pages/guest/Signup";
import CourseSearch from "./pages/guest/CourseSearch";
import CourseDetail from "./pages/guest/CourseDetail";
import SignUpSuccess from "./pages/guest/SignUpSuccess";
import PaymentSuccess from "./pages/student/PaymentSuccess";
import PaymentCallback from "./pages/student/PaymentCallback";
import StudentDashboard from "./pages/student/Dashboard";
import StudentCourses from "./pages/student/StudentCourses";
import Certificates from "./pages/student/Certificates";
import Profile from "./pages/student/Profile";
import InstructorDashboard from "./pages/instructor/Dashboard";
import AssignmentGrading from "./pages/instructor/AssignmentGrading";
import InstructorSettings from "./pages/instructor/Settings";
import Payment from "./pages/student/Payment";
import AdminDashboard from "./pages/admin/Dashboard";
import RevenueTracking from "./pages/admin/RevenueTracking";
import InstructorManagement from "./pages/admin/InstructorManagement";
import InstructorPayroll from "./pages/admin/InstructorPayroll";
import CourseApprovals from "./pages/admin/CourseApprovals";
import CourseApprovalDetails from "./pages/admin/CourseApprovalDetails";
import Cart from './pages/student/Cart'
import ProtectedRoute from './components/ProtectedRoute'
import StudentCourseLearn from "./pages/student/StudentCourseLearn";
import StudentManagement from "./pages/admin/StudentManagement";
import InstructorProgress from "./pages/instructor/Progress";

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
      <Route path="/student/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
      <Route path="/student/certificates/:certificateId" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
      <Route path="/student/courses/:courseId" element={<ProtectedRoute><RedirectStudentCourseToLearn /></ProtectedRoute>} />
      <Route path="/student/courses/:courseId/learn" element={<ProtectedRoute><StudentCourseLearn /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Instructor Routes */}
      <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
      <Route path="/instructor/progress" element={<InstructorProgress />} />
      <Route path="/instructor/settings" element={<InstructorSettings />} />
      <Route path="/instructor/assignments/:lessonId" element={<AssignmentGrading />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/revenue" element={<RevenueTracking />} />
      <Route
        path="/admin/manage/instructors"
        element={<InstructorManagement />}
      />
      <Route path="/admin/instructor-payroll" element={<InstructorPayroll />} />
      <Route path="/admin/course-approvals" element={<CourseApprovals />} />
      <Route path="/admin/course-approvals/:id" element={<CourseApprovalDetails />} />
      <Route path="/admin/manage/students" element={<StudentManagement />} />
    </Routes>
  );
}

export default App;
