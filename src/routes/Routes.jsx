import { createBrowserRouter, Navigate } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/layout/AdminLayout";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import DashboardPage from "../pages/user/DashboardPage";
import AssessmentDetailPage from "../pages/user/AssessmentDetailPage";
import ExamPage from "../pages/user/ExamPage";
import ResultPage from "../pages/user/ResultPage";
import MySubmissionsPage from "../pages/user/MySubmissionsPage";
import ProfilePage from "../pages/user/ProfilePage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AssessmentManagePage from "../pages/admin/AssessmentManagePage";
import AssessmentFormPage from "../pages/admin/AssessmentFormPage";
import QuestionManagePage from "../pages/admin/QuestionManagePage";
import UserManagePage from "../pages/admin/UserManagePage";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  {
    path: "/",
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "assessments/:id", element: <AssessmentDetailPage /> },
      { path: "exam/:submissionId", element: <ExamPage /> },
      { path: "result/:submissionId", element: <ResultPage /> },
      { path: "submissions/my", element: <MySubmissionsPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "assessments", element: <AssessmentManagePage /> },
      { path: "assessments/create", element: <AssessmentFormPage /> },
      { path: "assessments/:id/edit", element: <AssessmentFormPage /> },
      { path: "assessments/:id/questions", element: <QuestionManagePage /> },
      { path: "users", element: <UserManagePage /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;