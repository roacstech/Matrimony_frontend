import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  LogOut,
  Menu,
  Link2,
} from "lucide-react";
import { performLogout } from "../Data/logout";
import IMG from "../assets/adminprofile.jpg";

const AdminDashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileDropdown, setProfileDropdown] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-4 p-2">
          <p className="text-sm font-black text-black text-center">
            Are you sure you want to logout?
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                performLogout(navigate);
                toast.success("Logged out successfully");
              }}
              className="px-4 py-2 bg-[#1A5AF0] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700"
            >
              OK
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-100 text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" }
    );
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans overflow-hidden">   {/* Light background for main area */}
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR - Black Background Only */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-[#0F172A] text-white border-r border-gray-800 flex flex-col transition-all duration-300
        w-[260px] ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* LOGO AREA */}
        <div className="h-16 border-b border-gray-800 flex items-center px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1A5AF0] rounded-xl flex items-center justify-center text-white font-bold text-xl">
              D
            </div>
            <span className="text-xl font-bold tracking-tight">Dasabalanjika</span>
          </div>
        </div>

        {/* Profile Section */}
        <div className="px-5 pt-6 pb-5 border-b border-gray-800 flex flex-col items-center">
          <img
            src={IMG}
            alt="Admin"
            className="w-16 h-16 rounded-full border-2 border-gray-600 object-cover"
          />
          <h3 className="mt-3 font-semibold text-base">Admin</h3>
          <p className="text-xs text-gray-400">admin@gmail.com</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <MenuItem
            to="/admin/chart"
            label="Dashboard"
            icon={<LayoutDashboard size={18} />}
            onClick={closeSidebar}
          />
          <MenuItem
            to="/admin/all-users"
            label="Users Management"
            icon={<Users size={18} />}
            onClick={closeSidebar}
          />
          <MenuItem
            to="/admin/pending-forms"
            label="Pending Approvals"
            icon={<ClipboardList size={18} />}
            onClick={closeSidebar}
          />
          <MenuItem
            to="/admin/connection-status"
            label="Connection Status"
            icon={<Link2 size={18} />}
            onClick={closeSidebar}
          />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="h-16 px-5 lg:px-8 flex items-center justify-between bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
            <p className="font-semibold text-gray-800">Dashboard</p>
          </div>

          <div className="relative">
            <img
              src={IMG}
              alt="Admin"
              className="w-9 h-9 rounded-full cursor-pointer border border-gray-200 hover:border-[#1A5AF0]"
              onClick={() => setProfileDropdown(!isProfileDropdown)}
            />

            {isProfileDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 shadow-lg rounded-2xl py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 lg:p-0 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
            <div className=" p-5 lg:p-8  min-h-[calc(100vh-110px)]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

/* MENU ITEM */
const MenuItem = ({ to, label, icon, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all
        ${isActive 
          ? "bg-[#1A5AF0] text-white" 
          : "text-gray-300 hover:bg-gray-800"
        }`
      }
    >
      <span>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

export default AdminDashboardLayout;