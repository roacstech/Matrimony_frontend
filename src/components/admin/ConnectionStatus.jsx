import React, { useEffect, useState } from "react";
import { Link2, Send, CheckCircle, RefreshCw, ChevronDown, ChevronUp, Filter, Search, X } from "lucide-react";

// Mock helpers (replace with real imports in your project)
const getEnumLabel = (type, value) => value || "—";
const getUserAllConnections = async () => ({
  total: 5,
  connections: [
    { connectionId: 1, direction: "sent", status: "Accepted", from_user_name: "Arun Kumar", from_user_gender: "Male", from_user_occupation: "Engineer", from_user_city: "Chennai", to_user_name: "Priya S", to_user_gender: "Female", to_user_city: "Bangalore", created_at: "2024-03-10" },
    { connectionId: 2, direction: "received", status: "Sent", from_user_name: "Karthik R", from_user_gender: "Male", from_user_occupation: "Doctor", from_user_city: "Coimbatore", to_user_name: "Meena T", to_user_gender: "Female", to_user_city: "Madurai", created_at: "2024-03-12" },
    { connectionId: 3, direction: "sent", status: "Rejected", from_user_name: "Suresh B", from_user_gender: "Male", from_user_occupation: "Teacher", from_user_city: "Trichy", to_user_name: "Anitha K", to_user_gender: "Female", to_user_city: "Salem", created_at: "2024-03-14" },
    { connectionId: 4, direction: "received", status: "Accepted", from_user_name: "Divya M", from_user_gender: "Female", from_user_occupation: "Nurse", from_user_city: "Erode", to_user_name: "Rajesh P", to_user_gender: "Male", to_user_city: "Vellore", created_at: "2024-03-15" },
    { connectionId: 5, direction: "sent", status: "Sent", from_user_name: "Vinoth C", from_user_gender: "Male", from_user_occupation: "Architect", from_user_city: "Ooty", to_user_name: "Kavitha L", to_user_gender: "Female", to_user_city: "Kochi", created_at: "2024-03-16" },
  ],
});

const ConnectionStatus = () => {
  const [allConnections, setAllConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, sent: 0, received: 0 });
  const [expandedCard, setExpandedCard] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const displayMode = "both";

  useEffect(() => { loadConnections(); }, []);

  const loadConnections = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserAllConnections();
      const connections = data?.connections || [];
      setAllConnections(connections);
      setStats({
        total: data?.total || connections.length,
        sent: connections.filter((c) => c.direction === "sent").length,
        received: connections.filter((c) => c.direction === "received").length,
      });
    } catch (err) {
      setError(err.message || "Failed to load connections");
      setAllConnections([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredConnections = allConnections.filter((c) => {
    if (filterType !== "all") {
      if (filterType === "sent" && c.direction !== "sent") return false;
      if (filterType === "received" && c.direction !== "received") return false;
      if (filterType === "accepted" && c.status !== "Accepted") return false;
    }
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    const searchLower = searchTerm.toLowerCase();
    if (searchTerm && !c.from_user_name?.toLowerCase().includes(searchLower) && !c.to_user_name?.toLowerCase().includes(searchLower)) return false;
    return true;
  });

  const getConnectionTypeLabel = (connection) => {
    if (connection.status === "Accepted") return "Accepted";
    if (connection.direction === "sent") return "Sent";
    if (connection.direction === "received") return "Received";
    return "—";
  };

  const getStatusBadge = (status) => {
    const styles = {
      Accepted: "bg-green-50 text-green-600 border-green-100",
      Rejected: "bg-rose-50 text-rose-500 border-rose-100",
    };
    const dots = {
      Accepted: "bg-green-500",
      Rejected: "bg-rose-500",
    };
    const label = status === "Sent" ? "Pending" : status;
    const style = styles[status] || "bg-yellow-50 text-yellow-600 border-yellow-100";
    const dot = dots[status] || "bg-yellow-500";
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border uppercase ${style}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        {label}
      </span>
    );
  };

  const getDirectionBadge = (connection) => {
    const label = getConnectionTypeLabel(connection);
    if (label === "Sent") return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-600 border border-purple-100 uppercase">
        <Send size={10} /> Sent
      </span>
    );
    if (label === "Received") return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-100 uppercase">
        <Link2 size={10} /> Received
      </span>
    );
    if (label === "Accepted") return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-50 text-green-600 border border-green-100 uppercase">
        <CheckCircle size={10} /> Accepted
      </span>
    );
    return <span className="text-gray-400 text-xs">—</span>;
  };

  // Mobile card for each connection
  const MobileCard = ({ c, idx }) => {
    const isExpanded = expandedCard === c.connectionId;
    return (
      <div className={`border border-gray-100 rounded-2xl overflow-hidden transition-all ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
        {/* Card Header - always visible */}
        <button
          className="w-full text-left px-4 py-3.5 flex items-start justify-between gap-3"
          onClick={() => setExpandedCard(isExpanded ? null : c.connectionId)}
        >
          <div className="flex-1 min-w-0">
            {/* Sender → Receiver */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-gray-800 truncate">{c.from_user_name || "—"}</span>
              <span className="text-gray-300 font-bold text-xs">→</span>
              <span className="text-sm font-bold text-gray-800 truncate">{c.to_user_name || "—"}</span>
            </div>
            {/* Badges row */}
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {getDirectionBadge(c)}
              {getStatusBadge(c.status)}
              {c.created_at && (
                <span className="text-[10px] text-gray-400">
                  {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              )}
            </div>
          </div>
          <span className="text-gray-400 mt-1 shrink-0">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>

        {/* Expanded details */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3 mt-3">
              {/* Sender section */}
              <div className="bg-purple-50/50 rounded-xl p-3 space-y-1.5">
                <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wide mb-2">Sender</p>
                <DetailRow label="Name" value={c.from_user_name} />
                <DetailRow label="Gender" value={getEnumLabel("gender", c.from_user_gender, displayMode)} />
                <DetailRow label="Occupation" value={c.from_user_occupation} />
                <DetailRow label="City" value={c.from_user_city} />
              </div>
              {/* Receiver section */}
              <div className="bg-blue-50/50 rounded-xl p-3 space-y-1.5">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide mb-2">Receiver</p>
                <DetailRow label="Name" value={c.to_user_name} />
                <DetailRow label="Gender" value={getEnumLabel("gender", c.to_user_gender, displayMode)} />
                <DetailRow label="City" value={c.to_user_city} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const DetailRow = ({ label, value }) => (
    <div>
      <p className="text-[9px] text-gray-400 uppercase font-semibold">{label}</p>
      <p className="text-xs text-gray-700 font-medium">{value || "—"}</p>
    </div>
  );

  const activeFilterCount = [filterType !== "all", filterStatus !== "all", searchTerm !== ""].filter(Boolean).length;

  return (
    <div className="space-y-4  max-w-7xl mx-auto">

      {/* ── Top bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Link2 size={18} className="text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Connection Status</h2>
        </div>

        {/* Stats + Refresh */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full border border-blue-100">
            Total: {stats.total}
          </span>
          <span className="px-3 py-1 text-xs font-semibold text-purple-600 bg-purple-50 rounded-full border border-purple-100">
            Sent: {stats.sent}
          </span>
          <span className="px-3 py-1 text-xs font-semibold text-green-600 bg-green-50 rounded-full border border-green-100">
            Received: {stats.received}
          </span>
          <button
            onClick={loadConnections}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full border border-gray-200 transition cursor-pointer"
          >
            <RefreshCw size={11} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Search + Filter toggle ── */}
      <div className="flex gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter toggle button (mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`sm:hidden flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold rounded-xl border transition ${showFilters || activeFilterCount > 0 ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200"}`}
        >
          <Filter size={14} />
          {activeFilterCount > 0 && (
            <span className={`text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ${showFilters ? "bg-white text-blue-600" : "bg-blue-600 text-white"}`}>
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Desktop filters inline */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Direction:</span>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-blue-400 transition">
              <option value="all">All</option>
              <option value="sent">Sent</option>
              <option value="received">Received</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Status:</span>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-blue-400 transition">
              <option value="all">All</option>
              <option value="Sent">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Mobile filter panel (collapsible) ── */}
      {showFilters && (
        <div className="sm:hidden flex flex-col gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Filters</span>
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setFilterType("all"); setFilterStatus("all"); }}
                className="text-xs text-rose-500 font-semibold"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-gray-500 uppercase block mb-1.5">Direction</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-blue-400 transition">
                <option value="all">All</option>
                <option value="sent">Sent</option>
                <option value="received">Received</option>
                <option value="accepted">Accepted</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-500 uppercase block mb-1.5">Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-blue-400 transition">
                <option value="all">All</option>
                <option value="Sent">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
          <p className="text-sm text-rose-600">{error}</p>
        </div>
      )}

      {/* ── MOBILE: Cards layout ── */}
      <div className="sm:hidden space-y-2.5">
        {loading ? (
          <div className="flex items-center justify-center py-14 text-sm text-gray-400 gap-2">
            <RefreshCw size={14} className="animate-spin" /> Loading connections...
          </div>
        ) : filteredConnections.length === 0 ? (
          <div className="text-center py-14 text-sm text-gray-400">
            {searchTerm || filterType !== "all" || filterStatus !== "all"
              ? "No connections found matching your filters"
              : "No connections found"}
          </div>
        ) : (
          filteredConnections.map((c, idx) => (
            <MobileCard key={c.connectionId} c={c} idx={idx} />
          ))
        )}
      </div>

      {/* ── DESKTOP: Table layout ── */}
      <div className="hidden sm:block bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1300px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-4 text-xs font-semibold text-gray-500">#</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-700 bg-purple-50/60">Sender Name</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-700 bg-purple-50/60">Sender Gender</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-700 bg-purple-50/60">Sender Occupation</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-700 bg-purple-50/60">Sender Location</th>
                <th className="px-3 py-4 text-xs font-bold text-gray-300 text-center">→</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-700 bg-blue-50/60">Receiver Name</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-700 bg-blue-50/60">Receiver Gender</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-700 bg-blue-50/60">Receiver Location</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500">Direction</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500">Status</th>
                <th className="px-5 py-4 text-xs font-semibold text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="12" className="text-center py-14 text-sm text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw size={14} className="animate-spin" /> Loading connections...
                    </div>
                  </td>
                </tr>
              ) : filteredConnections.length === 0 ? (
                <tr>
                  <td colSpan="12" className="text-center py-14 text-sm text-gray-400">
                    {searchTerm || filterType !== "all" || filterStatus !== "all"
                      ? "No connections found matching your filters"
                      : "No connections found"}
                  </td>
                </tr>
              ) : (
                filteredConnections.map((c, idx) => (
                  <tr key={c.connectionId} className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors ${idx % 2 === 1 ? "bg-gray-50/30" : "bg-white"}`}>
                    <td className="px-5 py-4 text-xs text-gray-400 font-medium">{idx + 1}</td>
                    <td className="px-5 py-4 bg-purple-50/20"><span className="text-sm font-semibold text-gray-800">{c.from_user_name || "—"}</span></td>
                    <td className="px-5 py-4 text-sm text-gray-600 bg-purple-50/20">{getEnumLabel("gender", c.from_user_gender, displayMode) || "—"}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 bg-purple-50/20">{c.from_user_occupation || "—"}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 bg-purple-50/20">{c.from_user_city || "—"}</td>
                    <td className="px-3 py-4 text-center text-gray-300 font-bold text-lg">→</td>
                    <td className="px-5 py-4 bg-blue-50/20"><span className="text-sm font-semibold text-gray-800">{c.to_user_name || "—"}</span></td>
                    <td className="px-5 py-4 text-sm text-gray-600 bg-blue-50/20">{getEnumLabel("gender", c.to_user_gender, displayMode) || "—"}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 bg-blue-50/20">{c.to_user_city || "—"}</td>
                    <td className="px-5 py-4">{getDirectionBadge(c)}</td>
                    <td className="px-5 py-4">{getStatusBadge(c.status)}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredConnections.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-400">
              Showing <span className="font-semibold text-gray-600">{filteredConnections.length}</span> of <span className="font-semibold text-gray-600">{stats.total}</span> connections
            </p>
          </div>
        )}
      </div>

      {/* Mobile footer count */}
      {!loading && filteredConnections.length > 0 && (
        <div className="sm:hidden px-1 pb-1">
          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-600">{filteredConnections.length}</span> of <span className="font-semibold text-gray-600">{stats.total}</span> connections
          </p>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;