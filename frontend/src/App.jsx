import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import PublicRoute from "./protectedRoutes/PublicRoute";
import ProtectedRoute from "./protectedRoutes/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Students from "./pages/admin/Students";
import Teachers from "./pages/admin/Teachers";
import TeacherAllocations from "./pages/admin/TeacherAllocations";
import Classes from "./pages/admin/Classes";
import Subjects from "./pages/admin/Subjects";
import Academics from "./pages/admin/Academics";
import Terms from "./pages/admin/Terms";
import Attendance from "./pages/admin/Attendance";
import Assessments from "./pages/admin/Assessments";
import Marks from "./pages/admin/Marks";
import ReportCards from "./pages/admin/ReportCards";
import Promotions from "./pages/admin/Promotions";
import Notifications from "./pages/admin/Notifications";
import Settings from "./pages/admin/Settings";
import GradingSystem from "./pages/admin/GradingSystem";
import Backups from "./pages/admin/Backups";

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                {/* Redirect base path to login if public */}
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="students" element={<Students />} />
                    <Route path="teachers" element={<Teachers />} />
                    <Route path="teacher-allocations" element={<TeacherAllocations />} />
                    <Route path="classes" element={<Classes />} />
                    <Route path="subjects" element={<Subjects />} />
                    <Route path="academics" element={<Academics />} />
                    <Route path="terms" element={<Terms />} />
                    <Route path="attendance" element={<Attendance />} />
                    <Route path="assessments" element={<Assessments />} />
                    <Route path="marks" element={<Marks />} />
                    <Route path="report-cards" element={<ReportCards />} />
                    <Route path="promotions" element={<Promotions />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="grading-system" element={<GradingSystem />} />
                    <Route path="backups" element={<Backups />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
