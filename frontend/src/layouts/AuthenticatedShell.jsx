import { Outlet } from "react-router-dom";
import AuthenticatedLayout from "./AuthenticatedLayout";
import { useAuth } from "../contexts/AuthContext";

export default function AuthenticatedShell() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <AuthenticatedLayout
      userEmail={user?.email ?? ""}
      collegeName={user?.collegeName ?? ""}
    />
  );
}
