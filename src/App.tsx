import "./App.css";
import Login from "./features/auth-login";
import Register from "./features/auth-register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import TodoBoard from "./features/board";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/common/Layout";
import AuthRedirect from "./components/common/AuthRedirect";
import CategoryTest from "./components/common/CategoryTest";

function App() {
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
                    <CategoryTest />
                    <TodoBoard />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </>
  );
}

export default App;
