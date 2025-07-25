import "./App.css";
import Login from "./features/auth-login";
import Register from "./features/auth-register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import TodoBoard from "./features/board";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/common/Layout";
import AuthRedirect from "./components/common/AuthRedirect";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import NotFoundRedirect from "./components/common/NotFoundRedirect";

function App() {
  useEffect(() => {
    const clearTicketDrafts = () => {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("ticket-draft-")) {
          localStorage.removeItem(key);
        }
      });
    };
    window.addEventListener("load", clearTicketDrafts);
    return () => {
      window.removeEventListener("load", clearTicketDrafts);
    };
  }, []);
  return (
    <>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <AuthRedirect>
                  <Login />
                </AuthRedirect>
              }
            />
            <Route
              path="/register"
              element={
                <AuthRedirect>
                  <Register />
                </AuthRedirect>
              }
            />
            <Route
              path="/board"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TodoBoard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundRedirect />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            style: {
              background: "#52c41a",
            },
          },
          error: {
            duration: 5000,
            style: {
              background: "#ff4d4f",
            },
          },
        }}
      />
    </>
  );
}

export default App;
