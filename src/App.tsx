import React, { Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/common/Layout";
import AuthRedirect from "./components/common/AuthRedirect";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import NotFoundRedirect from "./components/common/NotFoundRedirect";

// Lazy loading
const Login = lazy(() => import("./features/auth-login"));
const Register = lazy(() => import("./features/auth-register"));
const TodoBoard = lazy(() => import("./features/board"));

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
          <Suspense
            fallback={
              <div style={{ textAlign: "center", marginTop: 40 }}>
                Loading...
              </div>
            }
          >
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
          </Suspense>
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
