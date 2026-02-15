import { Outlet } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";

export default function AuthenticatedLayout({ userEmail, collegeName }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppSidebar userEmail={userEmail} collegeName={collegeName} />
      <main className="pl-64 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
