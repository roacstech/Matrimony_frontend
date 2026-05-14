import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { MdSpaceDashboard } from "react-icons/md";
import { FaLink } from "react-icons/fa";
import { 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";
import { performLogout } from "../Data/logout";
import { getUserProfile } from "../api/userApi";

const UserDashboardLayout = ({
  showMenu,
  onAvatarClick,
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUserData] = useState([]);
  const menuRef = useRef(null);
  const userId = localStorage.getItem("userid");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserProfile(userId);
        if (res?.success) {
          setUserData(res.data);
        }
      } catch (err) {
        console.error("Profile fetch failed");
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  // Handle Click Outside for both Menu and Toast
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && menuRef.current && !menuRef.current.contains(event.target)) {
        toast.dismiss(); 
        onAvatarClick(); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu, onAvatarClick]);

  const handleLogout = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-4 p-2">
          <p className="text-sm font-medium text-medium text-center">
            Logout செய்ய வேண்டுமா?
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                performLogout(navigate);
                toast.success("Logged out successfully");
              }}
              className="px-4 py-2 bg-[#d6e4ff] text-blue-500 rounded-xl text-xs font-medium  tracking-widest hover:bg-[#c0d4ff]"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-100 text-black rounded-xl text-xs font-medium  tracking-widest hover:bg-gray-200"
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
    <div className="min-h-screen bg-white flex overflow-x-hidden font-sans">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => {
            setIsSidebarOpen(false);
            toast.dismiss(); 
          }}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[280px] bg-[#222] border-r border-gray-200 flex flex-col transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="px-8 py-10 flex flex-col items-center relative">
         
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 p-2 text-gray-400">
            <X size={20} />
          </button>
          <div className="w-16 h-16 rounded-[50px] bg-[#d6e4ff] flex items-center justify-center shadow-xl border-1 border-white overflow-hidden mb-4">
            <img src={`${import.meta.env.VITE_IMG_URL}/photos/${user.photo}`} alt="user" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xs font-black text-white tracking-tight uppercase text-center px-2">{user?.full_name || "User"}</h2>
          <p className="text-[9px] font-medium text-[#d6e4ff] uppercase tracking-[2px] mt-1">Welcome Back</p>
        </div>

        <nav className="flex-1 py-6 space-y-2">
          {[
            { name: "Dashboard", path: "/user/dashboard", icon: <MdSpaceDashboard size={18} /> },
            { name: "My Connections", path: "/user/dashboard/my-connection", icon: <FaLink  size={18} /> }
          ].map((item) => (
            <div 
              key={item.path} 
              onClick={() => { navigate(item.path); setIsSidebarOpen(false); }} 
              className={`flex items-center gap-4 px-6 py-4  text-[12px] font-medium uppercase tracking-[1.5px] cursor-pointer transition-all ${location.pathname === item.path ? "bg-[#e3ebfa] text-blue-500 shadow-lg border-r-4 border-[#1A5AF0]" : "text-gray-100 hover:bg-[#e3ebfa] hover:text-blue-500"}`}
            >
              <span>{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="h-20 lg:h-24 px-6 lg:px-12 flex justify-between items-center bg-transparent">
  <div className="flex items-center gap-4">
    <button className="lg:hidden p-2.5 bg-white shadow-sm border border-gray-100 rounded-xl text-[#d6e4ff]" onClick={() => setIsSidebarOpen(true)}>
      <Menu size={20} />
    </button>
    <h2 className="text-xl lg:text-2xl font-black text-black tracking-tight">தாசபளஞ்சிக கல்யாணமாலை</h2>
  </div>

  <div className="flex items-center gap-3 relative" ref={menuRef}>
    {/* AVATAR ONLY — no name outside */}
    <div onClick={onAvatarClick} className="cursor-pointer bg-white p-1 rounded-full border border-gray-100 shadow-sm hover:border-[#d6e4ff] transition-all">
      <img
        src={`${import.meta.env.VITE_IMG_URL}/photos/${user.photo}`}
        alt="user"
        className="w-9 h-9 rounded-full object-cover"
      />
    </div>

    {/* DROPDOWN MENU */}
    {showMenu && (
      <div className="absolute right-0 top-14 w-52 bg-[#f5f7fa] rounded-[8px] shadow-2 border border-gray-100 z-50 overflow-hidden">
        
        {/* IMAGE + NAME INSIDE */}
        <div className="flex flex-col items-center gap-1.5 px-4 py-4 border-b border-gray-100">
          <img
            src={`${import.meta.env.VITE_IMG_URL}/photos/${user.photo}`}
            alt="user"
            className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 shadow-sm"
          />
          <p className="text-[12px] font-semibold text-gray-800 uppercase tracking-wide text-center">
            {user?.full_name || "User"}
          </p>
        </div>
       

        {/* MENU BUTTONS */}
        <div className="p-2">
          <button
            onClick={() => { navigate("/user/dashboard/profile"); onAvatarClick(); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-[12px] font-medium tracking-widest text-black hover:text-blue-500 rounded-xl transition-colors cursor-pointer"
          >
            <Settings size={16} className="text-[#818CF8]" /> Profile Settings
          </button>
         
          <button
            onClick={() => { handleLogout(); onAvatarClick(); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-[12px] font-medium tracking-widest text-rose-600  rounded-xl transition-colors cursor-pointer"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    )}
  </div>
</header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 px-4 lg:px-12 pb-6 lg:pb-10 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto h-full">
            <div className="bg-white rounded-[32px] lg:rounded-[48px] p-6 lg:p-10 shadow-xl border border-gray-100 min-h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;