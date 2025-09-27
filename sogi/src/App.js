import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import { useAuth } from "./context/AuthContext"; // se usar proteção

// Protege rotas (opcional)
function RequireAuth({ children }) {
  const { signed, loading } = useAuth(); // signed = !!token
  if (loading) return null;               // ou um spinner
  return signed ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Login em "/" */}
      <Route path="/" element={<Login />} />

      {/* Home protegida */}
      <Route
        path="/home"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />

      {/* 404 opcional: redireciona para login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
