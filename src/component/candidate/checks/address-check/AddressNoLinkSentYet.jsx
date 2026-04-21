import {MapPin, Send} from "lucide-react";
import React from "react";

const AddressNoLinkSentYet = ({sendAddressVerificationLink}) => {
    return (
        <div className="p-12 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center">
            <div className="w-20 h-20 bg-[#F9F7FF] rounded-full flex items-center justify-center mx-auto mb-6 text-[#5D4591]">
                <MapPin size={40} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No Address Data Submitted</h3>
            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">The candidate has not completed the digital address verification yet.</p>
            <button onClick={sendAddressVerificationLink} className="bg-[#5D4591] text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 mx-auto hover:bg-[#4a3675] transition-all cursor-pointer">
                <Send size={16} /> Send Verification Link
            </button>
        </div>
    )
}

export default AddressNoLinkSentYet