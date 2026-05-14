    import React, { useEffect, useState } from "react";
    import {
    getReceivedConnections,
    acceptConnection,
    rejectConnection,
    getUserProfile,
    getAcceptedConnections,
    } from "../../api/userApi";
    import { viewProfile } from "../../api/profilesApi";
    import { getEnumLabel } from "../../utils/convertHelper";
    import { calculateAge } from "../../utils/dateHelper";
    import { X, CheckCircle, XCircle, Eye } from "lucide-react";

    const ReceivedConnections = () => {
    const [received, setReceived] = useState([]);
    const [acceptedReceived, setAcceptedReceived] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [toast, setToast] = useState({ show: false, msg: "" });

    const Img_Url = import.meta.env.VITE_IMG_URL;
    const displayMode = "both";

    const triggerToast = (msg) => {
        setToast({ show: true, msg });
        setTimeout(() => setToast({ show: false, msg: "" }), 2000);
    };

    const formatTime12h = (time) => {
        if (!time) return "—";
        const [hours, minutes] = time.split(":");
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    };

    const isExpired = (createdAt) =>
        Date.now() - new Date(createdAt).getTime() >= 24 * 60 * 60 * 1000;

    useEffect(() => {
        const load = async () => {
        try {
            const receivedRes = await getReceivedConnections();
            if (receivedRes?.success && Array.isArray(receivedRes.data))
            setReceived(receivedRes.data);
        } catch (err) {
            console.error("Failed to load received connections", err);
        }
        };
        load();
    }, []);

    useEffect(() => {
        const loadAccepted = async () => {
        try {
            const res = await getAcceptedConnections();
            if (res?.success) {
            setAcceptedReceived((res.data || []).map((c) => ({ ...c, status: "Accepted" })));
            }
        } catch (err) {
            console.error("Failed to load accepted connections", err);
        }
        };
        loadAccepted();
    }, []);

    const refreshAccepted = async () => {
        try {
        const res = await getAcceptedConnections();
        if (res?.success)
            setAcceptedReceived((res.data || []).map((c) => ({ ...c, status: "Accepted" })));
        } catch (err) {
        console.error(err);
        }
    };

    const handleAccept = async (connectionId) => {
        const res = await acceptConnection(connectionId);
        if (!res.success) return triggerToast(res.message || "Accept failed");
        triggerToast("Connection accepted");
        setReceived((prev) => prev.filter((c) => c.connectionId !== connectionId));
        await refreshAccepted();
    };

    const handleReject = async (connectionId) => {
        const res = await rejectConnection(connectionId);
        if (!res.success) return triggerToast(res.message || "Reject failed");
        triggerToast("Connection rejected");
        setReceived((prev) => prev.filter((c) => c.connectionId !== connectionId));
    };

    const handleViewProfile = async (userId, fuser, profileId) => {
        if (!profileId) return triggerToast("Profile ID missing");
        try {
        const token = localStorage.getItem("accesstoken");
        const payload = JSON.parse(atob(token.split(".")[1]));
        const trackRes = await viewProfile(payload.id, profileId);
        if (trackRes.success) {
            const res = await getUserProfile(userId);
            if (res.success) setSelectedUser(res.data);
            else triggerToast("Could not load profile");
        } else {
            triggerToast(trackRes.message || "Failed to initialize view");
        }
        } catch (err) {
        console.error(err);
        triggerToast("Error opening profile");
        }
    };

    const allRows = [...received, ...acceptedReceived];

    const getStatus = (c) => {
        if (c.status === "Accepted") return "accepted";
        if (isExpired(c.created_at)) return "expired";
        return "pending";
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
            <h2 className="text-lg font-semibold text-[#111827]">Received Connections</h2>
            <p className="text-xs text-gray-400 mt-0.5">{allRows.length} total requests</p>
            </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">

            <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
                <thead>
                <tr className="bg-gray-100 border-b border-gray-100 text-[10px] font-semibold text-black-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Gender</th>
                    <th className="px-6 py-4">Occupation</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                {allRows.length === 0 && (
                    <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-300 font-medium">
                        No received requests found
                    </td>
                    </tr>
                )}
                {allRows.map((c) => {
                    const status = getStatus(c);
                    return (
                    <tr
                        key={c.connectionId}
                        className={`transition-all ${status === "expired" ? "opacity-40" : "hover:bg-blue-50/20"}`}
                    >
                        <td className="px-6 py-4 text-sm font-medium text-[#111827]">
                        {getEnumLabel("gender", c.gender, displayMode)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                        {c.occupation || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                        {c.city || "—"}
                        </td>
                        <td className="px-6 py-4">
                        {status === "accepted" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium bg-green-50 text-green-600 border border-green-100 uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Accepted
                            </span>
                        )}
                        {status === "expired" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium bg-gray-100 text-gray-400 uppercase">
                            Expired
                            </span>
                        )}
                        {status === "pending" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium bg-yellow-50 text-yellow-600 border border-yellow-100 uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Pending
                            </span>
                        )}
                        </td>
                        <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                            {status === "accepted" && (
                            <button
                                onClick={() => handleViewProfile(c.user_id, c.from_user, c.profileId)}
                                className="cursor-pointer flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-[#1A5AF0] rounded-lg text-[10px] font-medium uppercase tracking-widest hover:bg-[#1A5AF0] hover:text-white transition-all"
                            >
                                <Eye size={13} /> View
                            </button>
                            )}
                            {status === "pending" && (
                            <>
                                <button
                                onClick={() => handleAccept(c.connectionId)}
                                className="cursor-pointer flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-[#1A5AF0] rounded-lg text-[10px] font-medium uppercase tracking-widest hover:bg-[#1A5AF0] hover:text-white transition-all"
                                >
                                <CheckCircle size={13} /> Accept
                                </button>
                                <button
                                onClick={() => handleReject(c.connectionId)}
                                className="cursor-pointer flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-500 rounded-lg text-[10px] font-medium uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                                >
                                <XCircle size={13} /> Reject
                                </button>
                            </>
                            )}
                            {status === "expired" && (
                            <span className="text-[10px] text-gray-300 font-medium uppercase">—</span>
                            )}
                        </div>
                        </td>
                    </tr>
                    );
                })}
                </tbody>
            </table>
            </div>
        </div>

        {/* PROFILE MODAL */}
        {selectedUser && (
            <div className="fixed inset-0 bg-[#111827]/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
            <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl relative p-8 border border-gray-100">
                <button
                onClick={() => setSelectedUser(null)}
                className="cursor-pointer absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-[#F1F5F9] text-[#111827] hover:bg-[#1A5AF0] hover:text-white transition-all shadow-md z-[120]"
                >
                <X size={16} />
                </button>

                <div className="flex flex-col items-center mb-12 text-center">
                <div className="relative mb-4">
                    <img
                    src={`${Img_Url}/photos/${selectedUser.photo}`}
                    className="w-28 h-28 object-cover rounded-3xl shadow-2xl bg-gray-100 border-4 border-white"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#1A5AF0] w-6 h-6 rounded-full border-4 border-white" />
                </div>
                <h2 className="text-2xl font-semibold text-[#111827]">{selectedUser.full_name}</h2>
                <p className="text-[10px] font-medium text-[#1A5AF0] uppercase tracking-[0.3em] mt-2">
                    {selectedUser.city} • {selectedUser.country}
                </p>
                <p className="text-[10px] font-medium text-gray-400 tracking-[0.2em] mt-1">
                    {selectedUser.email}
                </p>
                </div>

                <div className="space-y-12">
                <Section title="Personal Information / தனிப்பட்ட விவரங்கள்">
                    <Row label="Gender / பாலினம்" value={getEnumLabel("gender", selectedUser.gender, displayMode)} />
                    <Row label="Date of Birth / பிறந்த தேதி" value={selectedUser.dob?.split("T")[0]} />
                    <Row label="Age / வயது" value={selectedUser?.dob ? `${calculateAge(selectedUser.dob)} Years` : "—"} />
                    <Row label="Birth Place / பிறந்த இடம்" value={selectedUser.birth_place} />
                    <Row label="Birth Time / பிறந்த நேரம்" value={formatTime12h(selectedUser.birth_time)} />
                    <Row label="Marital Status / திருமண நிலை" value={getEnumLabel("maritalStatus", selectedUser.marital_status, displayMode)} />
                    <Row label="Email / மின்னஞ்சல்" value={selectedUser.email} />
                    <Row label="Phone / தொலைபேசி" value={selectedUser.phone} />
                </Section>
                <Section title="Education & Career / கல்வி & தொழில்">
                    <Row label="Education / கல்வி" value={selectedUser.education} />
                    <Row label="Occupation / தொழில்" value={selectedUser.occupation} />
                    <Row label="Income / வருமானம்" value={selectedUser.income} />
                    <Row label="Work Location / வேலை இடம்" value={selectedUser.workLocation || selectedUser.work_location} />
                </Section>
                <Section title="Family Details / குடும்ப விவரங்கள்">
                    <Row label="Father / தந்தை" value={selectedUser.father_name} />
                    <Row label="Mother / தாய்" value={selectedUser.mother_name} />
                    <Row label="Grandfather / தாத்தா" value={selectedUser.grandfather_name} />
                    <Row label="Grandmother / பாட்டி" value={selectedUser.grandmother_name} />
                    <Row label="Mother's Grandfather / தாய்வழி தாத்தா" value={selectedUser.mother_side_grandfather_name} />
                    <Row label="Mother's Grandmother / தாய்வழி பாட்டி" value={selectedUser.mother_side_grandmother_name} />
                    <Row label="Siblings / உடன்பிறப்புகள்" value={selectedUser.siblings} />
                </Section>
                <Section title="Astrology / ஜாதகம்">
                    <Row label="Raasi / இராசி" value={getEnumLabel("raasi", selectedUser.raasi, displayMode)} />
                    <Row label="Star / நட்சத்திரம்" value={getEnumLabel("star", selectedUser.star, displayMode)} />
                    <Row label="Dosham / தோஷம்" value={getEnumLabel("dosham", selectedUser.dosham, displayMode)} />
                </Section>
                <Section title="Address / முகவரி">
                    <Row label="Address / முகவரி" value={selectedUser.address} />
                    <Row label="City / நகரம்" value={selectedUser.city} />
                    <Row label="Country / நாடு" value={selectedUser.country} />
                </Section>
                <Section title="Horoscope / ஜாதகம் கோப்பு">
                    <div className="pt-1">
                    {selectedUser.horoscope_uploaded ? (
                        <button
                        onClick={() => window.open(`${import.meta.env.VITE_IMG_URL}/photos/${selectedUser.horoscope_file_name}`, "_blank")}
                        className="cursor-pointer bg-[#1A5AF0] text-white px-8 py-3 rounded-full text-[10px] font-medium uppercase tracking-widest shadow-sm hover:bg-[#111827] transition-all"
                        >
                        View Horoscope / ஜாதகம் பார்க்க
                        </button>
                    ) : (
                        <div className="bg-gray-100 text-gray-400 px-6 py-2 rounded-full text-xs font-medium italic w-fit">
                        Not Uploaded / பதிவேற்றம் இல்லை
                        </div>
                    )}
                    </div>
                </Section>
                </div>
            </div>
            </div>
        )}
        </div>
    );
    };

    const Section = ({ title, children }) => (
    <div>
        <h3 className="text-xs font-semibold text-[#111827] uppercase tracking-[0.25em] mb-6 flex items-center gap-4">
        {title}
        <span className="h-[2px] w-8 bg-blue-100 rounded-full" />
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>
    </div>
    );

    const Row = ({ label, value }) => (
    <div className="flex flex-col gap-2">
        <label className="text-[10px] text-[#1A5AF0] font-medium uppercase tracking-wider ml-1">{label}</label>
        <div className="bg-[#F8FAFC] border border-gray-50 rounded-xl px-4 py-3 text-sm text-[#111827] font-medium shadow-sm">
        {value || <span className="text-gray-300 font-normal italic">—</span>}
        </div>
    </div>
    );

    export default ReceivedConnections;