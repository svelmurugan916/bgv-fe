import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const CustomDatePicker = ({
                              value,
                              onChange,
                              label,
                              error,
                              isMandatory,
                              placeholder = "Select date",
                              disableFuture = false // New Prop
                          }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
    const containerRef = useRef(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    // Generate years: if disableFuture is true, cap at current year
    const currentYear = new Date().getFullYear();
    const startYear = 1950;
    const endYear = disableFuture ? currentYear : currentYear + 10;
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                setShowMonthPicker(false);
                setShowYearPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const isFutureDate = (date) => {
        return disableFuture && date > today;
    };

    const generateCalendarDays = () => {
        const month = viewDate.getMonth();
        const year = viewDate.getFullYear();
        const daysInMonth = getDaysInMonth(month, year);
        const firstDay = getFirstDayOfMonth(month, year);
        const prevMonthDays = getDaysInMonth(month - 1, year);
        const calendarDays = [];

        for (let i = firstDay - 1; i >= 0; i--) {
            const d = new Date(year, month - 1, prevMonthDays - i);
            calendarDays.push({ day: prevMonthDays - i, currentMonth: false, date: d, disabled: isFutureDate(d) });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(year, month, i);
            calendarDays.push({ day: i, currentMonth: true, date: d, disabled: isFutureDate(d) });
        }
        const remaining = 42 - calendarDays.length;
        for (let i = 1; i <= remaining; i++) {
            const d = new Date(year, month + 1, i);
            calendarDays.push({ day: i, currentMonth: false, date: d, disabled: isFutureDate(d) });
        }
        return calendarDays;
    };

    const handleMonthChange = (monthIdx) => {
        if (disableFuture && viewDate.getFullYear() === currentYear && monthIdx > today.getMonth()) return;
        const newDate = new Date(viewDate);
        newDate.setMonth(monthIdx);
        setViewDate(newDate);
        setShowMonthPicker(false);
    };

    const handleYearChange = (year) => {
        const newDate = new Date(viewDate);
        newDate.setFullYear(year);
        // If switching to current year and current month is future, reset month to current
        if (disableFuture && year === currentYear && newDate.getMonth() > today.getMonth()) {
            newDate.setMonth(today.getMonth());
        }
        setViewDate(newDate);
        setShowYearPicker(false);
    };

    const navigateMonth = (direction) => {
        const nextDate = new Date(viewDate);
        nextDate.setMonth(viewDate.getMonth() + direction);

        if (disableFuture && nextDate > new Date(today.getFullYear(), today.getMonth(), 31)) return;

        setViewDate(nextDate);
    };

    const handleDateClick = (date) => {
        if (isFutureDate(date)) return;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        onChange(`${year}-${month}-${day}`);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {label} {isMandatory && <span className="text-rose-500">*</span>}
            </label>

            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 px-4 py-3.5 bg-white border rounded-2xl cursor-pointer transition-all
                ${error ? 'border-rose-500 ring-4 ring-rose-50' : 'border-slate-200 hover:border-slate-300 focus-within:border-[#5D4591]'}`}
            >
                <CalendarIcon size={18} className={value ? "text-[#5D4591]" : "text-slate-400"} />
                <span className={`text-sm  ${value ? 'text-slate-700' : 'text-slate-400'}`}>
                    {value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : placeholder}
                </span>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-slate-100 shadow-2xl rounded-[2rem] z-[100] w-[340px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-6 relative min-h-[340px]">

                        <div className="flex items-center justify-between mb-6 px-2">
                            <button onClick={() => navigateMonth(-1)} className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-[#5D4591] transition-colors">
                                <ChevronLeft size={20} />
                            </button>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => { setShowMonthPicker(!showMonthPicker); setShowYearPicker(false); }}
                                    className="flex items-center gap-1 px-3 py-1.5 hover:bg-slate-50 rounded-xl transition-colors text-sm font-black text-slate-700 uppercase tracking-tight"
                                >
                                    {months[viewDate.getMonth()]}
                                    <ChevronDown size={14} className="text-slate-400" />
                                </button>
                                <button
                                    onClick={() => { setShowYearPicker(!showYearPicker); setShowMonthPicker(false); }}
                                    className="flex items-center gap-1 px-3 py-1.5 hover:bg-slate-50 rounded-xl transition-colors text-sm font-black text-slate-700 uppercase tracking-tight"
                                >
                                    {viewDate.getFullYear()}
                                    <ChevronDown size={14} className="text-slate-400" />
                                </button>
                            </div>

                            <button
                                onClick={() => navigateMonth(1)}
                                disabled={disableFuture && viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear()}
                                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-[#5D4591] transition-colors disabled:opacity-0"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {showMonthPicker && (
                            <div className="absolute inset-0 top-[80px] bg-white z-10 p-6 grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2">
                                {months.map((m, i) => {
                                    const isFutureMonth = disableFuture && viewDate.getFullYear() === currentYear && i > today.getMonth();
                                    return (
                                        <button
                                            key={m}
                                            disabled={isFutureMonth}
                                            onClick={() => handleMonthChange(i)}
                                            className={`py-3 text-[11px] font-black uppercase rounded-xl transition-all 
                                                ${viewDate.getMonth() === i ? 'bg-[#5D4591] text-white shadow-lg shadow-[#5D4591]/20' : 'hover:bg-slate-50 text-slate-600'}
                                                ${isFutureMonth ? 'opacity-20 cursor-not-allowed' : ''}`}
                                        >
                                            {m.substring(0, 3)}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {showYearPicker && (
                            <div className="absolute inset-0 top-[80px] bg-white z-10 p-6 overflow-y-auto grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2 scrollbar-hide">
                                {years.map((y) => (
                                    <button
                                        key={y}
                                        onClick={() => handleYearChange(y)}
                                        className={`py-3 text-[11px] font-black uppercase rounded-xl transition-all 
                                            ${viewDate.getFullYear() === y ? 'bg-[#5D4591] text-white shadow-lg shadow-[#5D4591]/20' : 'hover:bg-slate-50 text-slate-600'}`}
                                    >
                                        {y}
                                    </button>
                                ))}
                            </div>
                        )}

                        {!showMonthPicker && !showYearPicker && (
                            <>
                                <div className="grid grid-cols-7 mb-2">
                                    {days.map(d => (
                                        <div key={d} className="text-[10px] font-black text-slate-300 text-center py-2 uppercase tracking-widest">{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-y-1">
                                    {generateCalendarDays().map((item, idx) => (
                                        <div key={idx} className="flex justify-center items-center p-1">
                                            <button
                                                disabled={item.disabled}
                                                onClick={() => handleDateClick(item.date)}
                                                className={`w-9 h-9 rounded-full text-xs font-bold transition-all flex items-center justify-center
                                                    ${!item.currentMonth ? 'text-slate-200' : 'text-slate-700'}
                                                    ${item.disabled ? 'opacity-20 cursor-not-allowed' : 'hover:bg-slate-50'}
                                                    ${value && new Date(value).toDateString() === item.date.toDateString() ? 'bg-[#5D4591] text-white shadow-lg shadow-[#5D4591]/30' : ''}
                                                `}
                                            >
                                                {item.day}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            {error && <p className="text-[10px] font-bold text-rose-500 mt-1.5 ml-1 uppercase">{error}</p>}
        </div>
    );
};

export default CustomDatePicker;
