import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, Lock } from 'lucide-react';

const CustomDatePicker = ({
                              value,
                              onChange,
                              label,
                              error,
                              isMandatory,
                              readOnly = false,
                              placeholder = "Select date",
                              disableFuture = false,
                              icon: Icon,
                          }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempValue, setTempValue] = useState(value || "");
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());

    // Manual Input States
    const [dd, setDd] = useState("");
    const [mm, setMm] = useState("");
    const [yyyy, setYyyy] = useState("");

    const containerRef = useRef(null);
    const yearRef = useRef(null);

    // New Refs for Auto-focus
    const ddRef = useRef(null);
    const mmRef = useRef(null);
    const yyyyRef = useRef(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    const years = Array.from({ length: 100 }, (_, i) => (disableFuture ? today.getFullYear() : today.getFullYear() + 5) - i);

    // Synchronize inputs when tempValue changes
    useEffect(() => {
        if (tempValue) {
            const [y, m, d] = tempValue.split('-');
            setDd(d);
            setMm(m);
            setYyyy(y);
            const newDate = new Date(y, parseInt(m) - 1, d);
            if (!isNaN(newDate)) setViewDate(newDate);
        } else {
            setDd(""); setMm(""); setYyyy("");
        }
    }, [tempValue]);

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

    // Validation Check for Red Box
    const isManualInvalid = (dd !== "" && parseInt(dd) > 31) || (mm !== "" && parseInt(mm) > 12);

    const handleManualType = (type, val) => {
        const numericVal = val.replace(/\D/g, '');
        let newDd = dd, newMm = mm, newYyyy = yyyy;

        if (type === 'd') {
            if (numericVal.length <= 2) {
                setDd(numericVal);
                if (numericVal.length === 2) mmRef.current?.focus(); // Auto-focus MM
            }
            newDd = numericVal;
        }
        if (type === 'm') {
            if (numericVal.length <= 2) {
                setMm(numericVal);
                if (numericVal.length === 2) yyyyRef.current?.focus(); // Auto-focus YYYY
            }
            newMm = numericVal;
        }
        if (type === 'y') {
            if (numericVal.length <= 4) setYyyy(numericVal);
            newYyyy = numericVal;
        }

        // Attempt to form a valid date if all fields are filled
        if (newDd.length >= 1 && newMm.length >= 1 && newYyyy.length === 4) {
            const d = parseInt(newDd);
            const m = parseInt(newMm);
            const y = parseInt(newYyyy);

            if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
                const dateObj = new Date(y, m - 1, d);
                if (!isNaN(dateObj) && dateObj.getDate() === d) {
                    if (!(disableFuture && dateObj > today)) {
                        setTempValue(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
                    }
                }
            }
        }
    };

    const handleApply = () => {
        onChange(tempValue);
        setIsOpen(false);
    };

    const generateCalendarDays = () => {
        const month = viewDate.getMonth();
        const year = viewDate.getFullYear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
        const prevMonthDays = new Date(year, month, 0).getDate();
        const calendarDays = [];
        for (let i = firstDay - 1; i >= 0; i--) {
            calendarDays.push({ day: prevMonthDays - i, currentMonth: false, date: new Date(year, month - 1, prevMonthDays - i) });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            calendarDays.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
        }
        while (calendarDays.length < 42) {
            const nextDay = calendarDays.length - daysInMonth - firstDay + 1;
            calendarDays.push({ day: nextDay, currentMonth: false, date: new Date(year, month + 1, nextDay) });
        }
        return calendarDays;
    };

    return (
        <div className="relative w-full z-10" ref={containerRef}>
            <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2 ${error ? 'text-rose-500' : 'text-slate-500'}`}>
                {Icon && <Icon size={12} />} {label} {isMandatory && !readOnly && <span className="text-rose-500">*</span>}
            </label>

            <div
                onClick={() => !readOnly && setIsOpen(!isOpen)}
                className={`flex items-center justify-between px-4 py-3 border rounded-xl transition-all 
                ${readOnly ? 'bg-slate-50/50 border-slate-100 cursor-default' : 'bg-white cursor-pointer hover:border-slate-300'}
                ${error ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'}`}
            >
                <div className="flex items-center gap-3">
                    <CalendarIcon size={16} className={value ? "text-[#5D4591]" : "text-slate-300"} />
                    <span className={`text-xs font-bold ${value ? 'text-slate-700' : 'text-slate-400'}`}>
                        {value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : placeholder}
                    </span>
                </div>
                {!readOnly && <ChevronDown size={14} className="text-slate-300" />}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-slate-100 shadow-2xl rounded-[1.5rem] w-[300px] overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[110]">
                    <div className="p-4">
                        {/* Header Navigation */}
                        <div className="flex items-center justify-between mb-4 px-1">
                            <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))} className="p-1 hover:bg-slate-50 rounded-lg"><ChevronLeft size={18} className="text-slate-400" /></button>
                            <div className="flex items-center gap-2">
                                <button onClick={() => { setShowMonthPicker(!showMonthPicker); setShowYearPicker(false); }} className="text-sm font-black text-slate-700 uppercase tracking-tight hover:text-[#5D4591] flex items-center gap-0.5">
                                    {months[viewDate.getMonth()].substring(0, 3)} <ChevronDown size={12} />
                                </button>
                                <button onClick={() => { setShowYearPicker(!showYearPicker); setShowMonthPicker(false); }} className="text-sm font-black text-slate-700 uppercase tracking-tight hover:text-[#5D4591] flex items-center gap-0.5">
                                    {viewDate.getFullYear()} <ChevronDown size={12} />
                                </button>
                            </div>
                            <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))} className="p-1 hover:bg-slate-50 rounded-lg"><ChevronRight size={18} className="text-slate-400" /></button>
                        </div>

                        {/* TYPEABLE INPUT AREA */}
                        <div className="flex gap-2 mb-4">
                            <div className={`flex-1 flex items-center gap-1 px-3 py-2 border rounded-lg transition-colors
                                ${isManualInvalid ? 'border-rose-300 bg-rose-50' : 'border-slate-100 bg-slate-50/50'}`}>
                                <input
                                    type="text" placeholder="DD" value={dd}
                                    ref={ddRef}
                                    onChange={(e) => handleManualType('d', e.target.value)}
                                    className={`w-6 bg-transparent text-center text-[11px] font-black outline-none placeholder:text-slate-300 ${isManualInvalid ? 'text-rose-600' : 'text-[#5D4591]'}`}
                                />
                                <span className={isManualInvalid ? 'text-rose-300 text-[10px]' : 'text-slate-300 text-[10px]'}>/</span>
                                <input
                                    type="text" placeholder="MM" value={mm}
                                    ref={mmRef}
                                    onChange={(e) => handleManualType('m', e.target.value)}
                                    className={`w-6 bg-transparent text-center text-[11px] font-black outline-none placeholder:text-slate-300 ${isManualInvalid ? 'text-rose-600' : 'text-[#5D4591]'}`}
                                />
                                <span className={isManualInvalid ? 'text-rose-300 text-[10px]' : 'text-slate-300 text-[10px]'}>/</span>
                                <input
                                    type="text" placeholder="YYYY" value={yyyy}
                                    ref={yyyyRef}
                                    onChange={(e) => handleManualType('y', e.target.value)}
                                    className={`w-10 bg-transparent text-center text-[11px] font-black outline-none placeholder:text-slate-300 ${isManualInvalid ? 'text-rose-600' : 'text-[#5D4591]'}`}
                                />
                            </div>
                            <button onClick={() => setTempValue(`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`)} className="px-3 py-2 border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-colors">Today</button>
                        </div>

                        <div className="relative min-h-[220px]">
                            {showMonthPicker || showYearPicker ? (
                                <div className="absolute inset-0 bg-white z-10 grid grid-cols-3 gap-2 overflow-y-auto max-h-[220px] scrollbar-hide py-2">
                                    {showMonthPicker ? months.map((m, i) => (
                                        <button key={m} onClick={() => { setViewDate(new Date(viewDate.setMonth(i))); setShowMonthPicker(false); }} className={`py-3 text-[10px] font-black uppercase rounded-lg ${viewDate.getMonth() === i ? 'bg-[#5D4591] text-white' : 'hover:bg-slate-50 text-slate-600'}`}>{m.substring(0, 3)}</button>
                                    )) : years.map(y => (
                                        <button key={y} onClick={() => { setViewDate(new Date(viewDate.setFullYear(y))); setShowYearPicker(false); }} className={`py-3 text-[10px] font-black uppercase rounded-lg ${viewDate.getFullYear() === y ? 'bg-[#5D4591] text-white' : 'hover:bg-slate-50 text-slate-600'}`}>{y}</button>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-7 mb-1">
                                        {days.map(d => <div key={d} className="text-[10px] font-black text-slate-500 text-center py-1 uppercase">{d}</div>)}
                                    </div>
                                    <div className="grid grid-cols-7 gap-y-1">
                                        {generateCalendarDays().map((item, idx) => (
                                            <div key={idx} className="flex justify-center items-center">
                                                <button
                                                    disabled={disableFuture && item.date > today}
                                                    onClick={() => setTempValue(`${item.date.getFullYear()}-${String(item.date.getMonth()+1).padStart(2,'0')}-${String(item.date.getDate()).padStart(2,'0')}`)}
                                                    className={`w-8 h-8 rounded-full text-[11px] font-bold transition-all flex items-center justify-center
                                                        ${!item.currentMonth ? 'text-slate-400' : 'text-slate-600'}
                                                        ${disableFuture && item.date > today ? 'opacity-10 cursor-not-allowed' : 'hover:bg-slate-50'}
                                                        ${tempValue && new Date(tempValue).toDateString() === item.date.toDateString() ? 'bg-[#5D4591] text-white shadow-lg shadow-[#5D4591]/30' : ''}
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

                    <div className="flex gap-2 p-3 border-t border-slate-50 bg-slate-50/30">
                        <button onClick={() => setIsOpen(false)} className="flex-1 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                        <button onClick={handleApply} className="flex-1 py-2.5 bg-[#5D4591] rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-[#5D4591]/20 hover:-translate-y-0.5 transition-all">Apply</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDatePicker;
