import React from 'react';
import { ArrowUpRight, ArrowDownLeft} from 'lucide-react';


export const TransactionTypeBadge = ({ type }) => {
    const isCredit = [
        'CREDIT_TOPUP', 'CREDIT_BONUS', 'CREDIT_REFUND', 'RELEASE_RESERVATION', 'ADJUSTMENT_CREDIT'
    ].includes(type);

    return (
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isCredit ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"
            }`}>
                {isCredit ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
            </div>
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight truncate max-w-[120px]">
                {type.replace(/_/g, ' ')}
            </span>
        </div>
    );
};