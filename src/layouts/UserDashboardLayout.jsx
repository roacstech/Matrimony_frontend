import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { performLogout } from "../Data/logout";
import toast from "react-hot-toast";

const UserDashboardLayout = ({
  user,
  showMenu,
  onAvatarClick,
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    toast((t) => (
      <div className="p-1">
        <p className="font-semibold mb-3 text-center text-[#3B1E54]">
          Logout செய்ய வேண்டுமா?
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              performLogout(navigate);
            }}
            className="px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-1.5 bg-[#D4BEE4] text-[#3B1E54] rounded-lg"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-[#EEEEEE] flex overflow-x-hidden">

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#3B1E54]/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-[#3B1E54] text-white flex flex-col
          transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-8 flex flex-col items-center">
          <div
            className="relative mb-4 cursor-pointer"
            onClick={onAvatarClick}
          >
            <img
              src={user?.photo || "/default-avatar.png"}
              alt="user"
              className="w-20 h-20 rounded-full border-4 border-[#9B7EBD]/30 object-cover"
            />
          </div>
          <h2 className="text-lg text-center">
            Welcome,{" "}
            <span className="font-bold text-[#D4BEE4]">
              {user?.name?.split(" ")[0] || "User"}
            </span>
          </h2>
        </div>

        <nav className="flex-1 mt-4">
          <ul className="space-y-1">
            {[
              { name: "Dashboard", path: "/user/dashboard", icon: "📊" },
              { name: "My Connections", path: "/user/my-connection", icon: "🔗" },
            ].map((item) => (
              <li
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-4 py-4 px-8 cursor-pointer ${
                  location.pathname === item.path
                    ? "bg-[#EEEEEE] text-[#3B1E54] font-bold rounded-r-full"
                    : "text-[#D4BEE4] hover:bg-[#9B7EBD]/20"
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-sm uppercase tracking-widest">
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="px-6 py-6 flex justify-between items-center">

          <button
            className="lg:hidden p-2 bg-white rounded-xl"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>

          <h1 className="hidden sm:block text-xl text-[#9B7EBD]">
            Your personal profile info
          </h1>

          {/* RIGHT SIDE ICONS */}
          <div className="flex items-center gap-3 relative">

            {/* 🔔 NOTIFICATION BELL */}
            <button
              onClick={() => navigate("/user/notifications")}
              className="relative p-2 bg-white rounded-full border border-[#D4BEE4]"
            >
              🔔
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            </button>

            {/* AVATAR */}
            <div
              onClick={onAvatarClick}
              className="flex items-center gap-2 cursor-pointer bg-white p-1 rounded-full border border-[#D4BEE4]"
            >
              <img
                src={user?.photo || "/default-avatar.png"}
                alt="user"
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="text-sm font-bold text-[#3B1E54]">
                {user?.name}
              </span>
            </div>

            {/* DROPDOWN */}
            {showMenu && (
<div className="absolute right-0 top-14 w-48 bg-white rounded-xl shadow-xl z-50">
                <button
                  onClick={() => navigate("/user/profile")}
                  className="w-full px-5 py-3 text-left text-sm hover:bg-[#D4BEE4]/30"
                >
                  ✏️ Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-5 py-3 text-left text-sm text-red-500 hover:bg-red-50"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* CONTENT */}
        <section className="flex-1 px-6 pb-8">
          <div className="bg-white rounded-[30px] p-6 h-full overflow-y-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserDashboardLayout;
