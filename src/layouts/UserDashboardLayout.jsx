import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { performLogout } from "../Data/logout";

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
            className="px-4 py-1.5 bg-red-500 text-white rounded-lg"
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
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[#3B1E54] text-white flex flex-col
        transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-8 text-center">
          <img
            src={user?.photo || "/default-avatar.png"}
            alt="user"
            className="w-20 h-20 rounded-full mx-auto mb-3"
          />
          <h2 className="text-lg">
            Welcome{" "}
            <span className="font-bold text-[#D4BEE4]">
              {user?.name || "User"}
            </span>
          </h2>
        </div>

        {/* MENU */}
        <nav className="flex-1 mt-4">
          <ul className="space-y-1">
            {[
              {
                name: "Dashboard",
                path: "/user/dashboard",
                icon: "📊",
              },
              {
                name: "My Connections",
                path: "/user/dashboard/my-connection",
                icon: "🔗",
              },
            ].map((item) => (
              <li
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-4 py-4 px-8 cursor-pointer
                  ${
                    location.pathname === item.path
                      ? "bg-[#EEEEEE] text-[#3B1E54] font-bold rounded-r-full"
                      : "text-[#D4BEE4] hover:bg-[#9B7EBD]/20"
                  }`}
              >
                <span>{item.icon}</span>
                <span className="uppercase tracking-widest text-sm">
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
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
            User Dashboard
          </h1>

          <div className="flex items-center gap-3 relative">
            {/* NOTIFICATIONS */}
            <button
              onClick={() =>
                navigate("/user/dashboard/notifications")
              }
              className="p-2 bg-white rounded-full border"
            >
              🔔
            </button>

            {/* PROFILE */}
            <div
              onClick={onAvatarClick}
              className="flex items-center gap-2 cursor-pointer bg-white p-1 rounded-full border"
            >
              <img
                src={user?.photo || "/default-avatar.png"}
                alt="user"
                className="w-9 h-9 rounded-full"
              />
              <span className="font-bold text-[#3B1E54]">
                {user?.name}
              </span>
            </div>

            {showMenu && (
              <div className="absolute right-0 top-14 w-48 bg-white rounded-xl shadow-xl z-50">
                <button
                  onClick={() =>
                    navigate("/user/dashboard/profile")
                  }
                  className="w-full px-5 py-3 text-left hover:bg-gray-100"
                >
                  ✏️ Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-5 py-3 text-left text-red-500 hover:bg-red-50"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* CHILD ROUTES */}
        <section className="flex-1 px-6 pb-8">
          <div className="bg-white rounded-3xl p-6 h-full overflow-y-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserDashboardLayout;
