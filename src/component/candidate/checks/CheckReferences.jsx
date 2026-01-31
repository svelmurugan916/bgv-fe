import React from 'react';
import { Users, Mail, Phone, Send, CheckCircle2, Clock } from 'lucide-react';
import FeedbackForm from "./FeedbackForm.jsx";

const CheckReferences = () => {
    const references = [
        { name: 'Dr. Robert Fox', email: 'robert.f@univ.edu', status: 'Responded', relationship: 'Professor' },
        { name: 'Suresh Kumar', email: 'suresh@techcorp.com', status: 'Pending', relationship: 'Manager' }
    ];

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Professional References</h2>
                <button className="bg-[#5D4591] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase flex items-center gap-2 shadow-lg shadow-[#5D4591]/10">
                    <Send size={14} /> Resend All Requests
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {references.map((ref, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[9px] font-bold uppercase ${ref.status === 'Responded' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {ref.status}
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#5D4591]/10 group-hover:text-[#5D4591] transition-all">
                                <Users size={24} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">{ref.name}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ref.relationship}</p>
                            </div>
                        </div>
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-xs text-slate-500"><Mail size={14}/> {ref.email}</div>
                        </div>
                        <button className="w-full py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold uppercase text-slate-600 hover:bg-white hover:border-[#5D4591]/40 hover:text-[#5D4591] transition-all">
                            View Questionnaire Response
                        </button>
                    </div>
                ))}
            </div>
            <FeedbackForm />
        </div>
    );
};

export default CheckReferences;
