import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  LogOut,
  Menu,
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
                toast.success("Logged out successfully", { duration: 2000 });
              }}
              className="px-4 py-2 bg-[#1A5AF0] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-colors"
            >
              OK
            </button>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-100 text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" },
    );
  };

  return (
    <div className="min-h-screen flex bg-[#B3CCFB] relative overflow-hidden font-sans">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300
        w-[280px] ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col items-center justify-center mt-10">
          <div className="relative p-1 rounded-full border-2 border-[#1A5AF0]/20">
             <img
              src={`${IMG}`}
              alt="Admin"
              className="w-16 h-16 rounded-full cursor-pointer shadow-md object-cover"
            />
          </div>
          <span className="mt-2 text-sm font-bold text-black uppercase tracking-wider">
            Admin
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 lg:px-6 py-10 space-y-3 overflow-y-auto">
          <MenuItem
            to="/admin/chart"
            label="Dashboard"
            icon={<LayoutDashboard size={18} />}
            onClick={closeSidebar}
          />
          <MenuItem
            to="/admin/all-users"
            label="All Users"
            icon={<Users size={18} />}
            onClick={closeSidebar}
          />
          <MenuItem
            to="/admin/pending-forms"
            label="Pending Forms"
            icon={<ClipboardList size={18} />}
            onClick={closeSidebar}
          />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="h-20 lg:h-24 px-6 lg:px-12 flex items-center justify-between bg-transparent relative">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-white shadow-sm border border-gray-100 rounded-xl text-[#1A5AF0]"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="hidden xs:block text-[8px] lg:text-[10px] font-black text-[#1A5AF0] uppercase tracking-[3px] mt-1">
                Manage platform records
              </p>
            </div>
          </div>

          {/* PROFILE AVATAR (TOP-RIGHT) */}
          <div className="relative">
            <img
              src={`${IMG}`}
              alt="Admin"
              className="w-12 h-12 rounded-full cursor-pointer border-2 border-white shadow-lg hover:border-[#1A5AF0] transition-all"
              onClick={() => setProfileDropdown(!isProfileDropdown)}
            />

            {isProfileDropdown && (
              <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-100 shadow-2xl rounded-2xl flex flex-col z-50 overflow-hidden p-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 text-rose-600 hover:bg-rose-50 transition-all text-[10px] font-black uppercase tracking-widest rounded-xl"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 px-4 lg:px-12 pb-6 lg:pb-12 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
            <div className="bg-white rounded-[32px] lg:rounded-[48px] p-5 lg:p-10 shadow-2xl shadow-blue-900/10 border border-gray-100 min-h-[calc(100vh-140px)] lg:min-h-[calc(100vh-180px)]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

/* MENU ITEM COMPONENT */
const MenuItem = ({ to, label, icon, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 lg:gap-4 px-5 lg:px-6 py-3.5 lg:py-4 rounded-[18px] lg:rounded-[22px] text-[10px] lg:text-[11px] font-black uppercase tracking-[1.5px]
        transition-all duration-300
        ${
          isActive
            ? "bg-[#1A5AF0] text-white shadow-lg shadow-blue-200 lg:-translate-y-1"
            : "text-gray-400 hover:bg-[#B3CCFB]/20 hover:text-[#1A5AF0]"
        }`
      }
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </NavLink>
  );
};

export default AdminDashboardLayout;