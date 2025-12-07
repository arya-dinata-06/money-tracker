import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import TransactionsPage from "@/pages/TransactionsPage";
import CategoriesPage from "@/pages/CategoriesPage";
import AdminPage from "@/pages/AdminPage";
import DownloadPage from "@/pages/DownloadPage";
import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";

// sebelum: const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// export const API = `${BACKEND_URL}/api`;

// ganti dengan:
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
// Jika REACT_APP_BACKEND_URL disediakan saat build, gunakan itu.
// Jika tidak, fallback ke relative path '/api' sehingga nginx reverse-proxy bisa menangani.
export const API = BACKEND_URL ? `${BACKEND_URL.replace(/\/$/, "")}/api` : "/api";


// Axios interceptor to add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token and get user info
      axios
        .get(`${API}/users/me`)
        .then((response) => {
          setUser(response.data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-lg font-medium text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <LoginPage onLogin={handleLogin} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Layout user={user} onLogout={handleLogout}>
                  <DashboardPage />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/transactions"
            element={
              isAuthenticated ? (
                <Layout user={user} onLogout={handleLogout}>
                  <TransactionsPage />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/categories"
            element={
              isAuthenticated ? (
                <Layout user={user} onLogout={handleLogout}>
                  <CategoriesPage />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/admin"
            element={
              isAuthenticated && user?.role === "superadmin" ? (
                <Layout user={user} onLogout={handleLogout}>
                  <AdminPage />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/download"
            element={
              isAuthenticated ? (
                <Layout user={user} onLogout={handleLogout}>
                  <DownloadPage />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;