import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import AdminLayout from "./AdminLayout";

export default function AdminRoute({ children }) {
  const { user, profile, isAuthenticated, isLoadingAuth } = useAuth();

  // Show loading while checking auth
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0A5C8C] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Checking access...</p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to admin login
  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Not an admin → show access denied
  if (profile?.role !== "admin") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have admin privileges. Please contact the site administrator
            to request access.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-[#0A5C8C] text-white rounded-lg hover:bg-[#084a6f] transition-colors"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  // Admin user → render admin layout with content
  return <AdminLayout>{children}</AdminLayout>;
}
