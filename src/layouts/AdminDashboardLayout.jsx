import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  LogOut,
  Menu,
} from "lucide-react";
import { performLogout } from "../Data/logout";

const AdminDashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileDropdown, setProfileDropdown] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
//
  const handleLogout = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-4 p-2">
          <p className="text-sm font-black text-[#5D4037] text-center">
            Are you sure you want to logout?
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                performLogout();
                toast.success("Logged out successfully",{duration:2000});
              }}
              className="px-4 py-2 bg-[#573D2F] text-white rounded-xl text-xs font-black uppercase tracking-widest"
            >
              OK
            </button>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-[#EEEEEE] text-[#5D4037] rounded-xl text-xs font-black uppercase tracking-widest"
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
    <div className="min-h-screen flex bg-[#FAF6F3] relative overflow-hidden font-serif">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
       

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:sticky top- left-0 z-50 h-screen bg-white border-r border-[#EEEEEE] flex flex-col transition-all duration-300
        w-[280px] ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
      <div className="flex flex-col items-center justify-center mt-10">
  <img
    src="src/assets/adminprofile.jpg"
    alt="Admin"
    className="w-16 h-16 rounded-full cursor-pointer border-2 border-white shadow-md"
  />
  <span className="mt-2 text-sm font-semibold text-gray-700">
    Admin
  </span>
</div>


        {/* Navigation Menu */}
        <nav className="flex-1 px-4 lg:px-6 py-10 space-y-3 overflow-y-auto">
          <MenuItem to="/admin/chart" label="Dashboard" icon={<LayoutDashboard size={18} />} onClick={closeSidebar} />
          <MenuItem to="/admin/all-users" label="All Users" icon={<Users size={18} />} onClick={closeSidebar} />
          <MenuItem to="/admin/pending-forms" label="Pending Forms" icon={<ClipboardList size={18} />} onClick={closeSidebar} />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="h-20 lg:h-24 px-6 lg:px-12 flex items-center justify-between bg-transparent relative">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-white shadow-sm border border-[#EEEEEE] rounded-xl text-[#5D4037]"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-xl lg:text-3xl font-black text-[#5D4037] tracking-tight leading-none">
                Overview
              </h2>
              <p className="hidden xs:block text-[8px] lg:text-[10px] font-bold text-[#A67C52] uppercase tracking-[2px] lg:tracking-[3px] mt-1">
                Manage platform records
              </p>
            </div>
          </div>

          {/* PROFILE AVATAR (TOP-RIGHT) */}
          <div className="relative">
            <img
              src="src/assets/adminprofile.jpg"
              alt="Admin"
              className="w-13 h-13 rounded-full cursor-pointer border-2 border-white shadow-md"
              onClick={() => setProfileDropdown(!isProfileDropdown)}
            />

            {isProfileDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-[#EEEEEE] shadow-lg rounded-xl flex flex-col z-50 overflow-hidden">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 text-rose-600 hover:bg-rose-50 transition-all text-xs font-black uppercase tracking-widest"
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
            <div className="bg-white rounded-[32px] lg:rounded-[48px] p-5 lg:p-10 shadow-xl shadow-stone-200/40 border border-[#EEEEEE] min-h-[calc(100vh-140px)] lg:min-h-[calc(100vh-180px)]">
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
        ${isActive
          ? "bg-[#5D4037] text-white shadow-xl shadow-stone-200 lg:-translate-y-1"
          : "text-gray-400 hover:bg-[#FAF6F3] hover:text-[#5D4037]"}`
      }
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </NavLink>
  );
};

export default AdminDashboardLayout;
