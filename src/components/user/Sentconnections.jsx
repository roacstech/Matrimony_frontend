import React, { useEffect, useState } from "react";
import {
  getSentConnections,
  withdrawConnection,
  getAcceptedConnections,
} from "../../api/userApi";
import { getEnumLabel } from "../../utils/convertHelper";
import { XCircle, Send } from "lucide-react";

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

  const getStatusBadge = (status) => {
    switch (status) {
      case "Accepted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-green-50 text-green-600 border border-green-100 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Accepted
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-500 border border-rose-100 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-yellow-50 text-yellow-600 border border-yellow-100 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">

      {/* Toast */}
      {toast.show && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-[#111827] text-white px-6 py-3 rounded-xl shadow-2xl text-xs font-medium uppercase tracking-widest border border-blue-500/30">
          {toast.msg}
        </div>
      )}

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <Send size={18} className="text-blue-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Sent Requests</h2>
        </div>
        <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full border border-blue-100">
          {filteredSent.length} pending
        </span>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Work / Occupation</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Raasi</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSent.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-14 text-sm text-gray-400">
                    No sent requests found
                  </td>
                </tr>
              ) : (
                filteredSent.map((c, idx) => (
                  <tr
                    key={c.connectionId}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      idx % 2 === 1 ? "bg-gray-50/40" : "bg-white"
                    }`}
                  >
                    {/* Occupation */}
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      {c.receiver_work || "—"}
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {c.receiver_city || "—"}
                    </td>

                    {/* Raasi */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {getEnumLabel("raasi", c.receiver_raasi, displayMode)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(c.status)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleWithdraw(c.connectionId)}
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-500 border border-rose-200 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
                      >
                        <XCircle size={13} /> Cancel
                      </button>
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

export default SentConnections;