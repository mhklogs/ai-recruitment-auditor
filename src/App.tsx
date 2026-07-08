import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CandidateForm from "./components/CandidateForm";
import AuditDashboard from "./components/AuditDashboard";
import ScreeningView from "./components/ScreeningView";
import CorporatePanel from "./components/CorporatePanel";
import CorporateLanding from "./components/CorporateLanding";
import ProctoringPortal from "./components/ProctoringPortal";
import UnifiedLogin from "./components/UnifiedLogin";
import AdminDashboard from "./components/AdminDashboard";
import ClientDashboard from "./components/ClientDashboard";

export default function App() {
  const [auth, setAuth] = useState<{ role: "admin" | "client" | null; id: string | null; name?: string | null }>(() => {
    const saved = sessionStorage.getItem("auth");
    return saved ? JSON.parse(saved) : { role: null, id: null, name: null };
  });

  const login = (role: "admin" | "client", data: any) => {
    const authData = { role, id: data.id, name: data.name || data.id };
    setAuth(authData);
    sessionStorage.setItem("auth", JSON.stringify(authData));
  };

  const logout = () => {
    setAuth({ role: null, id: null, name: null });
    sessionStorage.removeItem("auth");
  };

  return (
    <Routes>
      <Route path="/test" element={<ProctoringPortal />} />
      <Route
        path="/"
        element={
          auth.role === "admin" ? (
            <Navigate to="/admin-dashboard" replace />
          ) : auth.role === "client" ? (
            <Navigate to="/client-dashboard" replace />
          ) : (
            <CorporateLanding onLoginRequested={() => window.location.href = "/login"} />
          )
        }
      />
      <Route path="/login" element={<UnifiedLogin onLogin={login} />} />
      <Route path="/signin" element={<UnifiedLogin onLogin={login} />} />
      <Route path="/dashboard" element={<UnifiedLogin onLogin={login} />} />
      <Route
        path="/admin-dashboard"
        element={
          auth.role === "admin" ? (
            <AdminDashboard onLogout={logout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/client-dashboard"
        element={
          auth.role === "client" ? (
            <ClientDashboard clientId={auth.id || ""} clientName={auth.name || ""} onLogout={logout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<CorporateLanding onLoginRequested={() => window.location.href = "/login"} />} />
    </Routes>
  );
}
