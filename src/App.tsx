import "./App.css";
import Login from "./features/auth-login";
import Register from "./features/auth-register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import TodoBoard from "./features/board";

function App() {
  return (
    <>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/board" element={<TodoBoard />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </>
  );
}

export default App;
