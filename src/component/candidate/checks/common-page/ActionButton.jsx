import React from "react";

const ActionButton = ({ active, type, icon, onClick }) => {
    const variants = {
        match: active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 border-slate-200',
        edit: active ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'text-slate-300 hover:bg-amber-50 hover:text-amber-600 border-slate-200',
        error: active ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'text-slate-300 hover:bg-rose-50 hover:text-rose-600 border-slate-200',
    };

    return (
        <button
            onClick={onClick}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border hover:border-transparent ${variants[type]}`}
        >
            {icon}
        </button>
    );
};

export default ActionButton;