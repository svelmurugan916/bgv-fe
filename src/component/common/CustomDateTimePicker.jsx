import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronDown, ChevronLeft, ChevronRight, Check, Lock } from 'lucide-react';

const CustomDateTimePicker = ({
                                  value,
                                  onChange,
                                  label,
                                  error,
                                  isMandatory,
                                  placeholder = "Select date & time",
                                  disableFuture = false,
                                  readOnly = false, // New Prop
                                  icon: Icon,
                              }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('date');
    const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
    const containerRef = useRef(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentDate = value ? new Date(value) : new Date();
    const currentHour = currentDate.getHours();
    const displayHour = currentHour % 12 || 12;
    const displayMinute = Math.floor(currentDate.getMinutes() / 5) * 5;
    const period = currentHour >= 12 ? 'PM' : 'AM';

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setMode('date');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const updateDateTime = (newDatePart, newHour, newMinute, newPeriod) => {
        if (readOnly) return; // Safety check
        const d = newDatePart || new Date(currentDate);
        let h = newHour !== undefined ? newHour : displayHour;
        const m = newMinute !== undefined ? newMinute : displayMinute;
        const p = newPeriod !== undefined ? newPeriod : period;

        if (p === 'PM' && h < 12) h += 12;
        if (p === 'AM' && h === 12) h = 0;

        d.setHours(h);
        d.setMinutes(m);
        d.setSeconds(0);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');

        onChange(`${year}-${month}-${day}T${hh}:${mm}:00`);
    };

    const handleDateClick = (date) => {
        if (readOnly || (disableFuture && date > today)) return;
        updateDateTime(date);
        setMode('time');
    };

    return (
        <div className="relative w-full z-20" ref={containerRef}>
            <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-2 ${error ? 'text-rose-500' : 'text-slate-500'}`}>
                {Icon && <Icon size={12} />} {label} {isMandatory && !readOnly && <span className="text-rose-500">*</span>}
                {readOnly && <Lock size={10} className="text-slate-300" />}
            </label>

            <div
                onClick={() => !readOnly && setIsOpen(!isOpen)}
                className={`flex items-center justify-between px-4 py-3 border rounded-2xl transition-all 
                ${readOnly ? 'bg-slate-50/50 border-slate-100 cursor-default' : 'bg-white cursor-pointer hover:border-slate-200'}
                ${error ? 'border-rose-300 bg-rose-50/20' : 'border-slate-100'}`}
            >
                <div className="flex items-center gap-3">
                    <CalendarIcon size={16} className={value ? "text-[#5D4591]" : "text-slate-300"} />
                    <span className={`text-xs font-bold ${value ? 'text-slate-700' : 'text-slate-400'} ${readOnly && 'text-slate-500'}`}>
                        {value ? `${new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${displayHour}:${String(displayMinute).padStart(2, '0')} ${period}` : placeholder}
                    </span>
                </div>
                {!readOnly && <ChevronDown size={14} className="text-slate-300" />}
            </div>

            {isOpen && !readOnly && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-slate-100 shadow-2xl rounded-[2rem] w-[280px] overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))} className="p-1 hover:bg-white rounded-lg transition-colors"><ChevronLeft size={16} /></button>
                        <span className="text-[10px] font-black uppercase text-slate-700 tracking-widest">{months[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
                        <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))} className="p-1 hover:bg-white rounded-lg transition-colors"><ChevronRight size={16} /></button>
                    </div>

                    <div className="p-4">
                        {mode === 'date' ? (
                            <div className="animate-in slide-in-from-left-2 duration-200">
                                <div className="grid grid-cols-7 mb-2">
                                    {days.map(d => <div key={d} className="text-[8px] font-black text-slate-300 text-center uppercase">{d}</div>)}
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {generateCalendarDays().map((item, idx) => (
                                        <button
                                            key={idx}
                                            disabled={disableFuture && item.date > today}
                                            onClick={() => handleDateClick(item.date)}
                                            className={`h-8 w-8 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center
                                                ${!item.currentMonth ? 'text-slate-200' : 'text-slate-600 hover:bg-slate-50'}
                                                ${value && new Date(value).toDateString() === item.date.toDateString() ? 'bg-[#5D4591] text-white shadow-md shadow-[#5D4591]/20' : ''}
                                                ${disableFuture && item.date > today ? 'opacity-10 cursor-not-allowed' : ''}
                                            `}
                                        >
                                            {item.day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in slide-in-from-right-2 duration-200 space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <div className="text-center">
                                        <span className="text-[8px] font-black text-slate-300 uppercase block mb-2">Hour</span>
                                        <div className="grid grid-cols-3 gap-1">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => (
                                                <button key={h} onClick={() => updateDateTime(undefined, h)} className={`w-7 h-7 rounded-lg text-[10px] font-bold ${displayHour === h ? 'bg-[#5D4591] text-white' : 'hover:bg-slate-50 text-slate-600'}`}>{h}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-[1px] h-32 bg-slate-100 mx-2" />
                                    <div className="text-center">
                                        <span className="text-[8px] font-black text-slate-300 uppercase block mb-2">Min</span>
                                        <div className="grid grid-cols-2 gap-1">
                                            {[0, 15, 30, 45].map(m => (
                                                <button key={m} onClick={() => updateDateTime(undefined, undefined, m)} className={`w-9 h-7 rounded-lg text-[10px] font-bold ${displayMinute === m ? 'bg-[#5D4591] text-white' : 'hover:bg-slate-50 text-slate-600'}`}>{String(m).padStart(2, '0')}</button>
                                            ))}
                                        </div>
                                        <div className="mt-4 flex flex-col gap-1">
                                            {['AM', 'PM'].map(p => (
                                                <button key={p} onClick={() => updateDateTime(undefined, undefined, undefined, p)} className={`py-1 rounded-lg text-[10px] font-black ${period === p ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-400'}`}>{p}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                        <button
                            onClick={() => setMode(mode === 'date' ? 'time' : 'date')}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-[9px] font-black text-[#5D4591] uppercase tracking-tighter shadow-sm hover:shadow-md transition-all"
                        >
                            {mode === 'date' ? <><Clock size={12} /> Set Time</> : <><CalendarIcon size={12} /> Set Date</>}
                        </button>
                        <button onClick={() => setIsOpen(false)} className="w-8 h-8 bg-[#5D4591] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[#5D4591]/20 hover:scale-105 transition-all">
                            <Check size={16} />
                        </button>
                    </div>
                </div>
            )}
            {error && !readOnly && <p className="text-[9px] font-bold text-rose-500 mt-1.5 uppercase tracking-tight">{error}</p>}
        </div>
    );
};

export default CustomDateTimePicker;
