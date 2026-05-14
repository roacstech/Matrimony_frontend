import React, { useEffect, useState } from "react";
import {
  Eye,
  Trash2,
  ArrowLeft,
  FileText,
  Download,
  Mail,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Pencil,
  User,
} from "lucide-react";
import { calculateAge } from "../../utils/dateHelper";
import {
  getAllUsers,
  adminToggleVisibility,
  deleteUser,
} from "../../api/adminApi";
import { getEnumLabel } from "../../utils/convertHelper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const AllUsers = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [togglingUserId, setTogglingUserId] = useState(null);

  const displayMode = "both";

  /* ================= FETCH ================= */
  useEffect(() => {
    getAllUsers()
      .then((res) => {
        const fixedData = res.map((u) => ({
          ...u,
          is_active: Number(u.is_active),
        }));
        setData(fixedData);
      })
      .catch(console.error);
  }, []);

  /* ================= TOGGLE ================= */
  const togglePublicStatus = async (id, currentStatus) => {
    setTogglingUserId(id);
    try {
      const res = await adminToggleVisibility({
        id,
        key: currentStatus === 1 ? 0 : 1,
      });
      if (res.success) {
        setData((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, is_active: Number(res.is_active) } : u
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingUserId(null);
    }
  };

  /* ================= DELETE ================= */
  const queryClient = useQueryClient();

  const { mutate: handleDeleteUser } = useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, userId) => {
      setData((prev) => prev.filter((u) => u.id !== userId));
      setSelectedUser(null);
      toast.success("User deleted successfully");
    },
    onError: (err) => {
      console.error("Delete failed:", err.message);
      toast.error("Failed to delete user");
    },
  });

  const confirmDelete = (userId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold text-black">Delete this user?</p>
          <p className="text-xs text-gray-400">This action cannot be undone.</p>
          <div className="flex gap-2">
            <button
              onClick={() => { handleDeleteUser(userId); toast.dismiss(t.id); }}
              className="px-4 py-1.5 bg-rose-500 text-white text-xs font-bold rounded-lg hover:bg-rose-600 transition"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  };

  const formatTime12h = (time) => {
    if (!time) return "-";
    const [h, m] = time.split(":");
    let hours = Number(h);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${m} ${period}`;
  };

  /* ================= FILTER ================= */
  const filteredUsers = data
    .filter((u) => {
      if (filter === "all") return true;
      if (filter === "male" || filter === "female")
        return u.gender?.toLowerCase() === filter;
      if (filter === "active") return u.is_active === 1;
      if (filter === "inactive") return u.is_active === 0;
      return true;
    })
    .filter(
      (u) =>
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  /* ================= DETAIL VIEW ================= */
  if (selectedUser) {
    return (
      <div className="bg-white rounded-2xl p-6 md:p-10 border border-gray-200">
        {/* Back header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setSelectedUser(null); setActiveTab("personal"); }}
              className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center flex-shrink-0">
                {selectedUser?.photo ? (
                  <img
                    src={`${import.meta.env.VITE_IMG_URL}/photos/${selectedUser.photo}`}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={22} className="text-gray-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedUser.fullName}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{selectedUser.email}</p>
              </div>
            </div>
          </div>
          <span
            className={`px-4 py-1.5 text-xs font-semibold rounded-full ${
              selectedUser.is_active
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-500"
            }`}
          >
            {selectedUser.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-100 mb-6">
          {["personal", "education", "family", "horoscope"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-xs font-semibold capitalize transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTab === "personal" && (
            <>
              <InfoBox label="Full Name / முழு பெயர்" value={selectedUser.fullName} />
              <InfoBox label="Gender / பாலினம்" value={getEnumLabel("gender", selectedUser.gender, displayMode)} />
              <InfoBox label="Date of Birth / பிறந்த தேதி" value={selectedUser.dob?.split("T")[0]} />
              <InfoBox label="Age / வயது" value={selectedUser?.dob ? `${calculateAge(selectedUser.dob)} Years` : "—"} />
              <InfoBox label="Birth Place / பிறந்த இடம்" value={selectedUser.birthPlace} />
              <InfoBox label="Birth Time / பிறந்த நேரம்" value={formatTime12h(selectedUser.birthTime)} />
              <InfoBox label="Phone / தொலைபேசி எண்" value={selectedUser.phone} />
              <InfoBox label="Marital Status / திருமண நிலை" value={getEnumLabel("maritalStatus", selectedUser.maritalStatus, displayMode)} />
              <InfoBox label="Country" value={selectedUser.country} />
              <div className="sm:col-span-2 lg:col-span-3">
                <InfoBox label="Full Address / வீட்டு முகவரி" value={selectedUser.address} />
              </div>
            </>
          )}
          {activeTab === "education" && (
            <>
              <InfoBox label="Qualification / கல்வி" value={selectedUser.education} />
              <InfoBox label="Occupation / தொழில்" value={selectedUser.occupation} />
              <InfoBox label="Annual Income / மாத வருமானம்" value={selectedUser.income} />
              <InfoBox label="Work Location / வேலை இடம்" value={selectedUser.workLocation} />
            </>
          )}
          {activeTab === "family" && (
            <>
              <InfoBox label="Father's Name / தந்தை பெயர்" value={selectedUser.father} />
              <InfoBox label="Mother's Name / தாய் பெயர்" value={selectedUser.mother} />
              <InfoBox label="Paternal Grandfather" value={selectedUser.grandfather} />
              <InfoBox label="Paternal Grandmother" value={selectedUser.grandmother} />
              <InfoBox label="Mother Side Grandfather" value={selectedUser.motherSideGrandfather} />
              <InfoBox label="Mother Side Grandmother" value={selectedUser.motherSideGrandmother} />
              <InfoBox label="Siblings / உடன்பிறப்புகள்" value={selectedUser.siblings} />
            </>
          )}
          {activeTab === "horoscope" && (
            <>
              <InfoBox label="Raasi / இராசி" value={getEnumLabel("raasi", selectedUser.raasi, displayMode)} />
              <InfoBox label="Star / நட்சத்திரம்" value={getEnumLabel("star", selectedUser.star, displayMode)} />
              <InfoBox label="Dosham / தோஷாம்" value={getEnumLabel("dosham", selectedUser.dosham, displayMode)} />
              <div className="sm:col-span-2 lg:col-span-3">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border border-gray-200 text-blue-600">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">Jadhagam / ஜாதகம்</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {selectedUser.horoscope?.uploaded ? selectedUser.horoscope.fileName || "horoscope.pdf" : "Not Uploaded"}
                      </p>
                    </div>
                  </div>
                  {selectedUser.horoscope?.uploaded && (
                    <a
                      href={`${import.meta.env.VITE_IMG_URL}/photos/${selectedUser.horoscope.fileName}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition flex items-center gap-1.5"
                    >
                      <Download size={13} /> View
                    </a>
                  )}
                </div>
                <div className="mt-4">
                  <InfoBox label="Remarks / குறிப்புகள்" value={selectedUser.remarks} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ================= TABLE VIEW ================= */
  const tabs = ["all", "male", "female", "active", "inactive"];

  return (
    <div className="space-y-5">

      {/* ── Top bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <User size={18} className="text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">User Management</h2>
        </div>

        <div className="flex items-center gap-6">
          {/* Tab filters */}
          <div className="flex items-center gap-1 border-b border-gray-200">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2.5 text-sm font-medium capitalize transition-all border-b-2 -mb-px whitespace-nowrap ${
                  filter === t
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative w-full sm:w-80">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
        />
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[860px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Username</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Gender</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Privacy</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-14 text-sm text-gray-400">
                    {searchTerm ? "No users found matching your search" : "No users in this category"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => (
                  <tr
                    key={u.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      idx % 2 === 1 ? "bg-gray-50/40" : "bg-white"
                    }`}
                  >
                    {/* Username + avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {u?.photo ? (
                            <img
                              src={`${import.meta.env.VITE_IMG_URL}/photos/${u.photo}`}
                              alt="user"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={16} className="text-gray-400" />
                          )}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {u.fullName?.split(" ")[0] || "—"}
                        </span>
                      </div>
                    </td>

                    {/* Full name */}
                    <td className="px-6 py-4 text-sm text-gray-700">{u.fullName || "—"}</td>

                    {/* Email */}
                    <td className="px-6 py-4 text-sm text-gray-600">{u.email || "—"}</td>

                    {/* Gender */}
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{u.gender || "—"}</td>

                    {/* Privacy */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          u.privacy === "Private"
                            ? "bg-rose-50 text-rose-500"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {u.privacy || "—"}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          u.is_active === 1
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {u.is_active === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        {/* Toggle */}
                        <button
                          onClick={() => togglePublicStatus(u.id, u.is_active)}
                          className={`w-10 h-5 rounded-full relative transition-all ${
                            u.is_active === 1 ? "bg-emerald-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                              u.is_active === 1 ? "left-5" : "left-0.5"
                            }`}
                          />
                        </button>

                        {/* View */}
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="text-gray-400 hover:text-blue-600 transition"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => confirmDelete(u.id)}
                          className="text-gray-400 hover:text-rose-500 transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ================= INFOBOX ================= */
const InfoBox = ({ label, value }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
      {label}
    </label>
    <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-800">
      {value || "—"}
    </div>
  </div>
);

export default AllUsers;