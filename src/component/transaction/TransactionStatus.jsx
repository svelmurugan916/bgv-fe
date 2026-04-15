import React from 'react';
import { CheckCircle2 } from 'lucide-react';

// 1. Status & Type Badges
export const TransactionStatus = ({ status }) => {
    const styles = {
        SUCCESS: "bg-emerald-50 text-emerald-700 border-emerald-100",
        PENDING: "bg-amber-50 text-amber-700 border-amber-100",
        FAILED: "bg-red-50 text-red-700 border-red-100",
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[status] || styles.PENDING}`}>
            {status === 'SUCCESS' && <CheckCircle2 size={10} className="inline mr-1 mb-0.5" />}
            {status}
        </span>
    );
};