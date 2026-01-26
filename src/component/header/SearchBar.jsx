import { Search, Loader2, User, Building2, Hash, AlertCircle, Clock, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useAuthApi } from "../../provider/AuthApiProvider.jsx";
import { CANDIDATE_SEARCH_API } from "../../constant/Endpoint.tsx";
import { METHOD } from "../../constant/ApplicationConstant.js";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ searchInputRef }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]); // New state for history
    const [showDropdown, setShowDropdown] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const dropdownRef = useRef(null);
    const { authenticatedRequest } = useAuthApi();
    const navigate = useNavigate();

    // Load recent searches from localStorage on mount
    useEffect(() => {
        const history = JSON.parse(localStorage.getItem("tu_recent_searches") || "[]");
        setRecentSearches(history);
    }, []);

    const saveToRecent = (item) => {
        const newHistory = [item, ...recentSearches.filter(h => h.candidateId !== item.candidateId)].slice(0, 5);
        setRecentSearches(newHistory);
        localStorage.setItem("tu_recent_searches", JSON.stringify(newHistory));
    };

    const clearRecent = (e) => {
        e.stopPropagation();
        setRecentSearches([]);
        localStorage.removeItem("tu_recent_searches");
    };

    const fetchResults = async (query) => {
        setLoading(true);
        setShowDropdown(true);
        try {
            const response = await authenticatedRequest({}, `${CANDIDATE_SEARCH_API}?q=${query}`, METHOD.GET);
            if (response.status === 200) {
                setResults(response.data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm.length > 2) {
            fetchResults(searchTerm);
        } else {
            setResults([]);
            if (searchTerm.length === 0) setShowDropdown(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED':
            case 'CLEARED': return 'bg-emerald-500';
            case 'IN_PROGRESS': return 'bg-indigo-500';
            case 'ACTION_REQUIRED': return 'bg-rose-500';
            default: return 'bg-slate-300';
        }
    };

    // Determine what content to show in dropdown
    const showRecent = isFocused && searchTerm.length === 0 && recentSearches.length > 0;

    return (
        <div className="relative" ref={dropdownRef}>
            <div className={`
                relative group hidden md:flex items-center bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl 
                transition-all duration-300 ease-in-out
                ${isFocused ? 'w-96 lg:w-[550px] border-[#5D4591]/40 bg-white shadow-md' : 'w-80 lg:w-[450px]'}
            `}>
                <Search size={20} className={`${isFocused ? 'text-[#5D4591]' : 'text-slate-400'} transition-colors`} />
                <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onFocus={() => setIsFocused(true)}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search candidates or case number..."
                    className="bg-transparent border-none outline-none ml-3 text-[15px] w-full text-slate-700 placeholder:text-slate-400 font-medium"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {loading ? <Loader2 size={16} className="animate-spin text-[#5D4591]" /> : (
                        <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border bg-white px-1.5 font-sans text-[10px] font-medium text-gray-400">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    )}
                </div>
            </div>

            {/* DROPDOWN SECTION */}
            {(showDropdown || showRecent) && (
                <div
                    onMouseDown={(e) => e.preventDefault()}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200"
                >
                    <div className="max-h-[380px] overflow-y-auto">

                        {/* 1. RECENT SEARCHES VIEW */}
                        {showRecent && (
                            <div className="p-2">
                                <div className="flex items-center justify-between px-3 py-2">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Searches</h3>
                                    <button onClick={clearRecent} className="text-[10px] font-bold text-[#5D4591] hover:underline cursor-pointer">Clear All</button>
                                </div>
                                {recentSearches.map((item) => (
                                    <button
                                        key={`recent-${item.candidateId}`}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                                        onClick={() => {
                                            navigate(`/candidate-details/${item.candidateId}`);
                                            setIsFocused(false);
                                        }}
                                    >
                                        <Clock size={16} className="text-slate-300 group-hover:text-[#5D4591]" />
                                        <div className="flex-1 text-left">
                                            <p className="text-sm font-bold text-slate-700">{item.name}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{item.caseNo} • {item.organizationName}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* 2. LIVE SEARCH RESULTS */}
                        {searchTerm.length > 2 && (
                            loading ? (
                                <div className="p-2 space-y-1">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                                            <div className="w-10 h-10 bg-slate-100 rounded-full" />
                                            <div className="flex-1 space-y-2"><div className="h-4 bg-slate-100 rounded w-1/3" /><div className="h-3 bg-slate-50 rounded w-1/2" /></div>
                                        </div>
                                    ))}
                                </div>
                            ) : results.length > 0 ? (
                                <div className="p-1.5">
                                    {results.map((item) => (
                                        <button
                                            key={item.candidateId}
                                            className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-50 transition-colors group text-left cursor-pointer"
                                            onClick={() => {
                                                saveToRecent(item);
                                                navigate(`/candidate-details/${item.candidateId}`);
                                                setShowDropdown(false);
                                                setIsFocused(false);
                                            }}
                                        >
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <div className="w-10 h-10 rounded-full bg-[#F9F7FF] flex items-center justify-center text-[#5D4591] shrink-0 border border-[#5D4591]/5">
                                                    <User size={18} />
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-sm font-bold text-slate-900 leading-none group-hover:text-[#5D4591] transition-colors">{item.name}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><Hash size={12} className="text-slate-300" /> {item.caseNo}</span>
                                                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><Building2 size={12} className="text-slate-300" /> {item.organizationName}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2.5 shrink-0 ml-4 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                <span className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`} />
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{item.status.replace('_', ' ')}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 text-center">
                                    <AlertCircle size={32} className="mx-auto text-slate-200 mb-3" />
                                    <p className="text-sm font-bold text-slate-400">No candidates found for "{searchTerm}"</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
