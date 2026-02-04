import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { performLogout } from "../Data/logout";

const AdminDashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const closeSidebar = () => setSidebarOpen(false);

  /* ✅ LOGOUT HANDLER - Palette Updated */
  const handleLogout = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-4 p-2">
          {/* Text color: #5D4037 */}
          <p className="text-sm font-black text-[#5D4037] text-center">
            Are you sure you want to logout?
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                performLogout(navigate);
                toast.success("Logged out successfully");
              }}
              /* Button color: #573D2F */
              className="px-4 py-2 bg-[#573D2F] text-white rounded-xl text-xs font-black uppercase tracking-widest"
            >
              OK
            </button>

            <button
              onClick={() => toast.dismiss(t.id)}
              /* Neutral background: #EEEEEE */
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
    /* Main Background: #FAF6F3 */
    <div className="min-h-screen flex bg-[#FAF6F3] relative overflow-hidden font-serif">
      
      {/* ================= MOBILE OVERLAY ================= */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen bg-white border-r border-[#EEEEEE] flex flex-col transition-all duration-300
        w-[280px] ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Profile Section */}
        <div className="px-8 py-10 lg:py-12 flex flex-col items-center border-b border-[#EEEEEE] relative">
          <button onClick={closeSidebar} className="lg:hidden absolute top-4 right-4 p-2 text-gray-400">
            <X size={20} />
          </button>

          {/* Icon/Avatar Frame: #5D4037 */}
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-[20px] lg:rounded-[24px] bg-[#5D4037] flex items-center justify-center shadow-2xl shadow-stone-200 border-4 border-white overflow-hidden mb-4">
            <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xs lg:text-sm font-black text-[#5D4037] tracking-tight uppercase">KalyanaMaalai</h1>
          <p className="text-[9px] lg:text-[10px] font-bold text-[#A67C52] uppercase tracking-[2px] mt-1">Super Admin</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 lg:px-6 py-6 lg:py-10 space-y-2 lg:space-y-3 overflow-y-auto">
          <MenuItem to="/admin/chart" label="Dashboard" icon={<LayoutDashboard size={18} />} onClick={closeSidebar} />
          <MenuItem to="/admin/all-users" label="All Users" icon={<Users size={18} />} onClick={closeSidebar} />
          <MenuItem to="/admin/pending-forms" label="Pending Forms" icon={<ClipboardList size={18} />} onClick={closeSidebar} />
        </nav>

        {/* Logout Section */}
        <div className="p-6 lg:p-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 lg:py-4
                       rounded-[16px] lg:rounded-[20px]
                       text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all
                       text-[10px] lg:text-[11px] font-black uppercase tracking-widest
                       border border-rose-100"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="h-20 lg:h-24 px-6 lg:px-12 flex items-center justify-between bg-transparent">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-white shadow-sm border border-[#EEEEEE] rounded-xl text-[#5D4037]"
            >
              <Menu size={20} />
            </button>
            
            <div>
              <h2 className="text-xl lg:text-3xl font-black text-[#5D4037] tracking-tight leading-none">Overview</h2>
              <p className="hidden xs:block text-[8px] lg:text-[10px] font-bold text-[#A67C52] uppercase tracking-[2px] lg:tracking-[3px] mt-1">Manage platform records</p>
            </div>
          </div>
        </header>

        {/* Page Content Area */}
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

/* ================= RESPONSIVE MENU ITEM - Palette Updated ================= */

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
            ? "bg-[#5D4037] text-white shadow-xl shadow-stone-200 lg:-translate-y-1" // Active: Brown #5D4037
            : "text-gray-400 hover:bg-[#FAF6F3] hover:text-[#5D4037]" // Inactive
        }`
      }
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </NavLink>
  );
};

export default AdminDashboardLayout;