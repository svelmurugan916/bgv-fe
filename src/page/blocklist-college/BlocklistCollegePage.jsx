import React, { useState } from 'react';
import {
    Search, Plus, Trash2, GraduationCap,
    Filter, X, MapPin, AlertTriangle
} from 'lucide-react';

const BlocklistCollegePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [colleges, setColleges] = useState([
        { id: 1, name: "Global Institute of Tech", state: "Karnataka", reason: "Fake Degree", dateAdded: "Jan 15" },
        { id: 2, name: "National Academy", state: "Delhi", reason: "Unrecognized", dateAdded: "Nov 20" },
        { id: 3, name: "Pacific Management", state: "Maharashtra", reason: "Forgery", dateAdded: "Feb 05" },
        { id: 4, name: "Apex Engineering", state: "Tamil nadu", reason: "Blacklisted", dateAdded: "Mar 12" },
        { id: 5, name: "Zion Business School", state: "Uttar pradesh", reason: "Identity Theft", dateAdded: "Apr 01" },
    ]);

    const handleDelete = (id) => {
        if (window.confirm("Remove from blocklist?")) {
            setColleges(colleges.filter(c => c.id !== id));
        }
    };

    const filteredColleges = colleges.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans">
            {/* Header Section - Unchanged */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Blocklisted Colleges
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Manage and monitor flagged institutions.</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-[#5D4591] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#5D4591]/20 hover:bg-[#4a3675] transition-all active:scale-[0.98]"
                >
                    <Plus size={16} /> Add College
                </button>
            </div>

            {/* Search Bar - Slightly more compact */}
            <div className="flex gap-3 items-center mb-8">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#5D4591] focus:ring-4 ring-[#5D4591]/5 transition-all font-medium text-slate-700 text-sm shadow-sm"
                    />
                </div>
            </div>

            {/* COMPACT CARD GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredColleges.map((college) => (
                    <div
                        key={college.id}
                        className="group bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-[#5D4591]/30 transition-all duration-200"
                    >
                        <div className="flex items-start gap-3">
                            {/* Small Icon Container */}
                            <div className="shrink-0 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#5D4591]/10 group-hover:text-[#5D4591] transition-colors">
                                <GraduationCap size={18} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-sm font-bold text-slate-800 truncate pr-2 group-hover:text-[#5D4591] transition-colors">
                                        {college.name}
                                    </h3>
                                    <button
                                        onClick={() => handleDelete(college.id)}
                                        className="shrink-0 p-1 text-slate-300 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                {/* Only State Remains here */}
                                <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                            <MapPin size={10} /> {college.state}
                        </span>
                                </div>

                                {/* Minimal Reason Badge */}
                                <div className="mt-3 flex items-center gap-1.5 px-2 py-1 bg-rose-50/50 border border-rose-100/50 rounded-lg w-fit">
                                    <AlertTriangle size={10} className="text-rose-500" />
                                    <span className="text-[9px] font-black text-rose-600 uppercase tracking-tight">
                            {college.reason}
                        </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add College Modal - Kept consistent */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
                            <h2 className="text-xl font-bold text-slate-900">Add to Blocklist</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400"><X size={18} /></button>
                        </div>

                        <form className="p-6 space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">College Name</label>
                                <input type="text" placeholder="Institution name..." className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-[#5D4591] transition-all font-medium text-sm" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">State</label>
                                    <select className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-[#5D4591] transition-all font-medium text-sm appearance-none">
                                        <option>Select State</option>
                                        <option>KA</option>
                                        <option>DL</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Reason</label>
                                    <select className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:border-[#5D4591] transition-all font-medium text-sm appearance-none">
                                        <option>Forgery</option>
                                        <option>Unrecognized</option>
                                    </select>
                                </div>
                            </div>

                            <button className="w-full bg-[#5D4591] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#5D4591]/10 hover:bg-[#4a3675] transition-all mt-2">
                                Confirm & Add
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlocklistCollegePage;
