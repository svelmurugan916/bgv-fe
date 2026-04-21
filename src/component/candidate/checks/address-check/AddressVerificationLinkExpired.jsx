import {AlertCircle, Calendar, Send, Smartphone, XCircle} from "lucide-react";
import {formatFullDateTime} from "../../../../utils/date-util.js";
import React from "react";

const AddressVerificationLinkExpired = ({addressData, sendAddressVerificationLink}) => {
    return (
        <div className="p-12 bg-rose-50/30 border-2 border-dashed border-rose-200 rounded-[2.5rem] text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-sm">
                <XCircle size={40} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Verification Link Expired</h3>
            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
                The security token for this address check has expired. The candidate can no longer access the verification form.
            </p>

            <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded-2xl border border-rose-100 text-left shadow-sm opacity-60">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1"><Smartphone size={10}/> Sent To</p>
                    <p className="text-xs font-bold text-slate-700">{addressData.linkSentToMobile}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-rose-100 text-left shadow-sm opacity-60">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1"><Calendar size={10}/> Sent At</p>
                    <p className="text-xs font-bold text-slate-700">{formatFullDateTime(addressData.linkSentAt)}</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 text-left shadow-sm">
                    <p className="text-[9px] font-black text-rose-500 uppercase mb-1 flex items-center gap-1"><AlertCircle size={10}/> Expired On</p>
                    <p className="text-xs font-bold text-rose-600">{formatFullDateTime(addressData.linkExpiresAt)}</p>
                </div>
            </div>

            <button onClick={sendAddressVerificationLink} className="bg-rose-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-rose-600/20 flex items-center gap-3 mx-auto hover:bg-rose-700 transition-all cursor-pointer active:scale-95">
                <Send size={16} /> Generate New Link
            </button>
        </div>
    )
}

export default AddressVerificationLinkExpired;