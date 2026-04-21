import {Calendar, Clock, History, Smartphone, Timer} from "lucide-react";
import {formatFullDateTime} from "../../../../utils/date-util.js";
import React from "react";

const AddressLinkSent = ({addressData, sendAddressVerificationLink}) => {
    return (
        <div className="p-12 bg-[#F9F7FF]/30 border-2 border-dashed border-[#5D4591]/20 rounded-[2.5rem] text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-[#5D4591] shadow-sm">
                <Timer size={40} className="animate-pulse" />
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2">Awaiting Candidate Submission</h3>
            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto font-medium">
                The verification link is active. We are waiting for the candidate to capture their location and photos.
            </p>

            <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 text-left shadow-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1">
                        <Smartphone size={10}/> Sent To
                    </p>
                    <p className="text-xs font-bold text-slate-700">{addressData.linkSentToMobile}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-100 text-left shadow-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1">
                        <Calendar size={10}/> Sent At
                    </p>
                    <p className="text-xs font-bold text-slate-700">{formatFullDateTime(addressData.linkSentAt)}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-100 text-left shadow-sm">
                    <p className="text-[9px] font-black text-[#E11D48] uppercase mb-1 flex items-center gap-1">
                        <Clock size={10}/> Expires At
                    </p>
                    <p className="text-xs font-bold text-rose-500">{formatFullDateTime(addressData.linkExpiresAt)}</p>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4">
                <button onClick={sendAddressVerificationLink} className=" bg-white text-[#5D4591] border border-[#5D4591]/20 px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-sm flex items-center gap-2 hover:bg-[#F9F7FF] transition-all cursor-pointer active:scale-95">
                    <History size={16} /> Re-send Verification Link
                </button>
                <p className="text-[10px] text-slate-400 font-medium italic">
                    Note: Re-sending the link will invalidate the previous one.
                </p>
            </div>
        </div>
    )
}
export default AddressLinkSent;