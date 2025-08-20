"use client";

import { useState } from "react";
import useUser from "@/utils/useUser";
import useAdminAuth from "@/hooks/useAdminAuth";
import useAdminDashboardData from "@/hooks/useAdminDashboardData";

import AdminLoading from "@/components/admin/AdminLoading";
import AdminAuthRequired from "@/components/admin/AdminAuthRequired";
import AdminAccessDenied from "@/components/admin/AdminAccessDenied";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

import OverviewTab from "@/components/admin/tabs/OverviewTab";
import UserManagementTab from "@/components/admin/tabs/UserManagementTab";
import VolunteerManagementTab from "@/components/admin/tabs/VolunteerManagementTab";
import SessionManagementTab from "@/components/admin/tabs/SessionManagementTab";
import PaymentManagementTab from "@/components/admin/tabs/PaymentManagementTab";
import PlaceholderTab from "@/components/admin/tabs/PlaceholderTab";

export default function AdminDashboard() {
  const { data: user, loading: userLoading } = useUser();
  const { isAdmin, isChecking: isAdminChecking } = useAdminAuth(user, userLoading);
  const { data, loading: dataLoading } = useAdminDashboardData(isAdmin);
  const [activeTab, setActiveTab] = useState("overview");

  if (userLoading || isAdminChecking) {
    return <AdminLoading />;
  }

  if (!user) {
    return <AdminAuthRequired />;
  }

  if (!isAdmin) {
    return <AdminAccessDenied />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab data={data} />;
      case "users":
        return <UserManagementTab users={data.users} />;
      case "volunteers":
        return <VolunteerManagementTab applications={data.applications} />;
      case "sessions":
        return <SessionManagementTab sessions={data.sessions} />;
      case "payments":
        return <PaymentManagementTab payments={data.payments} />;
      case "training":
      case "feedback":
      case "analytics":
      case "settings":
        return <PlaceholderTab tabId={activeTab} />;
      default:
        return <OverviewTab data={data} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 mt-8 md:mt-0">
            {dataLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              </div>
            ) : (
              renderContent()
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
