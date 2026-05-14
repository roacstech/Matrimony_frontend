import React, { useEffect, useState } from "react";
import {
  getSentConnections,
  withdrawConnection,
  getAcceptedConnections,
} from "../../api/userApi";
import { getEnumLabel } from "../../utils/convertHelper";
import { XCircle } from "lucide-react";

const SentConnections = () => {
  const [sent, setSent] = useState([]);
  const [acceptedReceived, setAcceptedReceived] = useState([]);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const displayMode = "both";

  const triggerToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2000);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const sentRes = await getSentConnections();
        if (sentRes?.success && Array.isArray(sentRes.data)) setSent(sentRes.data);
      } catch (err) {
        console.error("Failed to load sent connections", err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadAccepted = async () => {
      try {
        const res = await getAcceptedConnections();
        if (res?.success)
          setAcceptedReceived((res.data || []).map((c) => ({ ...c, status: "Accepted" })));
      } catch (err) {
        console.error(err);
      }
    };
    loadAccepted();
  }, []);

  const handleWithdraw = async (connectionId) => {
    await withdrawConnection(connectionId);
    setSent((prev) => prev.filter((c) => c.connectionId !== connectionId));
    triggerToast("Request withdrawn");
  };

  const filteredSent = sent.filter(
    (c) =>
      c.status !== "Accepted" &&
      !acceptedReceived.some((a) => a.connectionId === c.connectionId)
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-50 text-green-600 border border-green-100";
      case "Rejected":
        return "bg-rose-50 text-rose-500 border border-rose-100";
      default:
        return "bg-yellow-50 text-yellow-600 border border-yellow-100";
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto min-h-screen relative">
      {/* Toast */}
      {toast.show && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-[#111827] text-white px-6 py-3 rounded-xl shadow-2xl text-xs font-medium uppercase tracking-widest border border-blue-500/30">
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Sent Requests</h2>
          <p className="text-xs text-gray-400 mt-0.5">{filteredSent.length} pending requests</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-100 text-[10px] font-semibold text-black-400 uppercase tracking-widest">
                <th className="px-6 py-4">Work / Occupation</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Raasi</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSent.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-black-300 font-medium">
                    No sent requests found
                  </td>
                </tr>
              )}
              {filteredSent.map((c) => (
                <tr key={c.connectionId} className="hover:bg-blue-50/20 transition-all">
                  <td className="px-6 py-4 text-sm font-medium text-[#111827]">
                    {c.receiver_work || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                    {c.receiver_city || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                    {getEnumLabel("raasi", c.receiver_raasi, displayMode)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium uppercase ${getStatusStyle(c.status)}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {c.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleWithdraw(c.connectionId)}
                      className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-500 rounded-lg text-[10px] font-medium uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <XCircle size={13} /> Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SentConnections; 