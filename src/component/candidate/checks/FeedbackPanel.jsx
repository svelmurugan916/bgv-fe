import {FileTextIcon} from "lucide-react";

const FeedbackPanel = () => (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">Ops Remarks & Proof Attachment</label>
        <textarea className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:bg-white focus:border-[#5D4591]/40 transition-all min-h-[100px]" placeholder="Enter verification notes..." />
        <div className="mt-4 flex justify-between items-center">
            <button className="flex items-center gap-2 text-xs font-bold text-[#5D4591]"><FileTextIcon size={16}/> View Payslips</button>
            <button className="bg-slate-800 text-white px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg">Submit Verification</button>
        </div>
    </div>
);


export default FeedbackPanel;