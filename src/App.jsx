import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, { useContext } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import AddEditExpenseModal from "./components/AddEditExpenseModal";
import { AuthProvider, AuthContext } from "./context/AuthContext";
const AppRoutes = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <>
      <ToastContainer position="top-right" />
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Navigate to={currentUser ? "/dashboard" : "/register"} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses/add"
          element={
            <ProtectedRoute>
              <AddEditExpenseModal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses/edit/:id"
          element={
            <ProtectedRoute>
              <AddEditExpenseModal />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to={currentUser ? "/dashboard" : "/register"} />}
        />
      </Routes>
    </>
  );
};

const App = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
