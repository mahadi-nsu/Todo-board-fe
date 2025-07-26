import React, { Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/common/Layout";
import AuthRedirect from "./components/common/AuthRedirect";
import AppToaster from "./components/common/AppToaster";
import { useClearTicketDrafts } from "./hooks/useClearTicketDrafts";
import NotFoundRedirect from "./components/common/NotFoundRedirect";
import { Spin } from "antd";

// Lazy loading
const Login = lazy(() => import("./features/auth-login"));
const Register = lazy(() => import("./features/auth-register"));
const TodoBoard = lazy(() => import("./features/board"));

function App() {
  // Clear ticket drafts on page load
  useClearTicketDrafts();

  return (
    <>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Suspense
            fallback={
              <div style={{ textAlign: "center", marginTop: 340 }}>
                <Spin size="large" spinning />
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
      <AppToaster />
    </>
  );
}

export default App;
