import React, {useEffect, useRef, useState} from 'react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Bell,
    ChevronDown,
    LogOut,
    Plus,
    RefreshCcw,
    RotateCw,
    Settings,
    User, User2,
    Wallet
} from 'lucide-react';
import SearchBar from "./SearchBar.jsx";
import {useAuthApi} from "../../provider/AuthApiProvider.jsx";
import {useNavigate} from "react-router-dom";
import NotificationDropdown from "../notification/NotificationDropdown.jsx";
import {SYSTEM_USER} from "../../constant/ApplicationConstant.js";
import {useTenant} from "../../provider/TenantProvider.jsx";
import {useBalanceProvider} from "../../provider/BalanceProvider.jsx";

const NotificationBellSkeleton = () => (
    <div className="flex flex-col gap-2 p-4 animate-pulse">
        <div className="h-3 w-3/4 bg-slate-200 rounded"></div>
        <div className="h-3 w-full bg-slate-200 rounded"></div>
        <div className="h-3 w-2/3 bg-slate-200 rounded"></div>
    </div>
);

const Header = () => {
    const {user, logout, loggedInRole} = useAuthApi();
    const searchInputRef = useRef();
    const profileDropdownRef = useRef(null);
    const notificationsDropdownRef = useRef(null);
    const walletDropdownRef = useRef(null); // Added Wallet Ref
    const bellIconRef = useRef(null);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isWalletOpen, setIsWalletOpen] = useState(false); // Added Wallet State
    const [isNotificationsLoading] = useState(false);
    const {tenantConfig} = useTenant();
    const {wallet, loading, refreshBalance, latestTransaction} = useBalanceProvider();

    const navigate = useNavigate();

    const formatWalletBalance = (wallet) => {
        console.log(wallet);
        const totalBalance = wallet?.freeBalance;
        if (!totalBalance) return "0";
        if (totalBalance >= 1000) return (totalBalance / 1000).toFixed(1) + 'K';
        return totalBalance.toString();
    };

    // Handle Click Outside for all dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(event.target) &&
                bellIconRef.current && !bellIconRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
            if (walletDropdownRef.current && !walletDropdownRef.current.contains(event.target)) {
                setIsWalletOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const accountBatch = (role) => {
        switch (role) {
            case 'ROLE_TENANT_ADMIN':
                return "Admin Account";
            case 'ROLE_TENANT_OPERATIONS_MANAGER':
                return "Operations Manager";
            case 'ROLE_TENANT_OPERATIONS':
                return "Operations";
            default:
                return "System User";
        }
    }

    const toggleWallet = () => {
        setIsWalletOpen(prev => !prev);
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
    };

    const toggleNotifications = async () => {
        setIsNotificationsOpen(prev => !prev);
        setIsProfileOpen(false);
        setIsWalletOpen(false);
    };

    const toggleProfile = () => {
        setIsProfileOpen(prev => !prev);
        setIsNotificationsOpen(false);
        setIsWalletOpen(false);
    };

    // Mock Recent Transactions for the UI
    const recentTransactions = [
        {id: 1, type: 'debit', label: 'Aadhaar Check', amount: 45, date: 'Today'},
        {id: 2, type: 'credit', label: 'Wallet Top-up', amount: 5000, date: 'Yesterday'},
        {id: 2, type: 'credit', label: 'Wallet Top-up', amount: 5000, date: 'Yesterday'}
    ];

    const handleViewAllTransactionsClick = () => {
        toggleWallet();
        navigate('/transaction-activities');
    }

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-50">
            <div className="inline-flex flex-col items-start">
                <img src={tenantConfig?.logoUrl || "/logo.png"} alt="Vantira" className="h-8 w-auto"/>
                <span className="text-[8px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1 ml-1">
                    Powered by Vantira
                </span>
            </div>


            <SearchBar searchInputRef={searchInputRef}/>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-slate-400">
                    {
                        user?.userScope !== SYSTEM_USER && (
                            <div className="relative" ref={walletDropdownRef}>
                                {/* WALLET PILL (HEADER) */}
                                <div
                                    onClick={toggleWallet}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer group/wallet
                                    ${isWalletOpen ? 'bg-[#F9F7FF] border-[#5D4591]/30 shadow-sm' : 'bg-slate-50 border-slate-100 hover:bg-[#F9F7FF] hover:border-[#5D4591]/20'}`}
                                >
                                    <Wallet size={18}
                                            className={`${isWalletOpen ? 'text-[#5D4591]' : 'text-slate-400 group-hover/wallet:text-[#5D4591]'}`}/>

                                    {loading ? (
                                        <div className="w-10 h-3 bg-slate-200 animate-pulse rounded-full"/>
                                    ) : (
                                        <span
                                            className={`text-[11px] font-black tracking-tight ${isWalletOpen ? 'text-[#5D4591]' : 'text-slate-700 group-hover/wallet:text-[#5D4591]'}`}>
                                            {formatWalletBalance(wallet)}
                                        </span>
                                    )}
                                </div>

                                {/* WALLET DROPDOWN */}
                                <div className={`
                                    absolute right-0 top-full mt-3 w-80 bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] z-[100] overflow-hidden transition-all duration-300 origin-top-right
                                    ${isWalletOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}
                                `}>
                                    <div className="p-7">
                                        {/* HEADER SECTION */}
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Wallet
                                                Summary</h3>
                                            <span
                                                className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-lg uppercase tracking-widest border border-emerald-100/50">
                                                {loading ? "Updating..." : "Active"}
                                            </span>
                                        </div>

                                        {/* BALANCE CARD AREA */}
                                        <div
                                            className="relative bg-slate-50/50 border border-slate-100 rounded-3xl p-5 mb-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mb-1">Total
                                                        Spendable</p>
                                                    {loading ? (
                                                        <div
                                                            className="h-10 w-32 bg-slate-200 animate-pulse rounded-xl mt-2"/>
                                                    ) : (
                                                        <p className="text-4xl font-black text-[#0F172A] tracking-tighter">
                                                            ₹{(wallet?.freeBalance || 0).toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        refreshBalance();
                                                    }}
                                                    disabled={loading}
                                                    className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-full hover:border-[#5D4591]/30 hover:shadow-md transition-all text-slate-400 hover:text-[#5D4591]"
                                                >
                                                    <RotateCw size={16} strokeWidth={2.5}
                                                              className={loading ? 'animate-spin text-[#5D4591]' : ''}/>
                                                </button>
                                            </div>

                                            {/* BREAKDOWN SECTION - Perfect Uniformity Grid */}
                                            <div className="grid grid-cols-3 gap-0 pt-4 border-t border-slate-200/60">

                                                {/* CASH SECTION */}
                                                <div className="flex flex-col items-start pr-2">
                                                    <span
                                                        className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 whitespace-nowrap">
                                                        Cash
                                                    </span>
                                                    {loading ? (
                                                        <div
                                                            className="h-3 w-10 bg-slate-200 animate-pulse rounded-full mt-0.5"/>
                                                    ) : (
                                                        <span className="text-[11px] font-bold text-slate-700">
                                                            ₹{wallet?.availableBalance?.toLocaleString() || '0'}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* CREDIT SECTION */}
                                                <div className="flex flex-col items-start border-l border-slate-200 px-4">
                                                    <span
                                                        className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 whitespace-nowrap">
                                                        Credit
                                                    </span>
                                                    {loading ? (
                                                        <div
                                                            className="h-3 w-10 bg-slate-200 animate-pulse rounded-full mt-0.5"/>
                                                    ) : (
                                                        <span className="text-[11px] font-bold text-slate-700">
                                                            ₹{wallet?.creditBalance?.toLocaleString() || '0'}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* ON HOLD SECTION */}
                                                <div className="flex flex-col items-start border-l border-slate-200 pl-4">
                                                    <div className="flex items-center gap-1 mb-1">
                                                        <span
                                                            className="text-[8px] font-black text-amber-500 uppercase tracking-widest whitespace-nowrap">
                                                            On Hold
                                                        </span>
                                                        {/* Pulsing dot moved inside to ensure it doesn't push text */}
                                                        {!loading && (wallet?.reservedBalance > 0) && (
                                                            <div
                                                                className="w-1 h-1 rounded-full bg-amber-500 animate-pulse shrink-0"/>
                                                        )}
                                                    </div>

                                                    {loading ? (
                                                        <div
                                                            className="h-3 w-10 bg-amber-100 animate-pulse rounded-full mt-0.5"/>
                                                    ) : (
                                                        <span className="text-[11px] font-bold text-amber-600">
                                                            ₹{wallet?.reservedBalance?.toLocaleString() || '0'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>


                                        </div>


                                        {/* RECENT ACTIVITY SECTION */}
                                        <div className="space-y-4 mb-7">
                                            <div className="flex items-center justify-between px-1">
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Recent
                                                    Activity</p>
                                                <button
                                                    onClick={handleViewAllTransactionsClick}
                                                    className="text-[10px] text-[#5D4591] font-black uppercase tracking-widest hover:opacity-70 transition-opacity">View All
                                                </button>
                                            </div>

                                            {loading ? (
                                                <div className="space-y-3">
                                                    {[1, 2].map(i => (
                                                        <div key={i}
                                                             className="flex justify-between items-center animate-pulse p-1">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-slate-100 rounded-2xl"/>
                                                                <div className="space-y-2">
                                                                    <div className="h-2.5 w-20 bg-slate-100 rounded"/>
                                                                    <div className="h-2 w-12 bg-slate-50 rounded"/>
                                                                </div>
                                                            </div>
                                                            <div className="h-3 w-10 bg-slate-100 rounded"/>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                latestTransaction.map(tx => {
                                                    const isCredit = tx.transactionType.startsWith('CREDIT') || tx.transactionType.startsWith('RELEASE_RESERVATION');
                                                    return (
                                                        <div key={tx.id}
                                                             className="flex justify-between items-center p-1 group/tx">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover/tx:scale-110 ${isCredit ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                                                                    {isCredit ?
                                                                        <ArrowDownLeft size={18} strokeWidth={2.5}/> :
                                                                        <ArrowUpRight size={18} strokeWidth={2.5}/>}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                <span
                                                                    className="text-[13px] font-bold text-slate-700 leading-none mb-1 capitalize">{tx.transactionShortName?.toLowerCase()?.replace(/_/g, ' ')}</span>
                                                                    <span
                                                                        className="text-[10px] text-slate-400 font-medium">{new Date(tx?.transactionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                                </div>
                                                            </div>
                                                            <span
                                                                className={`text-[13px] font-black ${isCredit ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                            {isCredit ? '+' : '-'}₹{tx.amount}
                                                        </span>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </div>

                                        {/* ADD CREDITS BUTTON */}
                                        <button
                                            className="w-full py-4 bg-[#5D4591] text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#4a3675] transition-all shadow-xl shadow-[#5D4591]/25 flex items-center justify-center gap-2 active:scale-[0.98]">
                                            <Plus size={16} strokeWidth={3}/> Add Credits
                                        </button>
                                    </div>
                                </div>

                            </div>
                        )
                    }

                    {/* NOTIFICATION SECTION */}
                    <div className="relative">
                        <div ref={bellIconRef} onClick={toggleNotifications}
                             className="relative cursor-pointer hover:text-[#5D4591] transition-colors">
                            <Bell size={20}/>
                            <span
                                className="absolute -top-1 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </div>
                        {isNotificationsOpen && (
                            <div ref={notificationsDropdownRef}>
                                {isNotificationsLoading ? (
                                    <div
                                        className="absolute right-0 top-full mt-3 w-80 bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 z-[100] overflow-hidden">
                                        <div className="p-4 border-b border-slate-100"><h3
                                            className="text-lg font-bold text-slate-800">Notifications</h3></div>
                                        {Array.from({length: 3}).map((_, index) => <NotificationBellSkeleton
                                            key={index}/>)}
                                    </div>
                                ) : (
                                    <NotificationDropdown onClose={() => setIsNotificationsOpen(false)}/>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

                {/* PROFILE SECTION */}
                <div className="relative" ref={profileDropdownRef}>
                    <div onClick={toggleProfile} className="flex items-center gap-3 cursor-pointer group">
                        <div className="hidden lg:block text-right">
                            <p className="text-sm font-bold text-slate-800 leading-none">{user?.firstName} {user?.lastName}</p>
                            <p className="text-[11px] text-[#5D4591] mt-1 font-medium">{accountBatch(loggedInRole)}</p>
                        </div>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-[#F5F3FF] border-2 border-white ring-1 ring-slate-200 shadow-sm flex items-center justify-center overflow-hidden group-hover:ring-[#5D4591]/30 transition-all">
                                {user?.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User2
                                        size={22}
                                        strokeWidth={1.5}
                                        className="text-[#5D4591] mt-1 opacity-80"
                                    />
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                        </div>
                        <ChevronDown size={16}
                                     className={`text-slate-400 transition-all duration-300 ${isProfileOpen ? 'rotate-180 text-[#5D4591]' : 'group-hover:text-slate-600'}`}/>
                    </div>

                    <div className={`
                        absolute right-0 top-full mt-3 w-60 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] z-[100] overflow-hidden transition-all duration-300 origin-top-right
                        ${isProfileOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}
                    `}>
                        <div className="p-2">
                            <button
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#5D4591] rounded-xl transition-colors group">
                                <User size={16} className="text-slate-400 group-hover:text-[#5D4591]"/> Profile
                            </button>
                            <button onClick={() => navigate("/select-role")}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#5D4591] rounded-xl transition-colors group">
                                <RefreshCcw size={16} className="text-slate-400 group-hover:text-[#5D4591]"/> Switch
                                Role
                            </button>
                            <button
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#5D4591] rounded-xl transition-colors group">
                                <Settings size={16} className="text-slate-400 group-hover:text-[#5D4591]"/> Account
                                Settings
                            </button>
                            <div className="h-px bg-slate-50 my-2 mx-2"/>
                            <button onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors group">
                                <LogOut size={16}/> Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
