import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { RiDiamondRingFill } from "react-icons/ri";
import { FaLink } from "react-icons/fa";
import {
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  Inbox,
  Send,
} from "lucide-react";
import { performLogout } from "../Data/logout";
import { getUserProfile } from "../api/userApi";

const UserDashboardLayout = ({ showMenu, onAvatarClick, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [isProfileDropdown, setProfileDropdown] = useState(false);
  const [user, setUserData] = useState({});
  const profileRef = useRef(null);
  const userId = localStorage.getItem("userid");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserProfile(userId);
        if (res?.success) setUserData(res.data);
      } catch (err) {
        console.error("Profile fetch failed");
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  // Auto-open submenu if current path matches a child
  useEffect(() => {
    const MY_CONNECTIONS_KEY = "my-connections";
    const isConnectionChild = [
      "/user/dashboard/my-connection/received",
      "/user/dashboard/my-connection/sent",
    ].some((p) => location.pathname.startsWith(p));
    if (isConnectionChild) setOpenMenu(MY_CONNECTIONS_KEY);
  }, [location.pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              className="cursor-pointer px-4 py-2 bg-[#1A5AF0] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700"
            >
              OK
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="cursor-pointer px-4 py-2 bg-gray-100 text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" }
    );
  };

  // Handles both full S3 URLs and legacy relative filenames
  const resolvePhotoSrc = (photo) => {
    if (!photo) return null;
    if (photo.startsWith("http")) return photo;
    return `${import.meta.env.VITE_IMG_URL}/photos/${photo}`;
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  const connectionChildren = [
    {
      name: "Received",
      path: "/user/dashboard/my-connection/received",
      icon: <Inbox size={16} />,
    },
    {
      name: "Sent",
      path: "/user/dashboard/my-connection/sent",
      icon: <Send size={16} />,
    },
  ];

  const isConnectionActive = connectionChildren.some((c) =>
    location.pathname.startsWith(c.path)
  );
  const isConnectionOpen = openMenu === "my-connections";

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans overflow-hidden">

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR */}
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

        {/* PROFILE SECTION */}
        <div className="px-5 pt-6 pb-5 border-b border-gray-800 flex flex-col items-center">
          <img
            src={resolvePhotoSrc(user.photo)}
            alt="user"
            className="w-16 h-16 rounded-full border-2 border-gray-600 object-cover"
          />
          <h3 className="mt-3 font-semibold text-base text-center">
            {user?.full_name || "User"}
          </h3>
          <p className="text-xs text-gray-400">Member</p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {/* Dashboard */}
          <NavLink
            to="/user/dashboard"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all
              ${isActive
                ? "bg-[#1A5AF0] text-white"
                : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            <RiDiamondRingFill size={18} />
            <span>Matches</span>
          </NavLink>

          {/* My Connections (with submenu) */}
          <div>
            <button
              onClick={() =>
                setOpenMenu(isConnectionOpen ? null : "my-connections")
              }
              className={`cursor-pointer w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all
                ${isConnectionActive
                  ? "bg-[#1A5AF0] text-white"
                  : "text-gray-300 hover:bg-gray-800"
                }`}
            >
              <div className="flex items-center gap-3">
                <FaLink size={16} />
                <span>My Connections</span>
              </div>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${isConnectionOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isConnectionOpen && (
              <div className="ml-4 mt-1 border-l border-gray-700 pl-3 space-y-0.5">
                {connectionChildren.map((child) => {
                  const isChildActive = location.pathname.startsWith(child.path);
                  return (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      onClick={closeSidebar}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all
                        ${isChildActive
                          ? "text-white bg-white/10"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      {child.icon}
                      {child.name}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* HEADER */}
        <header className="h-16 px-5 lg:px-8 flex items-center justify-between bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="cursor-pointer lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
            <p className="font-semibold text-gray-800">தாசபளஞ்சிக கல்யாணமாலை</p>
          </div>

          {/* PROFILE DROPDOWN */}
          <div className="relative" ref={profileRef}>
            <img
              src={resolvePhotoSrc(user.photo)}
              alt="user"
              className="w-9 h-9 rounded-full cursor-pointer border border-gray-200 hover:border-[#1A5AF0] object-cover"
              onClick={() => setProfileDropdown(!isProfileDropdown)}
            />

            {isProfileDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 shadow-lg rounded-2xl py-1 z-50 overflow-hidden">
                {/* User Info */}
                <div className="flex flex-col items-center gap-1.5 px-4 py-4 border-b border-gray-100">
                  <img
                    src={resolvePhotoSrc(user.photo)}
                    alt="user"
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                  />
                  <p className="text-xs font-semibold text-gray-800 uppercase tracking-wide text-center mt-1">
                    {user?.full_name || "User"}
                  </p>
                </div>
                {/* Actions */}
                <div className="p-2">
                  <button
                    onClick={() => {
                      navigate("/user/dashboard/profile");
                      setProfileDropdown(false);
                    }}
                    className="cursor-pointer flex w-full items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl text-sm transition-colors"
                  >
                    <Settings size={16} className="text-indigo-400" />
                    <span>Profile Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setProfileDropdown(false);
                    }}
                    className="cursor-pointer flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-sm transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-[#F8FAFC]">
          <div className="max-w-[1400px] mx-auto">
            <div className="bg-white rounded-3xl p-5 lg:p-8 shadow border border-gray-100 min-h-[calc(100vh-110px)]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;