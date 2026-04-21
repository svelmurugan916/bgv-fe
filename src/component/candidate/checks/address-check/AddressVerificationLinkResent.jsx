import {Calendar, Clock, History, Smartphone} from "lucide-react";
import {formatFullDateTime} from "../../../../utils/date-util.js";
import React from "react";

const AddressVerificationLinkResent = ({addressData}) => {
    return (
        <div className="p-6 bg-amber-50/50 border border-amber-100 rounded-[2rem] animate-in slide-in-from-top-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm relative">
                        <Smartphone size={18} />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full flex items-center justify-center border-2 border-white">
                            <History size={8} />
                        </div>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Link Re-Sent To</p>
                        <p className="text-xs font-bold text-slate-700">{addressData.linkSentToMobile}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                        <Calendar size={18} />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Sent At</p>
                        <p className="text-xs font-bold text-slate-700">{formatFullDateTime(addressData.linkSentAt)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
                        <Clock size={18} />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-rose-400 uppercase">Expires At</p>
                        <p className="text-xs font-bold text-rose-600">{formatFullDateTime(addressData.linkExpiresAt)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddressVerificationLinkResent;