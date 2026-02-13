import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  LayoutDashboard, 
  Link2, 
  Bell, 
  User as UserIcon, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";
import { performLogout } from "../Data/logout";

import {getUserProfile} from "../api/userApi"

const UserDashboardLayout = ({
  showMenu,
  onAvatarClick,
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUserData] = useState([]);



    const Img_Url = import.meta.env.VITE_IMG_URL;

    const userId = localStorage.getItem("userid")


   useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await getUserProfile(userId);

      console.log("👍",res);
      

      if (res?.success) {
        setUserData(res.data);
      } else {
        toast.error(res?.message || "Failed to load profile");
      }
    } catch (err) {
      toast.error("Profile fetch failed");
    }
  };

  fetchUser();
}, []);


  /* ✅ ADMIN STYLE LOGOUT TOAST */
  const handleLogout = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-4 p-2">
          <p className="text-sm font-black text-[#5D4037] text-center">
            Logout செய்ய வேண்டுமா?
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                performLogout(navigate);
                toast.success("Logged out successfully",{duration:2000});
              }}
              className="px-4 py-2 bg-[#573D2F] text-white rounded-xl text-xs font-black uppercase tracking-widest"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-[#EEEEEE] text-[#5D4037] rounded-xl text-xs font-black uppercase tracking-widest"
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" }
    );
  };

  return (
    /* Main Background: #FAF6F3 (Admin Theme) */
    <div className="min-h-screen bg-[#FAF6F3] flex overflow-x-hidden font-serif">

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR - Styled like Admin Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen
        w-[280px] bg-white border-r border-[#EEEEEE] flex flex-col
        transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Profile Section */}
        <div className="px-8 py-10 flex flex-col items-center border-b border-[#EEEEEE] relative">
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 p-2 text-gray-400">
            <X size={20} />
          </button>

          <div className="w-16 h-16 rounded-[20px] bg-[#5D4037] flex items-center justify-center shadow-xl border-4 border-white overflow-hidden mb-4">
            <img
              src={`http://localhost:5000/uploads/photos/${user.photo}`}
              alt="user"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xs font-black text-[#5D4037] tracking-tight uppercase">
            {user?.full_name || "User"}
          </h2>
          <p className="text-[9px] font-bold text-[#A67C52] uppercase tracking-[2px] mt-1">Welcome Back</p>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {[
            {
              name: "Dashboard",
              path: "/user/dashboard",
              icon: <LayoutDashboard size={18} />,
            },
            {
              name: "My Connections",
              path: "/user/dashboard/my-connection",
              icon: <Link2 size={18} />,
            },
          ].map((item) => (
            <div
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-4 px-6 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[1.5px] cursor-pointer transition-all
                ${
                  location.pathname === item.path
                    ? "bg-[#5D4037] text-white shadow-lg lg:-translate-y-1"
                    : "text-gray-400 hover:bg-[#FAF6F3] hover:text-[#5D4037]"
                }`}
            >
              <span>{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </div>
          ))}
        </nav>
        
        {/* Simple Logout at Bottom of Sidebar (Optional) */}
        {/* <div className="p-6">
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-rose-600 text-[10px] font-black uppercase tracking-widest opacity-70 hover:opacity-100">
             <LogOut size={14} /> Logout
           </button>
        </div> */}
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* HEADER */}
        <header className="h-20 lg:h-24 px-6 lg:px-12 flex justify-between items-center bg-transparent">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2.5 bg-white shadow-sm border border-[#EEEEEE] rounded-xl text-[#5D4037]"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-xl lg:text-2xl font-black text-[#5D4037] tracking-tight">User Dashboard</h2>
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* NOTIFICATIONS */}
            {/* <button
              onClick={() => navigate("/user/dashboard/notifications")}
              className="p-2.5 bg-white rounded-xl border border-[#EEEEEE] text-[#5D4037] hover:bg-[#FAF6F3] transition-colors shadow-sm"
            >
              <Bell size={18} />
            </button> */}

            {/* PROFILE DROPDOWN TRIGGER */}
            <div
              onClick={onAvatarClick}
              className="flex items-center gap-2 cursor-pointer bg-white p-1.5 pr-4 rounded-full border border-[#EEEEEE] shadow-sm hover:border-[#A67C52] transition-all"
            >
              <img
                src={`http://localhost:5000/uploads/photos/${user.photo}`}
                alt="user"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden sm:inline text-xs font-black text-[#5D4037] uppercase tracking-wider">
                {user?.name?.split(' ')[0]}
              </span>
            </div>

            {showMenu && (
              <div className="absolute right-0 top-16 w-52 bg-white rounded-[24px] shadow-2xl border border-[#EEEEEE] z-50 overflow-hidden p-2">
                <button
                  onClick={() => navigate("/user/dashboard/profile")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[#5D4037] hover:bg-[#FAF6F3] rounded-xl"
                >
                  <Settings size={16} /> Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 px-4 lg:px-12 pb-6 lg:pb-10 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto h-full">
            <div className="bg-white rounded-[32px] lg:rounded-[48px] p-6 lg:p-10 shadow-xl shadow-stone-200/40 border border-[#EEEEEE] min-h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;